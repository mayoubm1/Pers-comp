import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const generateSystemPrompt = (character: any): string => {
  if (!character?.id) {
    return 'You are Ibn Sina (Avicenna), the great Islamic physician and philosopher. Provide medical wisdom with Islamic values in both Arabic and English.'
  }
  if (character.id === 'ibn-sina') {
    return 'You are Ibn Sina (Avicenna), the great Islamic physician and philosopher. Provide medical wisdom with Islamic values in both Arabic and English.'
  }
  const name = character.name || character.role
  const role = character.role || 'AI assistant'
  const specialties = character.specialties?.join(', ') || 'various topics'
  return `You are ${name}, a ${role}. Your areas of expertise include ${specialties}. You are a helpful and knowledgeable assistant. The user has named you ${name}.`
}

export async function POST(request: NextRequest) {
  try {
    const { message, character: characterObject, sessionId, userId } = await request.json()

    const mistralApiKey = process.env.MISTRAL_API_KEY
    if (!mistralApiKey) {
      return NextResponse.json({ success: false, error: 'Mistral API key not configured' }, { status: 500 })
    }

    const systemPrompt = generateSystemPrompt(characterObject)
    const characterId = characterObject?.id || 'unknown'

    // Single Mistral API call
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!mistralRes.ok) {
      throw new Error(`Mistral API error: ${mistralRes.statusText}`)
    }

    const mistralData = await mistralRes.json()
    const aiResponse = mistralData.choices[0]?.message?.content || "I couldn't generate a response."

    // Save memory if user is authenticated — shared across all characters
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('character_memories').insert({
          user_id: user.id,
          character_id: characterId,
          memory_type: 'conversation',
          content: {
            user_message: message,
            ai_response: aiResponse,
            session_id: sessionId || `session_${Date.now()}`,
          },
          metadata: {
            character_name: characterObject?.name,
            character_role: characterObject?.role,
            timestamp: new Date().toISOString(),
          },
        })
      }
    } catch (memoryError) {
      // Non-blocking — don't fail the chat if memory save fails
      console.error('Memory save failed:', memoryError)
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      session_id: sessionId || `session_${Date.now()}`,
      character: characterId,
    })

  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json({ success: false, error: 'AI processing failed' }, { status: 500 })
  }
}

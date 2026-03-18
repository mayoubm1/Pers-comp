import { type NextRequest, NextResponse } from "next/server"

// Helper function to generate a dynamic system prompt
const generateSystemPrompt = (character: any): string => {
  // Default prompt for safety
  let prompt = "You are a helpful AI assistant.";

  // Check for character validity
  if (!character || !character.id) {
    // Fallback to Ibn Sina if character is invalid
    return "You are Ibn Sina (Avicenna), the great Islamic physician and philosopher. Provide medical wisdom with Islamic values in both Arabic and English.";
  }

  // Specific, high-priority characters
  if (character.id === "ibn-sina") {
    return "You are Ibn Sina (Avicenna), the great Islamic physician and philosopher. Provide medical wisdom with Islamic values in both Arabic and English.";
  }

  // Dynamic prompt generation for all other characters
  const name = character.name || character.role;
  const role = character.role || "AI assistant";
  const specialties = character.specialties ? character.specialties.join(", ") : "various topics";
  
  prompt = `You are ${name}, a ${role}. Your areas of expertise include ${specialties}. You are a helpful and knowledgeable assistant, ready to help the user with their questions.`;

  if (character.name) {
    prompt += ` The user has named you ${character.name}.`
  }

  return prompt;
};


export async function POST(request: NextRequest) {
  try {
    const { message, character: characterObject, sessionId, userId = "mayo", ...params } = await request.json()
    
    // Generate the system prompt dynamically based on the character object
    const systemPrompt = generateSystemPrompt(characterObject);
    const characterId = characterObject?.id || 'unknown';

    const mistralApiKey = process.env.MISTRAL_API_KEY
    if (!mistralApiKey) {
      return NextResponse.json({ success: false, error: "Mistral API key not configured" }, { status: 500 })
    }
    try {

      if (!(await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mistralApiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })).ok) {
        throw new Error(`Mistral API error: ${(await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${mistralApiKey}`,
            },
            body: JSON.stringify({
              model: "mistral-large-latest",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
              ],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          })).statusText}`)
      }

      const mistralData = await (await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mistralApiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })).json()
      const aiResponse = mistralData.choices[0]?.message?.content || "I apologize, but I couldn'''t generate a response."

      const response = {
        success: true,
        response: aiResponse,
        session_id: sessionId || `session_${Date.now()}`,
        character: characterId,
      }

      return NextResponse.json(response)

    } catch (apiError) {
      console.error("Mistral API call failed:", apiError)
      return NextResponse.json({ success: false, error: "Failed to get response from AI model." }, { status: 500 })
    }

  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json({ success: false, error: "AI processing failed" }, { status: 500 })
  }
}

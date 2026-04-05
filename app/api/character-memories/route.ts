import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get('character_id')
  const memoryType = searchParams.get('memory_type')

  let query = supabase
    .from('character_memories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Filter by character if specified, otherwise return ALL memories across all characters
  if (characterId) query = query.eq('character_id', characterId)
  if (memoryType) query = query.eq('memory_type', memoryType)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ character_memories: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { character_id, memory_type, content, metadata } = await request.json()

  if (!character_id || !memory_type || !content) {
    return NextResponse.json({ error: 'character_id, memory_type and content are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('character_memories')
    .insert({ user_id: user.id, character_id, memory_type, content, metadata })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ memory: data })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Memory id required' }, { status: 400 })

  const { error } = await supabase
    .from('character_memories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

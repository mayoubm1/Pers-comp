'use client'

import { useEffect, useState } from 'react'

type Memory = {
  id: string
  character_id: string
  memory_text: string
}

export default function CharacterMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMemories() {
      try {
        const response = await fetch('/api/character-memories')
        if (!response.ok) {
          throw new Error('Failed to fetch memories')
        }
        const data = await response.json()
        setMemories(data.character_memories || [])
      } catch (error) {
        setError(error.message)
      }
    }

    fetchMemories()
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Character Memories</h1>
      <ul>
        {memories.map((memory) => (
          <li key={memory.id} className="mb-2">
            <p><strong>Character ID:</strong> {memory.character_id}</p>
            <p><strong>Memory:</strong> {memory.memory_text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function CreateCharacter() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [description, setDescription] = useState('')
  const [gender, setGender] = useState('')
  const [specialties, setSpecialties] = useState('')
  const [error, setError] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setError('You must be logged in to create a character.')
        return;
    }

    if (!name || !role) {
        setError('Name and Role are required.');
        return;
    }

    // The specialties field in the DB is of type text[], so we format it
    const specialtiesArray = specialties.split(',').map(s => s.trim());

    const { error: insertError } = await supabase.from('characters').insert([
      {
        user_id: user.id,
        name,
        role,
        description,
        gender,
        specialties: specialtiesArray,
      },
    ])

    if (insertError) {
      setError(`Failed to create character: ${insertError.message}`)
    } else {
      router.push('/characters')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-emerald-400">Forge Your Character</h1>

        <form onSubmit={handleCreateCharacter} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300">Role</label>
              <input id="role" type="text" value={role} onChange={(e) => setRole(e.target.value)} required className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300">Gender</label>
            <input id="gender" type="text" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label htmlFor="specialties" className="block text-sm font-medium text-gray-300">Specialties (comma-separated)</label>
            <input id="specialties" type="text" value={specialties} onChange={(e) => setSpecialties(e.target.value)} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full px-4 py-3 font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            Forge Character
          </button>
        </form>
      </div>
    </div>
  )
}


import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// This page is a user's private dashboard to view and manage their characters.

export default async function CharactersPage() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: characters, error } = await supabase
    .from('characters')
    .select(`id, name, role, description, avatar_url, gender, specialties`)
    .eq('user_id', session.user.id)

  if (error) {
    console.error('Error fetching characters:', error)
  }

  const defaultAvatar = '/default-avatar.png'; // A path to a default avatar in the public folder

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white pt-20">
      <div className="w-full max-w-4xl p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-emerald-400">Your Characters</h1>
          <Link href="/characters/create" className="px-4 py-2 font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700">
            Create New Character
          </Link>
        </div>

        {error && <p className="text-red-500">Could not fetch characters. Please try again later.</p>}

        {characters && characters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div key={character.id} className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
                <img 
                  src={character.avatar_url || defaultAvatar} 
                  alt={character.name} 
                  className="w-24 h-24 rounded-full mx-auto object-cover" 
                />
                <div className="text-center mt-4">
                    <h2 className="text-xl font-bold">{character.name}</h2>
                    <p className="text-gray-400">{character.role || 'No role assigned'}</p>
                    {character.gender && <p className="text-sm text-gray-500 mt-1">{character.gender}</p>}
                </div>
                <p className="text-sm text-gray-300 mt-4 flex-grow">{character.description}</p>
                {character.specialties && character.specialties.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-bold text-emerald-400">Specialties:</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {character.specialties.map(spec => (
                                <span key={spec} className="px-2 py-1 text-xs text-white bg-emerald-700 rounded-full">{spec}</span>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-800 rounded-lg">
            <p>You have not created any characters yet.</p>
            <p className="mt-2 text-sm text-gray-400">Why not create your first one?</p>
          </div>
        )}
      </div>
    </div>
  )
}

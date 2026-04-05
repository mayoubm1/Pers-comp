'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignIn = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/characters')
      router.refresh()
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError('')
    setMessage('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
    } else if (data.user && !data.session) {
      setMessage('Check your email to confirm your account before signing in.')
    } else if (data.session) {
      // Auto-confirmed (email confirmations disabled in Supabase)
      await createUserProfile(data.user!.id, email)
      router.push('/characters')
      router.refresh()
    }
    setLoading(false)
  }

  const createUserProfile = async (userId: string, email: string) => {
    await supabase.from('users').upsert({
      auth_user_id: userId,
      email,
      username: email.split('@')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'auth_user_id' })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-xs p-8 space-y-4 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-emerald-400">Wellness Companion</h1>
        <p className="text-center text-sm text-gray-400">Sign in or create an account</p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
          className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {message && <p className="text-emerald-400 text-sm text-center">{message}</p>}

        <div className="space-y-2">
          <button
            onClick={handleSignIn}
            disabled={loading || !email || !password}
            className="w-full px-4 py-2 font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
          <button
            onClick={handleSignUp}
            disabled={loading || !email || !password}
            className="w-full px-4 py-2 font-bold text-gray-300 bg-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}

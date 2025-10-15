export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
        <p className="text-gray-300">
          There was an error during the authentication process. Please try signing in again.
        </p>
        <a href="/login" className="inline-block px-4 py-2 font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700">
          Back to Login
        </a>
      </div>
    </div>
  )
}

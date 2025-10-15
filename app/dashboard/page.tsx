
import { createServerComponentClient } from '';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Welcome, Visionary.</h1>
      <p className="mt-4 text-lg">Your companions are gathering. The stage is being set.</p>
      <p className="mt-2 text-md text-gray-400">This is the dawn of the one big happy family.</p>
    </div>
  );
}

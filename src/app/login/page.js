'use client';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithPassword } from '../../actions/auth';
import { LockKeyhole } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginWithPassword, null);

  useEffect(() => {
    if (state?.success) {
      window.location.href = '/';
    }
  }, [state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-zinc-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
            <LockKeyhole size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ZeeNotes Login</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">Enter your 6-digit PIN to access your personal workspace.</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <input
              type="password"
              name="password"
              maxLength={6}
              pattern="\d{6}"
              required
              placeholder="••••••"
              className="w-full text-center text-4xl tracking-[1em] font-mono py-4 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-950 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
            {state?.error && (
              <p className="text-red-500 text-sm mt-3 text-center font-medium">{state.error}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? 'Verifying...' : 'Unlock Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}

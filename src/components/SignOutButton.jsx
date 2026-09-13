'use client';
import { LogOut } from 'lucide-react';
import { logout } from '@/actions/auth';
import { useTransition } from 'react';

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors disabled:opacity-50"
      title="Sign Out"
    >
      <LogOut size={20} />
    </button>
  );
}

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { StickyNote, Book, Layers } from 'lucide-react';
import SettingsModal from './SettingsModal';
import ThemeToggle from './ThemeToggle';
import SignOutButton from './SignOutButton';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Sticky Notes', icon: StickyNote },
    { href: '/diary', label: 'Personal Diary', icon: Book },
  ];

  return (
    <nav className="w-full bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-[100] px-4 md:px-6 h-16 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex bg-gradient-to-br from-emerald-400 to-cyan-500 p-2 rounded-xl text-white shadow-md shadow-emerald-500/20">
          <Layers size={22} />
        </div>
        <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-600 hidden md:block mr-87">
          ZeeNotes
        </h1>

        <div className="flex items-center gap-2 p-1 bg-gray-100/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-zinc-700/50">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                  ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-zinc-700/50'
                  }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <SettingsModal />
        <SignOutButton />
      </div>
    </nav>
  );
}

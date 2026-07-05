import React from 'react';
import { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import Sidebar from './Sidebar';
import LanguageSwitcher from '../common/LanguageSwitcher';

const avatarImages = {
  admin: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
  member: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=100&q=80',
  coach: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=100&q=80',
};

export default function DashboardShell({ role, kicker, title, userName, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const roleLabel = role === 'admin' ? 'Administrator' : role === 'coach' ? 'Coach' : 'Member';

  return (
    <div className="app-surface h-screen overflow-hidden lg:grid lg:grid-cols-[18rem_1fr]">
      <div className="hidden h-screen lg:block">
        <Sidebar role={role} />
      </div>

      <div className="flex h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center justify-between border-b border-black/5 bg-white/92 px-4 backdrop-blur-xl md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="grid h-11 w-11 shrink-0 place-items-center rounded border border-line bg-white text-ink shadow-sm transition hover:border-primary hover:text-primary lg:hidden"
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="section-kicker">{kicker}</p>
              <h1 className="mt-1 truncate text-lg font-black tracking-tight">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded border border-black/10 bg-white px-4 py-3 shadow-sm md:flex">
              <input className="w-44 bg-transparent text-sm outline-none xl:w-56" placeholder="Search..." />
              <Search className="h-4 w-4 text-muted" />
            </div>
            <LanguageSwitcher compact tone="light" className="hidden md:inline-flex" />
            <div className="flex items-center gap-3">
              <img className="h-10 w-10 rounded object-cover" src={avatarImages[role]} alt={roleLabel} />
              <div className="hidden md:block">
                <p className="text-sm font-bold">{userName}</p>
                <p className="text-xs text-muted">{roleLabel}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>

      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <button
          className={`absolute inset-0 bg-black/60 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar backdrop"
        />
        <div className={`absolute inset-y-0 left-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar role={role} onNavigate={() => setSidebarOpen(false)} />
        </div>
        <button
          className={`absolute left-[18.5rem] top-4 grid h-10 w-10 place-items-center rounded bg-white text-ink shadow-lg transition lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

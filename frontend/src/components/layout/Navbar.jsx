import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/#home', hash: '#home', home: true },
  { label: 'Services', href: '/#services', hash: '#services' },
  { label: 'Plans', href: '/#plans', hash: '#plans', path: '/pricing' },
  { label: 'Coaches', href: '/#coaches', hash: '#coaches', path: '/coaches' },
  { label: 'Contact', href: '/#contact', hash: '#contact', path: '/contact' },
];

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const savedUser = user || readSavedUser();
  const accountHref = savedUser ? (savedUser.role === "admin" ? "/admin" : savedUser.role === "coach" ? "/coach/dashboard" : "/member") : "/login";
  const accountLabel = savedUser ? "Dashboard" : "Client Login";

  useEffect(() => {
    const updateNavbar = () => setIsScrolled(window.scrollY > 12);
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
    return () => window.removeEventListener('scroll', updateNavbar);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  const isActiveLink = (item) => {
    if (item.home) return location.pathname === '/' && (!location.hash || location.hash === item.hash);
    if (item.path && location.pathname === item.path) return true;
    return location.pathname === '/' && location.hash === item.hash;
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-30 border-b transition duration-300 ${
      isScrolled ? 'border-white/10 bg-ink shadow-2xl shadow-black/30' : 'border-white/10 bg-transparent'
    }`}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 text-white">
        <Link className="flex items-center gap-3 text-xl font-black uppercase tracking-tight text-white transition hover:text-primary" to="/">
          <span className="grid h-10 w-10 place-items-center rounded bg-primary"><Zap className="h-5 w-5 fill-white text-white" /></span>
          FitManager
        </Link>

        <div className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.16em] md:flex">
          {navLinks.map((item) => (
            <a
              className={`${isActiveLink(item) ? 'text-primary' : 'text-white'} transition hover:text-primary`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
          <Link className="rounded bg-primary px-5 py-3 text-white shadow-2xl shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-600" to={accountHref}>{accountLabel}</Link>
        </div>

        <button
          className="grid h-12 w-12 place-items-center rounded border border-white/15 bg-white/10 text-white transition hover:border-primary hover:text-primary md:hidden"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div className={`fixed inset-0 top-20 z-40 md:hidden ${isMenuOpen ? '' : 'pointer-events-none'}`}>
        <button
          className={`absolute inset-0 bg-black/60 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          type="button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        />
        <div className={`relative mx-4 overflow-hidden rounded-b-lg border border-white/10 bg-ink shadow-2xl shadow-black/40 transition duration-300 ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`}>
          <div className="grid gap-1 p-4">
            {navLinks.map((item) => (
              <a
                className={`rounded px-4 py-3 text-sm font-black uppercase tracking-[0.16em] transition ${isActiveLink(item) ? 'bg-primary text-white' : 'text-white hover:bg-white/10 hover:text-primary'}`}
                href={item.href}
                key={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              className="mt-2 rounded bg-primary px-4 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-600"
              to={accountHref}
              onClick={() => setIsMenuOpen(false)}
            >
              {accountLabel}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("fitmanager_user"));
  } catch {
    return null;
  }
}

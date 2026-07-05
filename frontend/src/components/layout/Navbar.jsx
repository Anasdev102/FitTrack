import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

const navLinks = [
  { labelKey: 'nav.home', href: '/#home', hash: '#home', home: true },
  { labelKey: 'nav.services', href: '/#services', hash: '#services' },
  { labelKey: 'nav.plans', href: '/#plans', hash: '#plans', path: '/pricing' },
  { labelKey: 'nav.coaches', href: '/#coaches', hash: '#coaches', path: '/coaches' },
  { labelKey: 'nav.contact', href: '/#contact', hash: '#contact', path: '/contact' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const savedUser = user || readSavedUser();
  const accountHref = savedUser ? (savedUser.role === "admin" ? "/admin" : savedUser.role === "coach" ? "/coach/dashboard" : "/member") : "/login";
  const accountLabel = savedUser ? t('nav.dashboard') : t('nav.clientLogin');

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
        <Link className="group flex items-center gap-3 text-xl font-black uppercase tracking-tight text-white transition hover:text-primary" to="/">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary shadow-lg shadow-primary/25 transition duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3"><Zap className="h-5 w-5 fill-white text-white" /></span>
          FT
        </Link>

        <div className="hidden items-center gap-6 text-[11px] font-black uppercase tracking-[0.14em] md:flex">
          {navLinks.map((item) => (
            <a
              className={`relative py-2 transition duration-300 hover:-translate-y-0.5 hover:text-primary ${isActiveLink(item) ? 'text-primary after:absolute after:inset-x-1 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary' : 'text-white/90'}`}
              href={item.href}
              key={item.href}
            >
              {t(item.labelKey)}
            </a>
          ))}
          <LanguageSwitcher compact className="h-10 rounded-full px-3" />
          <Link className="rounded-full bg-primary px-4 py-2.5 text-[11px] text-white shadow-xl shadow-orange-950/25 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-500" to={accountHref}>{accountLabel}</Link>
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
                className={`rounded px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] transition ${isActiveLink(item) ? 'bg-primary text-white' : 'text-white hover:bg-white/10 hover:text-primary'}`}
                href={item.href}
                key={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(item.labelKey)}
              </a>
            ))}
            <LanguageSwitcher compact className="mx-4 my-2 justify-center" />
            <Link
              className="mt-2 rounded bg-primary px-4 py-2.5 text-center text-xs font-black uppercase tracking-[0.12em] text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-600"
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

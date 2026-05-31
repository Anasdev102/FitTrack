import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Zap } from 'lucide-react';

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
  const savedUser = user || readSavedUser();
  const accountHref = savedUser ? (savedUser.role === "admin" ? "/admin" : savedUser.role === "coach" ? "/coach/dashboard" : "/member") : "/login";
  const accountLabel = savedUser ? "Dashboard" : "Client Login";

  useEffect(() => {
    const updateNavbar = () => setIsScrolled(window.scrollY > 12);
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
    return () => window.removeEventListener('scroll', updateNavbar);
  }, []);

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
      </nav>
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

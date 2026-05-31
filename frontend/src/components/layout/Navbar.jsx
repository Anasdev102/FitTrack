import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Zap } from 'lucide-react';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const savedUser = user || readSavedUser();
  const accountHref = savedUser ? (savedUser.role === "admin" ? "/admin" : savedUser.role === "coach" ? "/coach/dashboard" : "/member") : "/login";
  const accountLabel = savedUser ? "Dashboard" : "Client Login";

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-black/88 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 text-white">
        <Link className="flex items-center gap-3 text-xl font-black uppercase tracking-tight" to="/">
          <span className="grid h-10 w-10 place-items-center rounded bg-primary"><Zap className="h-5 w-5 fill-white text-white" /></span>
          FitManager
        </Link>
        <div className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.16em] md:flex">
          <a className="transition hover:text-primary" href="/#home">Home</a>
          <a className="transition hover:text-primary" href="/#services">Services</a>
          <a className="transition hover:text-primary" href="/#plans">Plans</a>
          <a className="transition hover:text-primary" href="/#coaches">Coaches</a>
          <a className="transition hover:text-primary" href="/#contact">Contact</a>
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

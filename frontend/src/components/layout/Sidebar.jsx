import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Activity,
  Bot,
  CalendarClock,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  UserRound,
  UserCheck,
  WalletCards,
  Zap,
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/members', icon: Users, label: 'Members' },
  { to: '/admin/subscriptions?view=requests', icon: Activity, label: 'Subscription Requests' },
  { to: '/admin/subscriptions?view=all', icon: WalletCards, label: 'Subscriptions' },
  { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { to: '/admin/coaches', icon: Dumbbell, label: 'Coaches' },
  { to: '/admin/coach-assignments', icon: UserCheck, label: 'Coach Assignments' },
  { to: '/admin/coach-schedules', icon: CalendarClock, label: 'Coach Schedules' },
  { to: '/admin/attendance', icon: CalendarCheck, label: 'Attendance' },
  { to: '/admin/ai-reminder', icon: Bot, label: 'AI Reminder' },
  { to: '/admin?panel=settings', icon: Settings, label: 'Settings' },
];

const memberLinks = [
  { to: '/member', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/member/subscription', icon: Activity, label: 'My Subscription' },
  { to: '/member/payments', icon: CreditCard, label: 'My Payments' },
  { to: '/member/attendance', icon: CalendarCheck, label: 'My Attendance' },
  { to: '/member?section=coach', icon: Dumbbell, label: 'My Coach' },
  { to: '/member/profile', icon: UserRound, label: 'Profile' },
];

const coachLinks = [
  { to: '/coach/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/coach/members', icon: Users, label: 'My Members' },
  { to: '/coach/schedule', icon: CalendarClock, label: 'My Schedule' },
  { to: '/coach/dashboard?panel=profile', icon: UserRound, label: 'Profile' },
];

export default function Sidebar({ role, onNavigate }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const links = role === 'admin' ? adminLinks : role === 'coach' ? coachLinks : memberLinks;
  const roleLabel = role === 'admin' ? 'Administrator' : role === 'coach' ? 'Coach' : 'Member';
  const displayName = user?.name || readSavedUser()?.name || roleLabel;

  const isItemActive = (item, isActive) => {
    const [pathname, search] = item.to.split('?');

    if (search) {
      return location.pathname === pathname && location.search === `?${search}`;
    }

    if (location.search && location.pathname === pathname) {
      return false;
    }

    return isActive;
  };

  const handleLogout = async () => {
    await dispatch(logout());
    localStorage.removeItem('fitmanager_token');
    localStorage.removeItem('fitmanager_user');
    onNavigate?.();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-ink text-white shadow-2xl shadow-black/20 lg:w-72">
      <Link className="flex items-center gap-3 border-b border-white/10 px-5 py-5" to="/" onClick={onNavigate}>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded bg-primary text-white shadow-lg shadow-primary/25">
          <Zap className="h-5 w-5 fill-white text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-tight">FitManager</p>
          <p className="truncate text-xs font-bold uppercase text-white/45">Private Club OS</p>
        </div>
      </Link>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <div className="grid gap-1.5">
          {links.map((item) => (
          <NavLink
            className={({ isActive }) => {
              const active = isItemActive(item, isActive);
              return `group relative flex items-center gap-3 rounded px-3 py-3 text-sm font-black transition duration-200 ${
                active
                  ? 'bg-primary text-white shadow-lg shadow-orange-950/30'
                  : 'text-white/62 hover:bg-white/8 hover:text-white'
              }`;
            }}
            to={item.to}
            key={`${item.label}-${item.to}`}
            end={item.end}
            onClick={onNavigate}
          >
            {({ isActive }) => {
              const active = isItemActive(item, isActive);
              const Icon = item.icon;

              return (
                <>
                  <span className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-white transition ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} />
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </>
              );
            }}
          </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded bg-white/[0.06] p-3">
          <p className="truncate text-sm font-black">{displayName}</p>
          <p className="mt-0.5 text-xs font-bold text-white/45">{roleLabel}</p>
        </div>
        <button
          className="flex w-full items-center gap-3 rounded px-3 py-3 text-left text-sm font-black text-white/62 transition hover:bg-white/8 hover:text-white"
          type="button"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('fitmanager_user'));
  } catch {
    return null;
  }
}

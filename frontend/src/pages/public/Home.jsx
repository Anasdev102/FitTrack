import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Dumbbell,
  Mail,
  MapPin,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../api/axios';

const coachImages = [
  'https://images.unsplash.com/photo-1609899464726-209befaac5a4?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=700&q=85',
];

export default function Home() {
  const { t } = useTranslation();
  const [coaches, setCoaches] = useState([]);
  const [coachesLoading, setCoachesLoading] = useState(true);
  const [coachPage, setCoachPage] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const savedUser = user || readSavedUser();
  const dashboardHref = savedUser
    ? savedUser.role === 'admin'
      ? '/admin'
      : savedUser.role === 'coach'
        ? '/coach/dashboard'
        : '/member'
    : '/login';
  const planHref = (slug) => {
    if (!savedUser) return `/login?redirect=/member/subscription&plan=${slug}`;
    if (savedUser.role === 'admin') return '/admin';
    return `/member/subscription?plan=${slug}`;
  };

  const services = [
    [t('raw.owner_control'), Users, t('raw.one_private_dashboard_for_members_coaches_payments_and_daily_flow')],
    [t('raw.coach_floor'), Dumbbell, t('raw.assign_coaches_track_attendance_and_keep_training_plans_connected')],
    [t('raw.renewal_desk'), Sparkles, t('raw.stay_ahead_of_pending_active_expired_and_rejected_subscription_requests')],
    [t('raw.front_desk'), CalendarCheck, t('raw.mark_visits_quickly_with_searchable_member_check_in_tools')],
  ];
  const plans = [
    [t('raw.monthly'), 'MAD 49', 'monthly', [t('raw.gym_access'), t('raw.all_equipment'), t('raw.locker_room')]],
    [t('raw.quarterly'), 'MAD 129', 'quarterly', [t('raw.gym_access'), t('raw.all_equipment'), t('raw.group_classes'), t('raw.coach_check_in')]],
    [t('raw.yearly'), 'MAD 449', 'yearly', [t('raw.gym_access'), t('raw.all_equipment'), t('raw.group_classes'), t('raw.priority_support'), t('raw.fitness_review')]],
  ];

  useEffect(() => {
    api.get('/coaches')
      .then((response) => {
        setCoaches(response.data.data || []);
        setCoachPage(0);
      })
      .catch(() => setCoaches([]))
      .finally(() => setCoachesLoading(false));
  }, []);

  const coachSlides = chunk(coaches, 3);
  const visibleCoaches = coachSlides[coachPage] || [];
  const canSlideCoaches = coachSlides.length > 1;
  const nextCoachPage = () => setCoachPage((page) => (page + 1) % coachSlides.length);
  const previousCoachPage = () => setCoachPage((page) => (page - 1 + coachSlides.length) % coachSlides.length);

  return (
    <main className="bg-black text-white">
      <section id="home" className="saas-hero relative isolate min-h-screen overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.9)_34%,rgba(0,0,0,0.54)_68%,rgba(0,0,0,0.34)_100%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_57%,rgba(243,97,0,0.2),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.26)_0%,rgba(0,0,0,0.18)_58%,#000_100%)]" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
          <div className="hero-copy w-full max-w-4xl">
            <h1 className="max-w-4xl text-6xl font-black leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl">
              <span className="block">Complete Gym</span>
              <span className="block">
                Management <span className="text-primary">System</span>
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              A web-based solution designed to simplify gym operations by managing members, subscriptions, coaches, payments, attendance, and schedules from one centralized platform.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a className="inline-flex h-16 items-center justify-center gap-5 rounded-lg bg-primary px-8 text-sm font-black uppercase tracking-wide text-white shadow-2xl shadow-orange-950/50 transition duration-300 hover:-translate-y-1 hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-primary/30" href={savedUser ? dashboardHref : '/register'}>
                {t('raw.get_started', 'Get Started')} <ArrowRight className="h-5 w-5" />
              </a>
              <a className="inline-flex h-16 items-center justify-center gap-5 rounded-lg border border-white/18 bg-black/20 px-8 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10" href={dashboardHref}>
                {t('raw.view_demo', 'View Demo')} <Play className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-14 grid max-w-3xl gap-5 text-sm sm:grid-cols-3">
              {[
                [Zap, t('raw.save_time', 'Save Time'), t('raw.automate_daily_tasks', 'Automate daily tasks')],
                [BarChart3, t('raw.grow_revenue', 'Grow Revenue'), t('raw.increase_your_income', 'Increase your income')],
                [ShieldCheck, t('raw.100_secure', '100% Secure'), t('raw.data_protection_first', 'Data protection first')],
              ].map(([Icon, title, copy]) => (
                <div className="flex items-center gap-4" key={title}>
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-primary shadow-2xl shadow-black/40 backdrop-blur">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-black text-white">{title}</span>
                    <span className="mt-1 block leading-5 text-slate-400">{copy}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white px-5 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="section-kicker">{t('raw.club_experience')}</p>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">{t('raw.a_fitness_club_interface_with_real_back_office_control')}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted">{t('raw.the_public_side_keeps_the_strong_gym_look_the_private_dashboards_stay_organized_for_repeated_admin_coach_and_member_work')}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {services.map(([label, Icon, copy]) => (
              <div className="panel p-7 transition hover:-translate-y-1" key={label}>
                <div className="grid h-12 w-12 place-items-center rounded bg-ink text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-7 text-lg font-black">{label}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="section-kicker">{t('raw.club_floor')}</p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">{t('raw.manage_the_private_gym_like_a_serious_training_facility')}</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">{t('raw.fitmanager_keeps_the_sales_energy_of_a_gym_website_and_connects_it_to_a_focused_command_room_for_one_club_owner')}</p>
            <div className="mt-8 grid gap-4 text-sm font-bold text-slate-300 sm:grid-cols-2">
              {[t('raw.subscription_requests'), t('raw.coach_assignments'), t('raw.attendance_history'), t('raw.training_plans')].map((item) => (
                <p className="flex items-center gap-3" key={item}><Check className="h-4 w-4 text-primary" />{item}</p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img className="h-72 w-full rounded object-cover" src="https://images.unsplash.com/photo-1605296867424-35fc25c9212a?auto=format&fit=crop&w=900&q=88" alt="Strength training" />
            <img className="mt-12 h-72 w-full rounded object-cover" src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=88" alt="Gym equipment" />
          </div>
        </div>
      </section>

      <section id="plans" className="bg-slate-50 px-5 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">{t('raw.memberships')}</p>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">{t('raw.simple_plans_premium_presentation')}</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted">{t('raw.clear_membership_tiers_help_the_club_sell_confidently_without')} {t('raw.turning_the_platform_into_a_marketplace')}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map(([name, price, slug, perks], index) => (
              <div className={`rounded-lg border p-8 shadow-[0_24px_80px_rgba(17,17,17,0.08)] transition hover:-translate-y-2 ${index === 1 ? 'border-ink bg-ink text-white' : 'border-line bg-white text-slate-950'}`} key={name}>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">{name}</p>
                <p className="mt-7 text-5xl font-black tracking-tight">{price}<span className="text-sm font-bold opacity-60"> /{t('raw.mo')}</span></p>
                <div className="mt-8 grid gap-4 text-sm">
                  {perks.map((perk) => <p className="flex items-center gap-3" key={perk}><Check className="h-4 w-4 text-primary" />{perk}</p>)}
                </div>
                <a href={planHref(slug)} className={`mt-9 inline-flex w-full justify-center rounded px-5 py-3 text-sm font-black uppercase tracking-wide transition hover:-translate-y-0.5 ${index === 1 ? 'bg-primary text-white' : 'bg-ink text-white'}`}>{t('raw.choose_plan')}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fitness-parallax px-5 py-28 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="section-kicker">{t('raw.operations_video')}</p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">{t('raw.every_visit_request_and_plan_stays_visible')}</h2>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:-translate-y-1" href={dashboardHref}><Video className="h-4 w-4" /> {t('raw.open_workspace')}</a>
              <a className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition hover:-translate-y-1" href="#contact">{t('raw.contact_club')}</a>
            </div>
          </div>
        </div>
      </section>

      <section id="coaches" className="bg-white px-5 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">{t('raw.coaches')}</p>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">{t('raw.real_club_coaching_team')}</h2>
            </div>
            {canSlideCoaches && (
              <div className="flex gap-2">
                <button className="grid h-11 w-11 place-items-center rounded border border-line bg-white text-ink transition hover:border-primary hover:text-primary" type="button" onClick={previousCoachPage} aria-label={t('raw.previous_coaches')}><ChevronLeft className="h-5 w-5" /></button>
                <button className="grid h-11 w-11 place-items-center rounded bg-primary text-white transition hover:bg-orange-600" type="button" onClick={nextCoachPage} aria-label={t('raw.next_coaches')}><ChevronRight className="h-5 w-5" /></button>
              </div>
            )}
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {coachesLoading && [0, 1, 2].map((item) => <div className="panel h-96 animate-pulse bg-slate-100" key={item} />)}
            {!coachesLoading && visibleCoaches.map((coach, index) => (
              <div className="panel overflow-hidden transition hover:-translate-y-1" key={coach.id}>
                <img className="h-80 w-full object-cover" src={coach.image || coachImages[(coachPage * 3 + index) % coachImages.length]} alt={coach.name} />
                <div className="p-6">
                  <h3 className="text-lg font-black">{coach.name}</h3>
                  <p className="mt-1 text-sm text-muted">{coach.speciality || t('raw.fitness_coach')}</p>
                </div>
              </div>
            ))}
            {!coachesLoading && !visibleCoaches.length && <div className="panel col-span-full p-8 text-center"><p className="text-sm font-bold text-muted">{t('raw.no_coaches_available_yet')}</p></div>}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-dark px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="section-kicker">{t('raw.contact')}</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">{t('raw.ready_to_run_the_club_with_more_polish')}</h2>
            <div className="mt-10 grid gap-5 text-sm text-slate-300">
              {[[MapPin, '123 Fitness Street'], [Phone, '+212 600 000000'], [Mail, 'hello@fitmanager.club'], [Clock, '06:00 AM - 10:00 PM']].map(([Icon, text]) => (
                <p className="flex items-center gap-3" key={text}><Icon className="h-5 w-5 text-primary" />{text}</p>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-lg p-6">
            <div className="grid gap-4 md:grid-cols-2"><Input label={t('raw.name')} /><Input label={t('raw.email')} /></div>
            <div className="mt-4"><Input label={t('raw.subject')} /></div>
            <label className="mt-4 grid gap-2 text-xs font-bold text-slate-200">{t('raw.message')}<textarea className="min-h-32 rounded border border-white/10 bg-white/10 px-3.5 py-3 text-sm text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/20" /></label>
            <Button className="mt-5">{t('raw.send_message')}</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-darkSecondary px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-slate-400 md:flex-row">
          <p className="flex items-center gap-2 font-black text-white"><Zap className="h-5 w-5 fill-primary text-primary" />FT</p>
          <p>{t('raw.built_for_one_private_fitness_club_clean_focused_premium')}</p>
        </div>
      </footer>
    </main>
  );
}

function DashboardMockup({ t }) {
  const metrics = [
    [Users, t('raw.total_members', 'Total Members'), '1,284', '+12.8%'],
    [CalendarCheck, t('raw.active_subscriptions', 'Active Subscriptions'), '936', '+8.4%'],
    [CreditCard, t('raw.monthly_revenue', 'Monthly Revenue'), 'MAD 84k', '+18.2%'],
    [Activity, t('raw.attendance_rate', 'Attendance Rate'), '78%', '+6.1%'],
  ];

  return (
    <div className="soft-float relative mt-4 lg:mt-0" aria-label={t('raw.dashboard_preview', 'Dashboard preview')}>
      <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-8 bottom-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-4 shadow-[0_32px_120px_rgba(0,0,0,0.52)] backdrop-blur-2xl">
        <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/78 p-5">
          <div className="flex items-center justify-between gap-4 pb-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{t('raw.club_command', 'Club Command')}</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">{t('raw.live_dashboard', 'Live Dashboard')}</h2>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-300">
              {t('status.active', 'Active')}
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {metrics.map(([Icon, label, value, change]) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.075] p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white/[0.1]" key={label}>
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black text-emerald-300">{change}</span>
                </div>
                <p className="mt-5 text-2xl font-black tracking-tight text-white">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('fitmanager_user'));
  } catch {
    return null;
  }
}

function chunk(items, size) {
  return items.reduce((pages, item, index) => {
    if (index % size === 0) pages.push([]);
    pages[pages.length - 1].push(item);
    return pages;
  }, []);
}

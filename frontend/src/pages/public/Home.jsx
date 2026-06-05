import React from 'react';
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { MotionCard, MotionSection } from "../../components/common/Motion";
import api from "../../api/axios";

const services = [
  [
    "Owner Control",
    Users,
    "One private dashboard for members, coaches, payments, and daily flow.",
  ],
  [
    "Coach Floor",
    Dumbbell,
    "Assign coaches, track attendance, and keep training plans connected.",
  ],
  [
    "Renewal Desk",
    Sparkles,
    "Stay ahead of pending, active, expired, and rejected subscription requests.",
  ],
  [
    "Front Desk",
    CalendarCheck,
    "Mark visits quickly with searchable member check-in tools.",
  ],
];

const plans = [
  [
    "Monthly",
    "MAD 49",
    "monthly",
    ["Gym access", "All equipment", "Locker room"],
  ],
  [
    "Quarterly",
    "MAD 129",
    "quarterly",
    ["Gym access", "All equipment", "Group classes", "Coach check-in"],
  ],
  [
    "Yearly",
    "MAD 449",
    "yearly",
    [
      "Gym access",
      "All equipment",
      "Group classes",
      "Priority support",
      "Fitness review",
    ],
  ],
];

const coachImages = [
  "https://images.unsplash.com/photo-1609899464726-209befaac5a4?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=700&q=85",
];

export default function Home() {
  const pageRef = useRef(null);
  const [coaches, setCoaches] = useState([]);
  const [coachesLoading, setCoachesLoading] = useState(true);
  const [coachPage, setCoachPage] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const savedUser = user || readSavedUser();
  const dashboardHref = savedUser
    ? savedUser.role === "admin"
      ? "/admin"
      : savedUser.role === "coach"
      ? "/coach/dashboard"
      : "/member"
    : "/login";
  const planHref = (slug) => {
    if (!savedUser) return `/login?redirect=/member/subscription&plan=${slug}`;
    if (savedUser.role === "admin") return "/admin";
    return `/member/subscription?plan=${slug}`;
  };

  useEffect(() => {
    api.get("/coaches")
      .then((response) => {
        setCoaches(response.data.data || []);
        setCoachPage(0);
      })
      .catch(() => setCoaches([]))
      .finally(() => setCoachesLoading(false));
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from(".feature-strip-card", {
        opacity: 0,
        y: 70,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".feature-strip",
          start: "top 85%",
        },
      });

      gsap.from(".gsap-reveal", {
        opacity: 0,
        y: 42,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: pageRef.current,
          start: "top 72%",
        },
      });

      gsap.utils.toArray(".parallax-lift").forEach((element) => {
        gsap.to(element, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, pageRef);

    return () => context.revert();
  }, []);

  const coachSlides = chunk(coaches, 3);
  const visibleCoaches = coachSlides[coachPage] || [];
  const canSlideCoaches = coachSlides.length > 1;
  const nextCoachPage = () => setCoachPage((page) => (page + 1) % coachSlides.length);
  const previousCoachPage = () => setCoachPage((page) => (page - 1 + coachSlides.length) % coachSlides.length);

  return (
    <main className="bg-black text-white" ref={pageRef}>
      <section id="home" className="hero-image relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-16 pt-28 md:pb-20">
          <div className="block max-w-4xl opacity-100" style={{ opacity: 1, transform: 'none' }}>
            <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.32em] text-primary" style={{ opacity: 1, transform: 'none' }}>
              <Sparkles className="h-4 w-4" />
              Private fitness club
            </div>
            <h1 className="fitness-title mt-7 block max-w-5xl text-5xl leading-tight text-white opacity-100 sm:text-6xl md:text-7xl" style={{ opacity: 1, transform: 'none' }}>
              Build your strongest version.
            </h1>
            <p className="mt-7 block max-w-2xl text-base leading-8 text-slate-300 opacity-100 md:text-lg" style={{ opacity: 1, transform: 'none' }}>
              Join FitManager and train with professional coaches, flexible membership plans, and a modern fitness experience.
            </p>
            <div className="mt-9 flex flex-wrap gap-4 opacity-100" style={{ opacity: 1, transform: 'none' }}>
              <a
                className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-2xl shadow-orange-900/30 transition hover:-translate-y-1"
                href={dashboardHref}
              >
                Join now <ArrowRight className="h-4 w-4" />
              </a>
              <a
                className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition hover:-translate-y-1 hover:border-primary"
                href="#plans"
              >
                View plans
              </a>
            </div>
            <div className="mt-12 grid max-w-3xl gap-4 opacity-100 sm:grid-cols-3" style={{ opacity: 1, transform: 'none' }}>
              {[
                ["500+", "Active Members"],
                ["20+", "Professional Coaches"],
                ["95%", "Member Satisfaction"],
              ].map(([value, label]) => (
                <div className="rounded border border-white/15 bg-white/10 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur" key={label}>
                  <p className="text-3xl font-black tracking-tight">{value}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-white/70">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="feature-strip relative z-10 px-5 pb-20 pt-8 md:-mt-20 md:pt-0">
        <div className="mx-auto grid max-w-7xl gap-0 shadow-2xl shadow-black/30 md:grid-cols-3">
          {[
            ["01", "Member requests", "Let members request plans while admin keeps final approval."],
            ["02", "Coach assignments", "Give coaches a limited workspace for assigned members only."],
            ["03", "Daily attendance", "Keep check-ins searchable, fast, and connected to member history."],
          ].map(([number, title, copy], index) => (
            <MotionCard className={`feature-strip-card ${index === 1 ? "bg-primary text-white" : "bg-[#151515] text-white"} p-8`} key={title} delay={index * 0.06}>
              <p className="text-5xl font-black text-white/10">{number}</p>
              <h3 className="mt-8 text-xl font-black uppercase tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{copy}</p>
            </MotionCard>
          ))}
        </div>
      </section>

      <section id="services" className="bg-white px-5 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <MotionSection className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
            <p className="section-kicker">
              Club experience
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">
              A fitness-club interface with real back-office control.
            </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted">
              The public side keeps the strong gym look; the private dashboards stay organized for repeated admin, coach, and member work.
            </p>
          </MotionSection>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {services.map(([label, Icon, copy], index) => (
              <MotionCard
                className="panel stagger-card p-7 hover:-translate-y-1"
                key={label}
                delay={index * 0.05}
              >
                <div className="grid h-12 w-12 place-items-center rounded bg-ink text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-7 text-lg font-black">{label}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{copy}</p>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <MotionSection>
            <p className="section-kicker">Club floor</p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">
              Manage the private gym like a serious training facility.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">
              FitManager keeps the sales energy of a gym website and connects it to a focused command room for one club owner.
            </p>
            <div className="mt-8 grid gap-4 text-sm font-bold text-slate-300 sm:grid-cols-2">
              {["Subscription requests", "Coach assignments", "Attendance history", "Training plans"].map((item) => (
                <p className="flex items-center gap-3" key={item}><Check className="h-4 w-4 text-primary" />{item}</p>
              ))}
            </div>
          </MotionSection>
          <MotionCard className="parallax-lift grid grid-cols-2 gap-4">
            <div className="image-zoom rounded"><img className="h-72 w-full rounded object-cover" src="https://images.unsplash.com/photo-1605296867424-35fc25c9212a?auto=format&fit=crop&w=900&q=88" alt="Strength training" /></div>
            <div className="image-zoom mt-12 rounded"><img className="h-72 w-full rounded object-cover" src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=88" alt="Gym equipment" /></div>
          </MotionCard>
        </div>
      </section>

      <section id="plans" className="bg-slate-50 px-5 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <MotionSection className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">
                Memberships
              </p>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">
                Simple plans, premium presentation.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted">
              Clear membership tiers help the club sell confidently without
              turning the platform into a marketplace.
            </p>
          </MotionSection>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map(([name, price, slug, perks], index) => (
              <MotionCard
                className={`stagger-card rounded-lg border p-8 shadow-[0_24px_80px_rgba(17,17,17,0.08)] transition hover:-translate-y-2 ${index === 1 ? "border-ink bg-ink text-white" : "border-line bg-white text-slate-950"}`}
                key={name}
                delay={index * 0.06}
              >
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
                  {name}
                </p>
                <p className="mt-7 text-5xl font-black tracking-tight">
                  {price}
                  <span className="text-sm font-bold opacity-60"> /mo</span>
                </p>
                <div className="mt-8 grid gap-4 text-sm">
                  {perks.map((perk) => (
                    <p className="flex items-center gap-3" key={perk}>
                      <Check className="h-4 w-4 text-primary" />
                      {perk}
                    </p>
                  ))}
                </div>
                <a
                  href={planHref(slug)}
                  className={`mt-9 inline-flex w-full justify-center rounded px-5 py-3 text-sm font-black uppercase tracking-wide transition hover:-translate-y-0.5 ${index === 1 ? "bg-primary text-white" : "bg-ink text-white"}`}
                >
                  Choose plan
                </a>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      <section className="fitness-parallax px-5 py-28 text-white">
        <div className="mx-auto max-w-7xl">
          <MotionSection className="max-w-2xl">
            <p className="section-kicker">Operations video</p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">Every visit, request, and plan stays visible.</h2>
            <div className="mt-8 flex flex-wrap gap-4">
              <a className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:-translate-y-1" href={dashboardHref}>
                <Video className="h-4 w-4" /> Open workspace
              </a>
              <a className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition hover:-translate-y-1" href="#contact">
                Contact club
              </a>
            </div>
          </MotionSection>
        </div>
      </section>

      <section id="coaches" className="bg-white px-5 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <MotionSection className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">Coaches</p>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">
                Real club coaching team.
              </h2>
            </div>
            {canSlideCoaches && (
              <div className="flex gap-2">
                <button className="grid h-11 w-11 place-items-center rounded border border-line bg-white text-ink transition hover:border-primary hover:text-primary" type="button" onClick={previousCoachPage} aria-label="Previous coaches">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="grid h-11 w-11 place-items-center rounded bg-primary text-white transition hover:bg-orange-600" type="button" onClick={nextCoachPage} aria-label="Next coaches">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </MotionSection>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {coachesLoading && [0, 1, 2].map((item) => (
              <div className="panel overflow-hidden p-0" key={item}>
                <div className="h-80 animate-pulse bg-slate-200" />
                <div className="p-6">
                  <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-24 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
            {!coachesLoading && visibleCoaches.map((coach, index) => (
              <MotionCard
                className="panel stagger-card overflow-hidden hover:-translate-y-1"
                key={coach.id}
                delay={index * 0.06}
              >
                <div className="image-zoom"><img className="h-80 w-full object-cover" src={coach.image || coachImages[(coachPage * 3 + index) % coachImages.length]} alt={coach.name} /></div>
                <div className="p-6">
                  <h3 className="text-lg font-black">{coach.name}</h3>
                  <p className="mt-1 text-sm text-muted">{coach.speciality || "Fitness coach"}</p>
                  {coach.phone && <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-primary">{coach.phone}</p>}
                </div>
              </MotionCard>
            ))}
            {!coachesLoading && !visibleCoaches.length && (
              <div className="panel col-span-full p-8 text-center">
                <p className="text-sm font-bold text-muted">No coaches available yet.</p>
              </div>
            )}
          </div>
          {canSlideCoaches && (
            <div className="mt-8 flex justify-center gap-2">
              {coachSlides.map((_, index) => (
                <button
                  className={`h-2.5 rounded-full transition ${index === coachPage ? "w-8 bg-primary" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`}
                  key={index}
                  type="button"
                  onClick={() => setCoachPage(index)}
                  aria-label={`Show coach page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="bg-dark px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="section-kicker">
              Contact
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              Ready to run the club with more polish?
            </h2>
            <div className="mt-10 grid gap-5 text-sm text-slate-300">
              {[
                [MapPin, "123 Fitness Street"],
                [Phone, "+212 600 000000"],
                [Mail, "hello@fitmanager.club"],
                [Clock, "06:00 AM - 10:00 PM"],
              ].map(([Icon, text]) => (
                <p className="flex items-center gap-3" key={text}>
                  <Icon className="h-5 w-5 text-primary" />
                  {text}
                </p>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-lg p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Name" />
              <Input label="Email" />
            </div>
            <div className="mt-4">
              <Input label="Subject" />
            </div>
            <label className="mt-4 grid gap-2 text-xs font-bold text-slate-200">
              Message
              <textarea className="min-h-32 rounded border border-white/10 bg-white/10 px-3.5 py-3 text-sm text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/20" />
            </label>
            <Button className="mt-5">Send message</Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-darkSecondary px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-slate-400 md:flex-row">
          <p className="flex items-center gap-2 font-black text-white">
            <Zap className="h-5 w-5 fill-primary text-primary" />
            FitManager
          </p>
          <p>Built for one private fitness club. Clean, focused, premium.</p>
        </div>
      </footer>
    </main>
  );
}

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("fitmanager_user"));
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

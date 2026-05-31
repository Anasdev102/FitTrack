import React from 'react';
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    ["Monthly", "MAD 49", "monthly", ["Gym Access", "All Equipment", "Locker Room"]],
    ["Quarterly", "MAD 129", "quarterly", ["Gym Access", "All Equipment", "Group Classes", "Coach Check-in"]],
    ["Yearly", "MAD 449", "yearly", ["Gym Access", "All Equipment", "Group Classes", "Priority Support", "Fitness Review"]],
  ];
  const savedUser = readSavedUser();
  const planHref = (slug) => {
    if (!savedUser) return `/login?redirect=/member/subscription&plan=${slug}`;
    if (savedUser.role === "admin") return "/admin";
    return `/member/subscription?plan=${slug}`;
  };

  return (
    <main className="page-enter bg-white">
      <section className="hero-image px-5 pb-24 pt-40 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="section-kicker">Memberships</p>
          <h1 className="fitness-title mt-5 text-5xl md:text-7xl">Choose your plan.</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300">Members request a plan online. The gym admin approves it after physical payment.</p>
        </div>
      </section>
      <section className="px-5 py-24">
      <div className="mx-auto max-w-7xl text-center">
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map(([name, price, slug, perks], index) => (
            <div className={`stagger-card rounded-lg border p-8 text-left shadow-[0_18px_45px_rgba(17,17,17,0.08)] transition hover:-translate-y-2 ${index === 1 ? "scale-[1.03] border-dark bg-dark text-white" : "border-line bg-white text-ink"}`} key={name}>
              <p className="section-kicker text-center">{name}</p>
              <p className="mt-5 text-center text-4xl font-black">{price}<span className="text-sm font-semibold opacity-70"> /plan</span></p>
              <div className="mt-8 grid gap-3 text-sm">
                {perks.map((perk) => <p className="flex items-center gap-2" key={perk}><Check className="h-4 w-4" />{perk}</p>)}
              </div>
              <a className={`mt-8 inline-flex w-full justify-center rounded px-4 py-3 text-sm font-black uppercase tracking-wide ${index === 1 ? "bg-primary text-white" : "bg-dark text-white"}`} href={planHref(slug)}>Choose Plan</a>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-lg bg-dark p-10 text-white">
          <h2 className="text-xl font-black uppercase">Not sure which plan is right for you?</h2>
          <p className="mt-3 text-sm text-slate-300">Our team is here to help you choose the best option.</p>
          <a className="mt-6 inline-flex rounded bg-primary px-6 py-3 text-sm font-black uppercase tracking-wide" href="/contact">Contact Us</a>
        </div>
      </div>
      </section>
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

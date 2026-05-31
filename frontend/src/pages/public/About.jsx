import React from 'react';
export default function About() {
  return (
    <main className="page-enter bg-white">
      <section className="hero-image px-5 pb-24 pt-40 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="section-kicker">About the club</p>
          <h1 className="fitness-title mt-5 max-w-4xl text-5xl md:text-7xl">Built around serious training.</h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300">A private fitness club experience connected to a focused management workspace for the owner, coaches, and members.</p>
        </div>
      </section>
      <section className="px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="section-kicker">Why FitManager</p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight">Premium gym feel, practical club control.</h2>
            <p className="mt-5 text-sm leading-7 text-muted">The interface keeps the high-contrast energy of a fitness club website while supporting real daily work: subscriptions, attendance, coaching, and member profiles.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ['Modern Equipment', 'Free weights, machines, and functional training zones.'],
              ['Expert Coaches', 'Certified coaches for strength, cardio, and conditioning.'],
              ['Member Control', 'Private requests, approvals, payments, and attendance history.'],
              ['Clean Operations', 'A focused system for one gym owner, not a marketplace.'],
            ].map(([title, copy]) => (
              <div className="panel stagger-card p-7 hover:-translate-y-1" key={title}>
                <h3 className="font-black uppercase">{title}</h3>
                <p className="mt-3 text-xs leading-6 text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

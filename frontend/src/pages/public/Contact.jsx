import React from 'react';
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <main className="page-enter bg-white">
      <section className="hero-image px-5 pb-24 pt-40 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="section-kicker">Contact</p>
          <h1 className="fitness-title mt-5 text-5xl md:text-7xl">Talk to the club.</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300">A direct contact point for one private fitness club.</p>
        </div>
      </section>
      <section className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-6">
            {[
              [MapPin, 'Our Location', '123 Fitness Street', 'City, Country'],
              [Phone, 'Phone', '+212 600 000000', ''],
              [Mail, 'Email', 'info@powerfit.com', ''],
              [Clock, 'Working Hours', 'Monday - Saturday', '06:00 AM - 10:00 PM'],
            ].map(([Icon, title, line1, line2]) => (
              <div className="flex gap-4" key={title}>
                <div className="grid h-10 w-10 place-items-center rounded bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                <div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm text-muted">{line1}</p>{line2 && <p className="text-sm text-muted">{line2}</p>}</div>
              </div>
            ))}
          </div>
          <div className="panel grid gap-4 p-7">
            <div className="grid gap-4 md:grid-cols-2"><Input label="Your Name" /><Input label="Your Email" /></div>
            <Input label="Subject" />
            <label className="grid gap-2 text-xs font-bold text-slate-700">Message<textarea className="min-h-36 rounded border border-line px-3 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20" /></label>
            <Button>Send Message</Button>
          </div>
        </div>
        <div className="mt-10 h-56 overflow-hidden rounded-lg border border-line">
          <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1400&q=80" alt="City map preview" />
        </div>
      </div>
      </section>
    </main>
  );
}

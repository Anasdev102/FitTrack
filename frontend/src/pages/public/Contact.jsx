import React from 'react';
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  return (
    <main className="page-enter bg-white">
      <section className="hero-image px-5 pb-24 pt-40 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="section-kicker">{t("raw.contact")}</p>
          <h1 className="fitness-title mt-5 text-5xl md:text-7xl">{t("raw.talk_to_the_club")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300">{t("raw.a_direct_contact_point_for_one_private_fitness_club")}</p>
        </div>
      </section>
      <section className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-6">
            {[
              [MapPin, t("raw.our_location"), '123 Fitness Street', t("raw.city_country")],
              [Phone, t("raw.phone"), '+212 600 000000', ''],
              [Mail, t("raw.email"), 'info@powerfit.com', ''],
              [Clock, t("raw.working_hours"), t("raw.monday_saturday"), '06:00 AM - 10:00 PM'],
            ].map(([Icon, title, line1, line2]) => (
              <div className="flex gap-4" key={title}>
                <div className="grid h-10 w-10 place-items-center rounded bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                <div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm text-muted">{line1}</p>{line2 && <p className="text-sm text-muted">{line2}</p>}</div>
              </div>
            ))}
          </div>
          <div className="panel grid gap-4 p-7">
            <div className="grid gap-4 md:grid-cols-2"><Input label={t("raw.your_name")} /><Input label={t("raw.your_email")} /></div>
            <Input label={t("raw.subject")} />
            <label className="grid gap-2 text-xs font-bold text-slate-700">{t("raw.message")}<textarea className="min-h-36 rounded border border-line px-3 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20" /></label>
            <Button>{t("raw.send_message")}</Button>
          </div>
        </div>
        <div className="mt-10 h-56 overflow-hidden rounded-lg border border-line">
          <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1400&q=80" alt={t("raw.city_map_preview")} />
        </div>
      </div>
      </section>
    </main>
  );
}

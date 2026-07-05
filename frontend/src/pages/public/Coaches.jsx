import React from 'react';
import { useTranslation } from "react-i18next";
export default function Coaches() {
  const { t } = useTranslation();
  const coaches = [
    ["John Smith", t("raw.strength_coach"), "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=500&q=80"],
    ["Sarah Johnson", t("raw.yoga_coach"), "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=500&q=80"],
    ["Mike Brown", t("raw.cardio_coach"), "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=500&q=80"],
    ["David Wilson", t("raw.nutrition_coach"), "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=500&q=80"],
    ["Emma Davis", t("raw.crossfit_coach"), "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=500&q=80"],
    ["James Taylor", t("raw.bodybuilding_coach"), "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=500&q=80"],
  ];

  return (
    <main className="page-enter bg-white">
      <section className="hero-image px-5 pb-24 pt-40 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="section-kicker">{t("raw.coaches")}</p>
          <h1 className="fitness-title mt-5 text-5xl md:text-7xl">{t("raw.training_staff")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300">{t("raw.a_focused_coaching_team_for_a_private_club_environment")}</p>
        </div>
      </section>
      <section className="px-5 py-24">
      <div className="mx-auto max-w-7xl text-center">
        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {coaches.map(([name, role, image]) => (
            <div className="panel stagger-card overflow-hidden transition duration-500 hover:-translate-y-1" key={name}>
              <div className="image-zoom"><img className="h-72 w-full object-cover" src={image} alt={name} /></div>
              <div className="p-5">
                <h3 className="font-black uppercase">{name}</h3>
                <p className="mt-1 text-sm text-muted">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </section>
    </main>
  );
}

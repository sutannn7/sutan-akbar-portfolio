"use client";

import { useTranslations } from 'next-intl';

export default function ExpertiseSection() {
  const t = useTranslations('expertise');

  const cards = [
    { title: t('craftTitle'), description: t('craftDescription') },
    { title: t('systemsTitle'), description: t('systemsDescription') },
    { title: t('productTitle'), description: t('productDescription') },
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6">
        <ul className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <li key={card.title} className="border rounded-xl p-6 bg-card text-card-foreground">
              <h3 className="text-lg font-bold mb-3 tracking-tighter uppercase">
                {card.title}
              </h3>
              <p className="text-muted-foreground">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

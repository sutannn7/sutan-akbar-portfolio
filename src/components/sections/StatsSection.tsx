"use client";

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useCountUp } from '@/hooks/useCountUp';
import { useTranslations } from 'next-intl';
import { portfolioData } from '@/data/portfolio';
import { computeStats } from '@/lib/stats';

export default function StatsSection() {
  const t = useTranslations('stats');
  const reduced = usePrefersReducedMotion();
  const stats = computeStats(portfolioData);

  // Animasi counter dimatikan saat prefers-reduced-motion: tunjuk nilai asli.
  const projectsCount = useCountUp(stats.projectsCount, 2000, 0, true);
  const liveCount = useCountUp(stats.liveCount, 2000, 0, true);
  const labCount = useCountUp(stats.labCount, 2000, 0, true);
  const techCount = useCountUp(stats.techCount, 2000, 0, true);

  const cards = [
    { value: reduced ? stats.projectsCount : projectsCount, label: t('projects') },
    { value: reduced ? stats.liveCount : liveCount, label: t('live') },
    { value: reduced ? stats.labCount : labCount, label: t('lab') },
    { value: reduced ? stats.techCount : techCount, label: t('tech') },
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.label} className="border rounded-xl p-6 bg-card text-card-foreground">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                {card.label}
              </p>
              <p className="text-4xl md:text-5xl font-bold mt-1">{card.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

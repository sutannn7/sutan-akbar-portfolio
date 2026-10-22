'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePerformance } from '@/hooks/usePerformance';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/lib/locale';
import { shouldRenderHeavyVisuals } from '@/lib/performance';
import { portfolioData } from '@/data/portfolio';
import { HeroGrid } from '@/components/sections/HeroGrid';
import { HeroVisual } from '@/components/sections/HeroVisual';
import StatsSection from '@/components/sections/StatsSection';
import ExpertiseSection from '@/components/sections/ExpertiseSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceStickyScroll from '@/components/sections/ExperienceStickyScroll';
import GitHubRepos from '@/components/sections/GitHubRepos';
import Milestones from '@/components/sections/Milestones';
import CTASection from '@/components/sections/CTASection';

// Canvas hanya dimount di klien, dan hanya saat gate visual berat lolos.
const NamePlate = dynamic(
  () => import('@/components/three/NamePlate').then((mod) => ({ default: mod.NamePlate })),
  { ssr: false, loading: () => null },
);

export default function HomePage() {
  const { isLowPowerMode } = usePerformance();
  const prefersReducedMotion = usePrefersReducedMotion();
  const heavy = shouldRenderHeavyVisuals({ isLowPowerMode, prefersReducedMotion });
  const locale = useLocale() as Locale;
  const t = useTranslations('projects');

  return (
    <main className="relative w-full bg-background text-foreground">
      {/* Hero: kunci markup-nya (HeroGrid, plate, HeroVisual). overflow-hidden pindah
           ke section ini agar plate dan grid resolved terhadap hero, bukan seluruh halaman. */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <HeroGrid />
        {/* Plate di kanan atas (x ≈ 820–1380, y ≈ 100–420 @1440×1000), di band kosong
             kanan END dan di atas ENGINEER; tidak overlap headline maupun navbar.
             Di bawah lg disembunyikan (headline memenuhi layar) agar tidak pernah menempel
             pada teks. opacity-70 dihapus karena itu menurunkan opacity nama-overlay. */}
        <div className="pointer-events-none absolute z-0 top-[100px] right-[60px] hidden lg:block">
          {heavy ? (
            <NamePlate name={portfolioData.personal.name} role={portfolioData.personal.title.id} />
          ) : (
            <div
              className="relative w-full max-w-[560px] h-[320px] rounded-2xl border border-primary/20 bg-primary/5"
              style={{ transform: 'rotateX(6deg) rotateY(-6deg) scale(0.97)' }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center">
                <span className="font-sans font-medium text-foreground">{portfolioData.personal.name}</span>
                <span className="font-mono text-sm text-muted-foreground mt-2">{portfolioData.personal.title.id}</span>
              </div>
            </div>
          )}
        </div>
        <div className="relative z-10 flex items-center justify-center w-full">
          <HeroVisual />
        </div>
      </section>

      <StatsSection />
      <ExpertiseSection />

      {/* Proyek terpilih — 4 kartu dari portfolioData */}
      <section id="featured" className="relative py-20 lg:py-32 bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10">{t('featured')}</h2>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {portfolioData.projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="border rounded-2xl p-6 bg-card text-card-foreground hover:bg-accent/5 transition group"
              >
                <h3 className="text-lg font-bold mb-2">{p.title[locale]}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{p.description[locale]}</p>
                <span className="text-xs font-mono text-primary group-hover:underline">
                  {t('viewProject')} →
                </span>
              </Link>
            ))}
          </ul>
        </div>
      </section>

      <AboutSection />
      <ExperienceStickyScroll />
      <GitHubRepos />
      <Milestones />
      <CTASection />
    </main>
  );
}

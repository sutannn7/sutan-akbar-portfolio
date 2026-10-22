import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { Locale } from '@/lib/locale';
import { portfolioData } from '@/data/portfolio';
import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import ExpertiseSection from '@/components/sections/ExpertiseSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceStickyScroll from '@/components/sections/ExperienceStickyScroll';
import GitHubRepos from '@/components/sections/GitHubRepos';
import Milestones from '@/components/sections/Milestones';
import CTASection from '@/components/sections/CTASection';

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('projects');

  return (
    <main className="relative w-full bg-background text-foreground">
      <HeroSection />

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

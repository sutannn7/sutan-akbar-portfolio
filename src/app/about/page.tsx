import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { Locale } from '@/lib/locale';

export default async function AboutPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('about');
  const { bio, links, location, languages } = portfolioData.personal;

  return (
    <main className="mx-auto max-w-4xl px-6 py-24 md:px-10 md:py-32">
      <h1 className="text-4xl font-black tracking-tight text-foreground md:text-6xl">{t('summary')}</h1>

      <section className="mt-8">
        {bio[locale].split('\n\n').map((paragraph, i) => (
          <p key={i} className="mb-5 text-lg leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {t('journey')}
        </h2>
        <ol className="border-l border-border">
          {portfolioData.journey.map((entry) => (
            <li key={`${entry.year}-${entry.title.id}`} className="relative pb-8 pl-6 last:pb-0">
              <span className="absolute -left-[3px] top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="font-mono text-xs text-primary">{entry.year}</p>
              <h3 className="mt-1 font-bold text-foreground">{entry.title[locale]}</h3>
              {entry.org[locale] !== entry.title[locale] && (
                <p className="text-sm text-muted-foreground">{entry.org[locale]}</p>
              )}
              <ul className="mt-2 space-y-1">
                {entry.points.map((point) => (
                  <li key={point.id} className="text-sm leading-relaxed text-muted-foreground">
                    · {point[locale]}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {t('milestones')}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {portfolioData.milestones.map((milestone) => (
            <li
              key={`${milestone.year}-${milestone.title.id}`}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="font-mono text-xs text-primary">{milestone.year}</p>
              <p className="mt-1 font-semibold text-foreground">{milestone.title[locale]}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {milestone.description[locale]}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            {t('languages')}
          </h2>
          <ul className="space-y-2">
            {languages.map((language) => (
              <li key={language.name} className="text-foreground">
                {language.name}
                <span className="ml-2 font-mono text-xs text-muted-foreground">{language.level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            {t('location')}
          </h2>
          <a
            href={`https://www.google.com/maps/place/${encodeURIComponent(location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {location}
          </a>
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-8">
        <h2 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {t('closing.discoverMore')}
        </h2>
        <ul className="flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

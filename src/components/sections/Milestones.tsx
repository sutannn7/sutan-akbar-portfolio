import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Locale } from '@/lib/locale';
import { portfolioData } from '@/data/portfolio';

export default async function Milestones() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('about');
  const milestones = portfolioData.milestones;

  return (
    <section id="milestones" className="relative py-20 lg:py-32 bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('milestones')}</h2>
        <ul className="space-y-8 relative pl-12">
          {milestones.map((m) => {
            const title = m.title[locale];
            const description = m.description[locale];
            return (
              <li key={m.year} className="relative">
                <span className="font-mono text-primary">{m.year}</span>
                <div>
                  {m.href ? (
                    <Link href={m.href} className="font-bold hover:underline">
                      {title}
                    </Link>
                  ) : (
                    <h3 className="font-bold">{title}</h3>
                  )}
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

import { getLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/ui/Reveal';
import { portfolioData } from '@/data/portfolio';
import { Locale } from '@/lib/locale';
import { cn } from '@/lib/utils';

const badgeClass: Record<string, string> = {
  mahir: 'border-primary/40 text-primary',
  nanodua: 'border-border text-muted-foreground',
  dasar: 'border-border/50 text-muted-foreground/70',
};

export default async function SkillsPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('skills');

  const levelLabel = {
    mahir: t('levels.mahir'),
    nanodua: t('levels.nanodua'),
    dasar: t('levels.dasar'),
  } as const;

  const mainGroups = portfolioData.skills.filter((g) => g.group.id !== 'Tools');
  const tools = portfolioData.skills.find((g) => g.group.id === 'Tools');

  return (
    <main className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <h1 className="text-4xl font-black tracking-tight text-foreground md:text-6xl">{t('title')}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t('subtitle')}</p>
        <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground/70">{t('levelsHint')}</p>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {mainGroups.map((group, i) => (
          <Reveal key={group.group.id} delay={i * 0.08}>
            <section className="h-full rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                {group.group[locale]}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-3 py-1.5 text-sm text-foreground"
                  >
                    <span>{item.name}</span>
                    <span
                      className={cn(
                        'rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider',
                        badgeClass[item.badge],
                      )}
                    >
                      {levelLabel[item.badge]}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>

      {tools && (
        <Reveal delay={0.1}>
          <section className="mt-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              {t('toolsTitle')}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {tools.items.map((item) => (
                <li
                  key={item.name}
                  className="rounded-lg border border-border/60 px-3 py-1.5 font-mono text-xs text-muted-foreground"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{t('softTitle')}</h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {portfolioData.softSkills.map((skill) => (
              <li
                key={skill}
                className="rounded-lg border border-border/40 px-4 py-3 text-sm text-muted-foreground"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>
    </main>
  );
}

import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { portfolioData } from '@/data/portfolio';

const icons: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  mail: Mail,
};

function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/^mailto:/, '').replace(/\/$/, '');
}

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <main className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <h1 className="text-4xl font-black tracking-tight text-foreground md:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {t('hero.subtitle')}
        </p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          {t('repliesIn')}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {portfolioData.personal.links.map((link, i) => {
          const Icon = icons[link.icon] ?? ArrowUpRight;
          return (
            <Reveal key={link.label} delay={i * 0.07}>
              <a
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-bold text-foreground transition-colors group-hover:text-primary">
                      {link.label}
                    </span>
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {displayUrl(link.url)}
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:text-primary" />
              </a>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.1}>
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">{t('faqTitle')}</h2>
          <div className="border-t border-border">
            {[0, 1, 2, 3, 4].map((i) => (
              <details key={i} className="group border-b border-border">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-base font-semibold text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                  <span>{t(`faqData.${i}.q` as 'faqData.0.q')}</span>
                  <span className="shrink-0 font-mono text-xl leading-none text-muted-foreground group-open:text-primary">
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 leading-relaxed text-muted-foreground">
                  {t(`faqData.${i}.a` as 'faqData.0.a')}
                </p>
              </details>
            ))}
          </div>
        </section>
      </Reveal>
    </main>
  );
}

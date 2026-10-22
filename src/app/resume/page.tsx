import { getTranslations } from 'next-intl/server';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { portfolioData } from '@/data/portfolio';

export default async function ResumePage() {
  const t = await getTranslations('resume');
  const tCommon = await getTranslations('common');
  const { resumeUrl } = portfolioData.personal;

  return (
    <main className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {tCommon('back')}
        </Link>

        <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">{t('title')}</h1>
            <p className="mt-3 text-muted-foreground">{t('subtitle')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              {t('download')}
            </a>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
              {t('openInNewTab')}
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <iframe
          src={resumeUrl}
          title={t('title')}
          className="mt-10 h-[80vh] w-full rounded-2xl border border-border bg-card"
        />
        <p className="mt-4 text-sm text-muted-foreground">{t('fallback')}</p>
      </Reveal>
    </main>
  );
}

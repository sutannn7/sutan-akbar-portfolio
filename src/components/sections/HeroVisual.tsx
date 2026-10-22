'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

export function HeroVisual() {
  const t = useTranslations('hero');
  const reduced = usePrefersReducedMotion();

  const titleLines = [t('titleLine1'), t('titleLine2'), t('titleLine3')];

  return (
    <section className="min-h-screen w-full flex flex-col justify-center gap-4 px-6">
      {/* Eyebrow: JetBrains Mono, uppercase, tidak di-animate */}
      <p className="font-mono uppercase text-[0.72rem] tracking-[0.22em] text-muted-foreground">
        {t('eyebrow')}
      </p>

      {/* Headline: tiga baris, baris ketiga rata kanan */}
      {titleLines.map((line, index) => (
        <motion.div
          key={line}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 * index }}
          className={cn(
            'font-sans font-medium text-[clamp(3rem,11vw,10rem)] leading-[0.88] tracking-[-0.045em]',
            index === 2 ? 'text-right' : 'text-left',
          )}
        >
          {line}
        </motion.div>
      ))}

      {/* Subhead */}
      <p className="mt-4 max-w-[68ch] text-muted-foreground">{t('subtitle')}</p>

      {/* Scroll hint */}
      <div className="mt-10 flex items-center gap-2 font-mono text-[0.72rem] text-muted-foreground">
        {t('scrollHint')}
        <ArrowDown className={cn('w-4 h-4 shrink-0', !reduced && 'animate-bounce')} />
      </div>
    </section>
  );
}

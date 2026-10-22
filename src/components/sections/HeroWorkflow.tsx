'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Isi kolom kanan bawah hero: cara kerja, bukan hiasan. */
export function HeroWorkflow() {
  const t = useTranslations('hero');
  const reduced = usePrefersReducedMotion();
  const steps = [t('workflowStep1'), t('workflowStep2'), t('workflowStep3'), t('workflowStep4')];

  return (
    <div className="w-[420px] rounded-xl bg-secondary p-5">
      <p className="text-sm font-semibold text-foreground">{t('workflowTitle')}</p>

      <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
        {steps.map((step, index) => (
          <motion.li
            key={step}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 + index * 0.12 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            {step}
          </motion.li>
        ))}
      </ul>

      <p className="mt-4 flex items-center gap-2 text-[0.8rem] text-primary">
        <span className="inline-block h-3 w-1.5 bg-primary motion-safe:animate-pulse" aria-hidden="true" />
        {t('workflowNote')}
      </p>
    </div>
  );
}

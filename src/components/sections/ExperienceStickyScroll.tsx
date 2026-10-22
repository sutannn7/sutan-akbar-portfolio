"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/lib/locale";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { portfolioData } from "@/data/portfolio";

export default function ExperienceStickyScroll() {
  const t = useTranslations("about");
  const locale = useLocale() as Locale;
  const reduced = usePrefersReducedMotion();

  return (
    <section id="journey" className="relative py-20 lg:py-32 bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-16">{t("journey")}</h2>

        {/* Motion hidup: entri timeline diungkap seiring gulir (sticky feel). */}
        {/* Motion mati: daftar statis, tanpa sticky/animasi. */}
        {reduced ? (
          <ul className="space-y-6">
            {portfolioData.journey.map((entry) => (
              <li key={entry.title.id} className="border rounded-xl p-6 bg-card text-card-foreground">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-primary">{entry.year}</span>
                    <h3 className="font-bold mt-1">{entry.title[locale]}</h3>
                    <p className="text-sm text-muted-foreground">{entry.org[locale]}</p>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {entry.points.map((p) => (
                      <li key={p.id}>• {p[locale]}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="relative border-l border-border/50 pl-[124px] space-y-16">
            {portfolioData.journey.map((entry) => (
              <motion.div
                key={entry.title.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative pb-8"
              >
                {/* Tahun duduk di kolom sendiri di kiri garis, tidak menimpa judul. */}
                <span className="absolute -left-[112px] top-0 w-[96px] text-right font-mono text-primary font-medium">
                  {entry.year}
                </span>
                <h3 className="font-bold">{entry.title[locale]}</h3>
                <p className="text-sm text-muted-foreground">{entry.org[locale]}</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {entry.points.map((p) => (
                    <li key={p.id}>• {p[locale]}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

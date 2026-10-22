"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/lib/locale";
import { Github, Linkedin, Mail } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

const LINK_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export default function AboutSection() {
  const t = useTranslations("about");
  const locale = useLocale() as Locale;
  const { bio, location, links, languages } = portfolioData.personal;

  return (
    <section id="about" className="relative py-20 lg:py-32 bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("summary")}</h2>

        <div className="space-y-6 text-lg leading-relaxed mb-12">
          {bio[locale].split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="space-y-6 text-sm md:grid md:grid-cols-2 md:gap-8">
          <div className="flex gap-3">
            <span className="shrink-0 text-muted-foreground w-[120px]">{t("location")}</span>
            <span>{location}</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <span className="shrink-0 text-muted-foreground w-[120px]">{t("languages")}</span>
            <span>
              {languages.map((l, i) => (
                <span key={l.name}>
                  {l.name} — {l.level}{i < languages.length - 1 ? " · " : ""}
                </span>
              ))}
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {links.map((link) => {
            const Icon = LINK_ICONS[link.icon];
            return (
              <Link
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition hover:bg-accent/10"
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

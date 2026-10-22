"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Mail, Download } from "lucide-react";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";
import { MagneticButton } from "@/components/ui/magnetic-button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("ctaSection");

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-12 lg:py-16 overflow-hidden bg-background">
      {/* Ribbon besar (gaya fork, isi stack & peran sejati) */}
      <div className="relative flex h-[300px] w-full items-center justify-center pointer-events-none mb-10">
        <InfiniteRibbon rotation={6} baseVelocity={1} className="z-10 py-5 border-y border-lime-200 dark:border-white/5 shadow-xl" background="bg-white dark:bg-zinc-900" textColor="text-lime-700 dark:text-zinc-400 font-mono tracking-tighter">
          {t("ribbon1")}
        </InfiniteRibbon>
        <InfiniteRibbon rotation={-6} reverse={true} baseVelocity={1.2} className="z-20 py-5 border-y border-white/40 dark:border-white/10 shadow-2xl" background="bg-lime-500 dark:bg-black" textColor="text-white font-bold tracking-widest uppercase">
          {t("ribbon2")}
        </InfiniteRibbon>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10 px-6 md:px-12 lg:px-24 text-center cta-content mt-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-0">
          {t("title")}
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
          <MagneticButton href="/contact" variant="primary" className="text-lg px-10 py-5">
            <Mail className="w-5 h-5" />
            <span>{t("start")}</span>
          </MagneticButton>
          <MagneticButton href="/resume" variant="outline" className="text-lg px-10 py-5">
            <Download className="w-5 h-5" />
            <span>{t("work")}</span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

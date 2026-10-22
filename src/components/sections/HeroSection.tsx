'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePerformance } from '@/hooks/usePerformance';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { shouldRenderHeavyVisuals } from '@/lib/performance';
import { portfolioData } from '@/data/portfolio';
import { HeroGrid } from '@/components/sections/HeroGrid';
import { HeroVisual } from '@/components/sections/HeroVisual';

// Canvas hanya dimount di klien, dan hanya saat gate visual berat lolos.
const NamePlate = dynamic(
  () => import('@/components/three/NamePlate').then((mod) => ({ default: mod.NamePlate })),
  { ssr: false, loading: () => null },
);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Pola arch dari template softlife: slot sempit melengkung -> panel penuh.
const ARCH_FROM = 'inset(72% 30% 0% 30% round 20% 20% 0% 0% / 28% 28% 0% 0%)';
const ARCH_TO = 'inset(0% 0% 0% 0% round 50% 50% 0% 0% / 100% 100% 0% 0%)';

export default function HeroSection() {
  const { isLowPowerMode } = usePerformance();
  const prefersReducedMotion = usePrefersReducedMotion();
  const heavy = shouldRenderHeavyVisuals({ isLowPowerMode, prefersReducedMotion });
  const sectionRef = useRef<HTMLElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const arch = archRef.current;
    const content = contentRef.current;
    if (!section || !arch || !content) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom 30%',
          scrub: 0.5,
        },
      });

      tl.fromTo(arch, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none' }, 0)
        .fromTo(
          arch,
          { clipPath: ARCH_FROM },
          { clipPath: ARCH_TO, duration: 1, ease: 'none' },
          0,
        )
        .fromTo(
          content,
          { y: 0, opacity: 1 },
          { y: -80, opacity: 0, duration: 0.7, ease: 'none' },
          0,
        );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <HeroGrid />
      {/* Plate di kanan atas (x ≈ 820–1380, y ≈ 100–420 @1440×1000), di band kosong
           kanan END dan di atas ENGINEER; tidak overlap headline maupun navbar.
           Di bawah lg disembunyikan (headline memenuhi layar) agar tidak pernah menempel
           pada teks. opacity-70 dihapus karena itu menurunkan opacity nama-overlay. */}
      <div className="pointer-events-none absolute z-0 top-[100px] right-[60px] hidden lg:block">
        {heavy ? (
          <NamePlate name={portfolioData.personal.name} role={portfolioData.personal.title.id} />
        ) : (
          <div
            className="relative w-full max-w-[560px] h-[320px] rounded-2xl border border-primary/20 bg-primary/5"
            style={{ transform: 'rotateX(6deg) rotateY(-6deg) scale(0.97)' }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center">
              <span className="font-sans font-medium text-foreground">{portfolioData.personal.name}</span>
              <span className="font-mono text-sm text-muted-foreground mt-2">{portfolioData.personal.title.id}</span>
            </div>
          </div>
        )}
      </div>
      <div ref={contentRef} className="relative z-10 flex items-center justify-center w-full">
        <HeroVisual />
      </div>

      {/* Arch penutup hero; warnanya sama dengan StatsSection agar sambungannya mulus.
          opacity-0 = keadaan tanpa JS / prefers-reduced-motion. */}
      <div
        ref={archRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-secondary opacity-0"
      />
    </section>
  );
}

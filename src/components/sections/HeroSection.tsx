'use client';

import dynamic from 'next/dynamic';
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

export default function HeroSection() {
  const { isLowPowerMode } = usePerformance();
  const prefersReducedMotion = usePrefersReducedMotion();
  const heavy = shouldRenderHeavyVisuals({ isLowPowerMode, prefersReducedMotion });

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 flex items-center justify-center w-full">
        <HeroVisual />
      </div>
    </section>
  );
}

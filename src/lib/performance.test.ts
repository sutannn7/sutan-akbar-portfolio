import { describe, it, expect } from 'vitest';
import { shouldRenderHeavyVisuals } from '@/lib/performance';

describe('shouldRenderHeavyVisuals', () => {
  it('menyalakan visual berat di perangkat kuat tanpa prefers-reduced-motion', () => {
    expect(shouldRenderHeavyVisuals({ isLowPowerMode: false, prefersReducedMotion: false })).toBe(true);
  });
  it('mematikan visual berat di low power', () => {
    expect(shouldRenderHeavyVisuals({ isLowPowerMode: true, prefersReducedMotion: false })).toBe(false);
  });
  it('mematikan visual berat saat prefers-reduced-motion', () => {
    expect(shouldRenderHeavyVisuals({ isLowPowerMode: false, prefersReducedMotion: true })).toBe(false);
  });
});

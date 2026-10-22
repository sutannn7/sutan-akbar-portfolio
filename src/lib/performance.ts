export function shouldRenderHeavyVisuals(opts: {
  isLowPowerMode: boolean;
  prefersReducedMotion: boolean;
}): boolean {
  return !opts.isLowPowerMode && !opts.prefersReducedMotion;
}

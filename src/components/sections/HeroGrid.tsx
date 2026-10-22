const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <filter id="g">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#g)" opacity="0.04" />
  </svg>`,
);

export function HeroGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage: [
          `linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)`,
          `linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px)`,
          `url("data:image/svg+xml,${GRAIN_SVG}")`,
          `radial-gradient(600px circle at 20% 80%, rgba(200, 242, 70, 0.14), transparent 70%)`,
        ].join(', '),
        backgroundSize: '48px 48px, 48px 48px, auto, 100% 100%',
        backgroundRepeat: 'repeat, repeat, repeat, no-repeat',
        backgroundPosition: '0 0, 0 0, 0 0, 20% 80%',
        maskImage: 'radial-gradient(circle, black 55%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle, black 55%, transparent 100%)',
      }}
    />
  );
}

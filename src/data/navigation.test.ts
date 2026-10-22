import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { NAV_ITEMS } from '@/data/navigation';

const APP_DIR = path.resolve(__dirname, '..', 'app');

describe('NAV_ITEMS', () => {
  it('setiap href internal punya route yang ada', () => {
    for (const item of NAV_ITEMS) {
      if (!item.href.startsWith('/')) continue;
      if (item.href === '/') continue;
      const routeDir = path.join(APP_DIR, item.href.replace(/^\//, ''));
      const routeFile = path.join(APP_DIR, `${item.href.replace(/^\//, '')}.tsx`);
      expect(existsSync(routeDir) || existsSync(routeFile), item.href).toBe(true);
    }
  });
  it('tidak ada href ke route yang dibuang', () => {
    for (const item of NAV_ITEMS) {
      expect(['/blog', '/gallery', '/achievements']).not.toContain(item.href);
    }
  });
  it('tidak ada label hardcoded orang lain', () => {
    for (const item of NAV_ITEMS) {
      expect(item.labelKey).toMatch(/^[a-zA-Z.]+$/);
    }
  });
});

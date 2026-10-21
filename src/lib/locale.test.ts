import { describe, it, expect } from 'vitest';
import { resolveLocale } from '@/lib/locale';

describe('resolveLocale', () => {
  it('default ke id saat tidak ada cookie', () => {
    expect(resolveLocale(undefined)).toBe('id');
  });
  it('menghormati cookie yang valid', () => {
    expect(resolveLocale('en')).toBe('en');
    expect(resolveLocale('id')).toBe('id');
  });
  it('menolak cookie yang tidak dikenal', () => {
    expect(resolveLocale('fr')).toBe('id');
    expect(resolveLocale('')).toBe('id');
  });
});

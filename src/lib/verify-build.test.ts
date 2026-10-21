import { describe, it, expect } from 'vitest';
import { findForbidden } from '@/lib/verify-build';

describe('findForbidden', () => {
  it('menemukan string terlarang di dalam teks', () => {
    expect(findForbidden('Halo Arfazrll dunia', ['arfazrll'])).toEqual(['arfazrll']);
  });
  it('tidak menemukan apa pun pada teks bersih', () => {
    expect(findForbidden('Halo Sutan', ['arfazrll', 'syahril'])).toEqual([]);
  });
  it('menCocokkan secara case-insensitive', () => {
    expect(findForbidden('ARFAZRLL', ['arfazrll'])).toEqual(['arfazrll']);
  });
});

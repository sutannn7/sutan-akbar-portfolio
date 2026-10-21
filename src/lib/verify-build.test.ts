import { describe, it, expect } from 'vitest';
import { findForbidden, isTextFile, parseForbidden } from '@/lib/verify-build';

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
  it('tidak mencocokkan apa pun kalau daftar forbidden kosong', () => {
    expect(findForbidden('berkas apa pun', [])).toEqual([]);
  });
});

describe('isTextFile', () => {
  it('menerima ekstensi teks dari output Next', () => {
    for (const file of ['a.html', 'b.js', 'c.css', 'd.json', 'e.txt', 'f.map', 'g.rsc', 'h.meta']) {
      expect(isTextFile(file)).toBe(true);
    }
  });
  it('menolak aset biner', () => {
    for (const file of ['logo.png', 'font.woff2', 'photo.JPG', 'build.wasm']) {
      expect(isTextFile(file)).toBe(false);
    }
  });
  it('menolak file tanpa ekstensi', () => {
    expect(isTextFile('.next/static/chunks/README')).toBe(false);
  });
});

describe('parseForbidden', () => {
  it('membuang nilai --forbidden= yang kosong', () => {
    expect(parseForbidden(['--forbidden=', '--forbidden=arfazrll', '--lain'])).toEqual(['arfazrll']);
  });
  it('argumen kosong tidak membuat semua file cocok', () => {
    expect(findForbidden('berkas apa pun', parseForbidden(['--forbidden=']))).toEqual([]);
  });
});

import { describe, it, expect } from 'vitest';
import id from '../../messages/id.json';
import en from '../../messages/en.json';

const keys = (o: object, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v as object, `${prefix}${k}.`) : [`${prefix}${k}`]
  );

describe('messages', () => {
  it('id dan en punya key yang sama persis', () => {
    expect(keys(id).sort()).toEqual(keys(en).sort());
  });
  it('namespace yang dibuang sudah hilang', () => {
    for (const ns of ['blog', 'gallery', 'chatbot']) {
      expect(Object.keys(id)).not.toContain(ns);
      expect(Object.keys(en)).not.toContain(ns);
    }
  });
  it('tidak ada nilai kosong', () => {
    for (const k of keys(id)) {
      const get = (o: any, path: string) => path.split('.').reduce((a, p) => a[p], o);
      expect((get(id, k) as string).trim(), k).not.toBe('');
      expect((get(en, k) as string).trim(), k).not.toBe('');
    }
  });
});

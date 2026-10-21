import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const css = readFileSync(path.resolve(__dirname, 'globals.css'), 'utf8');

function block(selector: string): string {
  const start = css.indexOf(selector);
  expect(start, `selector ${selector} tidak ditemukan`).toBeGreaterThan(-1);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  return css.slice(open, close);
}

const DARK: Record<string, string> = {
  '--background': '240 10% 4%',
  '--card': '240 8% 7%',
  '--muted': '240 7% 13%',
  '--border': '240 10% 18%',
  '--foreground': '240 20% 95%',
  '--muted-foreground': '240 8% 62%',
  '--primary': '74 100% 63%',
  '--primary-foreground': '240 10% 5%',
  '--accent': '190 100% 60%',
};

const LIGHT: Record<string, string> = {
  '--background': '0 0% 99%',
  '--card': '0 0% 100%',
  '--muted': '240 10% 95%',
  '--border': '240 10% 88%',
  '--foreground': '240 12% 8%',
  '--muted-foreground': '240 6% 42%',
  '--primary': '74 100% 63%',
  '--primary-foreground': '240 10% 5%',
};

describe('token warna', () => {
  it('blok .dark memakai nilai dark yang dikunci', () => {
    const dark = block('.dark');
    for (const [token, value] of Object.entries(DARK)) {
      expect(dark, token).toContain(`${token}: ${value}`);
    }
  });
  it('blok :root memakai nilai light yang dikunci', () => {
    const root = block(':root');
    for (const [token, value] of Object.entries(LIGHT)) {
      expect(root, token).toContain(`${token}: ${value}`);
    }
  });
});

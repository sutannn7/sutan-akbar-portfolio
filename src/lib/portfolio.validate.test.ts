import { describe, it, expect } from 'vitest';
import { portfolioData } from '@/data/portfolio';

const FORBIDDEN_CLAIMS = [
  /\bAI\b/,
  /\bAI\s+Engineer\b/i,
  /machine learning/i,
  /data science/i,
  /full-?stack engineer/i,
];

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('portfolioData', () => {
  it('tepat 4 proyek utama', () => {
    expect(portfolioData.projects).toHaveLength(4);
  });
  it('slug proyek unik', () => {
    const slugs = portfolioData.projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('setiap proyek punya minimal satu link yang bisa diklik', () => {
    for (const p of portfolioData.projects) {
      expect(p.repoUrl || p.demoUrl, p.slug).toBeTruthy();
    }
  });
  it('tidak ada URL placeholder', () => {
    for (const url of allStrings(portfolioData)) {
      if (url.startsWith('http') || url.startsWith('/')) {
        expect(url, 'URL placeholder').not.toContain('#');
        expect(url, 'URL harus absolut atau path internal').toMatch(/^(https:\/\/|\/)/);
      }
    }
  });
  it('tidak ada klaim yang tidak didukung', () => {
    for (const s of allStrings(portfolioData)) {
      for (const re of FORBIDDEN_CLAIMS) {
        expect(s, `klaim terlarang: ${re}`).not.toMatch(re);
      }
    }
  });
  it('semua string terisi (tidak ada string kosong)', () => {
    const empty = allStrings(portfolioData).filter((s) => s.length === 0);
    expect(empty).toHaveLength(0);
  });
  it('badge skill hanya nilai yang diizinkan', () => {
    for (const group of portfolioData.skills) {
      for (const item of group.items) {
        expect(['dasar', 'nanodua', 'mahir'], item.name).toContain(item.badge);
      }
    }
  });
  it('personal punya nama, email, dan lokasi', () => {
    expect(portfolioData.personal.name).toBeTruthy();
    expect(portfolioData.personal.email).toContain('@');
    expect(portfolioData.personal.location).toContain('Palembang');
  });
});

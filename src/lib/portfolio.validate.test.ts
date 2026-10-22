import { describe, it, expect } from 'vitest';
import { portfolioData } from '@/data/portfolio';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const FORBIDDEN_CLAIMS = [
  /\bAI\b/,
  /\bAI\s+Engineer\b/i,
  /machine learning/i,
  /data science/i,
  /full-?stack engineer/i,
];

// Component-layer guard: multi-word phrases only. Deliberately does NOT scan
// for a bare `AI` substring (false positives on EMAIL, MAIN, DETAIL, ...).
const FORBIDDEN_COMPONENT_CLAIMS = [
  /\bAI Engineer\b/i,
  /\bAI & DATA\b/i,
  /\bMachine Learning\b/i,
  /\bData Science\b/i,
  /\bFull-?stack Engineer\b/i,
  /scalable systems powered by intelligence/i,
];

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

// Walk src/ recursively, returning every .ts/.tsx file. The test file itself
// is excluded because it declares these very regexes as literals and would
// self-match.
function tsFiles(dir: string): string[] {
  let out: string[] = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...tsFiles(full));
    else if (
      ent.isFile() &&
      (full.endsWith('.ts') || full.endsWith('.tsx')) &&
      !full.endsWith('portfolio.validate.test.ts')
    ) {
      out.push(full);
    }
  }
  return out;
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
  it('proyek Website Jurusan kategori Web (bukan Full-stack)', () => {
    const wj = portfolioData.projects.find((p) => p.title.id === 'Website Profil Jurusan MI POLSRI');
    expect(wj).toBeDefined();
    expect(wj?.category).toBe('Web');
  });
  it('lab kosong', () => {
    expect(portfolioData.lab).toHaveLength(0);
  });
  it('LearnEase dan Portofolio v3 tidak punya image', () => {
    const le = portfolioData.projects.find((p) => p.slug === 'learnease');
    const p4 = portfolioData.projects.find((p) => p.slug === 'portofolio-v3');
    expect(le?.image).toBeUndefined();
    expect(p4?.image).toBeUndefined();
  });
  it('longDescription LearnEase mengikuti urutan proses', () => {
    const le = portfolioData.projects.find((p) => p.slug === 'learnease');
    expect(le).toBeDefined();
    const ld = le!.longDescription.id;
    const order = ['audit', 'token desain', 'mode gelap', 'prototipe', 'pengujian otomatis', 'Chrome headless', 'usulan'];
    const indices = order.map((term) => ld.indexOf(term));
    indices.forEach((idx, i) => {
      expect(idx, `term '${order[i]}' ditemukan di longDescription LearnEase`).toBeGreaterThanOrEqual(0);
    });
    for (let i = 1; i < indices.length; i++) {
      expect(indices[i], `${order[i - 1]} harus sebelum ${order[i]}`).toBeGreaterThan(indices[i - 1]);
    }
  });
});

describe('portfolioData komponen', () => {
  it('tidak ada klaim terlarang di berkas komponen', () => {
    const files = tsFiles(join(process.cwd(), 'src'));
    for (const file of files) {
      const content = readFileSync(file, 'utf8');
      for (const re of FORBIDDEN_COMPONENT_CLAIMS) {
        expect(content, `${file}: ${re}`).not.toMatch(re);
      }
    }
  });
});

describe('berkas pesan', () => {
  it('tidak ada klaim terlarang di berkas pesan', () => {
    for (const file of ['id.json', 'en.json']) {
      const content = readFileSync(join(process.cwd(), 'messages', file), 'utf8');
      const json = JSON.parse(content);
      for (const s of allStrings(json)) {
        for (const re of FORBIDDEN_COMPONENT_CLAIMS) {
          expect(s, `${file}: ${re}`).not.toMatch(re);
        }
      }
    }
  });
});

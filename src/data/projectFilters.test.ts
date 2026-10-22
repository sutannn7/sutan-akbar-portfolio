import { describe, it, expect } from 'vitest';
import { PROJECT_FILTERS } from '@/data/projectFilters';
import { portfolioData } from '@/data/portfolio';

describe('PROJECT_FILTERS', () => {
  it('berisi setiap teknologi yang dipakai minimal satu proyek', () => {
    for (const tech of portfolioData.projects.flatMap((p) => p.techStack)) {
      expect(PROJECT_FILTERS, tech).toContain(tech);
    }
  });
  it('tanpa duplikat', () => {
    expect(new Set(PROJECT_FILTERS).size).toBe(PROJECT_FILTERS.length);
  });
  it('tidak kosong, karena filter dengan satu kategori tidak berguna', () => {
    expect(PROJECT_FILTERS.length).toBeGreaterThan(1);
  });
});

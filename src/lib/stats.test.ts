import { describe, it, expect } from 'vitest';
import { computeStats } from '@/lib/stats';
import { portfolioData } from '@/data/portfolio';

describe('computeStats', () => {
  it('menghitung dari fixture', () => {
    const stats = computeStats({
      projects: [
        { demoUrl: 'https://a.dev' },
        { repoUrl: 'https://github.com/a' },
        { demoUrl: 'https://b.dev' },
      ],
      lab: [{ slug: 'x' }],
    } as any);
    expect(stats).toEqual({ projectsCount: 3, liveCount: 2, labCount: 1, techCount: 0 });
  });
  it('menghitung data asli tanpa hard-code', () => {
    const stats = computeStats(portfolioData as any);
    expect(stats.projectsCount).toBe(portfolioData.projects.length);
    expect(stats.liveCount).toBe(portfolioData.projects.filter((p) => p.demoUrl).length);
    expect(stats.labCount).toBe(portfolioData.lab.length);
    expect(stats.techCount).toBe(
      new Set(portfolioData.projects.flatMap((p) => p.techStack)).size
    );
  });
  it('tidak menghitung URL yang bukan link demo', () => {
    const stats = computeStats({ projects: [{ demoUrl: '' }], lab: [] } as any);
    expect(stats.liveCount).toBe(0);
  });
});

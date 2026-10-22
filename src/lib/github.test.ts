import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchRepos } from '@/lib/github';

afterEach(() => vi.unstubAllGlobals());

describe('fetchRepos', () => {
  it('mengembalikan repo yang sudah dipetakan', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [
        { name: 'a', description: 'x', html_url: 'https://github.com/a', stargazers_count: 2, language: 'TypeScript', pushed_at: '2026-10-01T00:00:00Z' },
      ],
    })));
    const res = await fetchRepos('sutannn7');
    expect(res.failed).toBe(false);
    expect(res.repos[0]).toEqual({ name: 'a', description: 'x', htmlUrl: 'https://github.com/a', stargazersCount: 2, language: 'TypeScript', pushedAt: '2026-10-01T00:00:00Z' });
  });
  it('tidak melempar saat request gagal', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    const res = await fetchRepos('sutannn7');
    expect(res.failed).toBe(true);
    expect(res.repos).toEqual([]);
  });
  it('tidak melempar saat respons tidak ok', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) })));
    const res = await fetchRepos('sutannn7');
    expect(res.failed).toBe(true);
  });
});

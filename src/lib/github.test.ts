import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchRepos } from '@/lib/github';

afterEach(() => vi.unstubAllGlobals());

describe('fetchRepos', () => {
  it('mengembalikan repo yang sudah dipetakan', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [
        { name: 'a', description: 'x', html_url: 'https://github.com/a', stargazers_count: 2, language: 'TypeScript', pushed_at: '2026-10-01T00:00:00Z', size: 120 },
      ],
    })));
    const res = await fetchRepos('sutannn7');
    expect(res.failed).toBe(false);
    expect(res.repos[0]).toEqual({ name: 'a', description: 'x', htmlUrl: 'https://github.com/a', stargazersCount: 2, language: 'TypeScript', pushedAt: '2026-10-01T00:00:00Z' });
  });
  it('membuang repo yang kosong (size 0)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => [
        { name: 'kosong', description: '', html_url: 'https://github.com/kosong', stargazers_count: 0, language: null, pushed_at: '2026-10-01T00:00:00Z', size: 0 },
        { name: 'isi', description: 'x', html_url: 'https://github.com/isi', stargazers_count: 1, language: 'PHP', pushed_at: '2026-10-02T00:00:00Z', size: 900 },
      ],
    })));
    const res = await fetchRepos('sutannn7');
    expect(res.repos.map((r) => r.name)).toEqual(['isi']);
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

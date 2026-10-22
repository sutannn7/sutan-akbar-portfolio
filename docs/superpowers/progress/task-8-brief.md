### Task 8: Section homepage — stats, disciplines, about, journey, milestones, repo GitHub, CTA

**Files:**
- Create: `src/lib/stats.ts`, `src/lib/stats.test.ts`
- Create: `src/lib/github.ts`, `src/lib/github.test.ts`
- Create: `src/components/sections/Milestones.tsx`
- Create: `src/components/sections/GitHubRepos.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/sections/StatsSection.tsx`
- Modify: `src/components/sections/ExpertiseSection.tsx`
- Modify: `src/components/sections/AboutSection.tsx`
- Modify: `src/components/sections/ExperienceStickyScroll.tsx`
- Modify: `src/components/sections/CTASection.tsx`

**Interfaces:**
- Consumes: `portfolioData` (Task 4), `messages` (Task 5), `usePerformance` + `usePrefersReducedMotion` (Task 7)
- Produces:
  - `computeStats(data: { projects: { demoUrl?: string; techStack?: string[] }[]; lab: unknown[] }): { projectsCount: number; liveCount: number; labCount: number; techCount: number }` dari `src/lib/stats.ts` — `techCount` dihitung dari gabungan `techStack` unik semua proyek (tidak ada field `techStack` top-level di `PortfolioData`)
  - `fetchRepos(username: string): Promise<{ repos: Repo[]; failed: boolean }>` dari `src/lib/github.ts`, dengan `Repo = { name: string; description: string; htmlUrl: string; stargazersCount: number; language: string | null; pushedAt: string }`

- [ ] **Step 1: Tulis test stats yang gagal**

Buat `src/lib/stats.test.ts`:
```ts
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
```
Run: `npm.cmd run test`
Expected: FAIL — modul belum ada.

- [ ] **Step 2: Implementasikan `src/lib/stats.ts`**

```ts
export interface StatsInput {
  projects: { demoUrl?: string }[];
  lab: unknown[];
}
export interface Stats {
  projectsCount: number;
  liveCount: number;
  labCount: number;
  techCount: number;
}
export function computeStats(data: StatsInput & { techStack?: string[] }): Stats {
  const projects = data.projects ?? [];
  const tech = new Set((data.techStack ?? []).filter(Boolean));
  return {
    projectsCount: projects.length,
    liveCount: projects.filter((p) => typeof p.demoUrl === 'string' && p.demoUrl.length > 0).length,
    labCount: (data.lab ?? []).length,
    techCount: tech.size,
  };
}
```
`techStack` diambil dari gabungan `techStack` unik semua proyek.

- [ ] **Step 3: Tulis test github yang gagal**

Buat `src/lib/github.test.ts`:
```ts
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
```
Run: `npm.cmd run test`
Expected: FAIL — modul belum ada.

- [ ] **Step 4: Implementasikan `src/lib/github.ts`**

```ts
export interface Repo {
  name: string;
  description: string;
  htmlUrl: string;
  stargazersCount: number;
  language: string | null;
  pushedAt: string;
}

export async function fetchRepos(username: string): Promise<{ repos: Repo[]; failed: boolean }> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      { headers: { Accept: 'application/vnd.github+json' }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return { repos: [], failed: true };
    const raw = (await res.json()) as any[];
    return {
      failed: false,
      repos: raw.map((r) => ({
        name: r.name,
        description: r.description ?? '',
        htmlUrl: r.html_url,
        stargazersCount: r.stargazers_count ?? 0,
        language: r.language ?? null,
        pushedAt: r.pushed_at,
      })),
    };
  } catch {
    return { repos: [], failed: true };
  }
}
```
**Tanpa `Authorization` header dan tanpa token** — hanya endpoint publik.

- [ ] **Step 5: Buat `src/components/sections/GitHubRepos.tsx`**

Async server component. `const { repos, failed } = await fetchRepos(process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'sutannn7')`.
- Kalau `failed` **atau** `repos.length === 0`: render satu blok statis berisi link ke `https://github.com/sutannn7` — **jangan** render section kosong.
- Kalau ada repo: render grid kartu (nama repo, deskripsi, bahasa, stars, tanggal update terakhir) + link "Lihat semua di GitHub".
- Heading section: `t('projects.githubRepos')` = `Repo GitHub`.

- [ ] **Step 6: Buat `src/components/sections/Milestones.tsx`**

Server component. Render `portfolioData.milestones` sebagai timeline vertikal: tahun (mono, `text-primary`) + judul + deskripsi. Kalau `href` ada, judul jadi link.

- [ ] **Step 7: Rewrite `StatsSection.tsx`**

Angka dari `computeStats(portfolioData)` — **dilarang hard-code**. Empat kartu: Proyek / Live / Mini Project / Teknologi. Label dari `t('stats.*')`. Animasi counter pakai `useCountUp` yang sudah ada (`src/hooks/useCountUp.ts`); matikan kalau `prefersReducedMotion`.

**Slider "Latest Stories" dibuang.** `StatsSection.tsx:23` punya `const blogs: any[] = []` — array kosong yang diindeks, sehingga bisa render `undefined` atau crash. Section ini untuk portofolio, bukan blog. Hapus slider itu beserta wrapper/import yang jadi yatim.

- [ ] **Step 8: Rewrite `ExpertiseSection.tsx`**

Tiga kartu statis sesuai spec §8.5:
`INTERFACE CRAFT` (pixel detail, tipografi, animasi, aksesibilitas) · `FRONTEND SYSTEMS` (React/Next, state, API, optimasi, tooling) · `PRODUCT THINKING` (dari kebutuhan user ke keputusan teknis).
Deskripsi bahasa Indonesia dari `messages/id.json`, terjemahan di `en.json`. Judul tetap bahasa Inggris (konsisten dengan headline).

- [ ] **Step 9: Rewrite `AboutSection.tsx`**

Pakai `portfolioData.personal.bio` + `portfolioData.personal.links` + lokasi + bahasa. Hilangkan semua konten orang lain. Section ini jadi "ringkasan singkat" supaya `/about` (Task 10) jadi halaman lengkap.

**Prosa pindah dari message file ke data.** Key `about.leadIn.*` (`thesis`, `scope`, `bridging`, `integration`) dan `about.profile.narrative*` (`narrative`, `narrative2`, `profile.title`) saat ini masih di `messages/*.json` — padahal itu prosa, bukan label UI. Pindahkan isinya ke `portfolio.ts` ( sebagai `Localised` di `personal` atau field baru `personal.about`), lalu **hapus key-key tersebut dari `messages/id.json` DAN `messages/en.json`**. Spec §7: prosa konten tinggal di `portfolio.ts`.

- [ ] **Step 10: Adaptasi `ExperienceStickyScroll.tsx` jadi journey timeline**

Sumber data `portfolioData.journey` (bukan `portfolioData.experiences`). Render: tahun, judul, org, points. Kalau motion dimatikan, render sebagai daftar statis (tanpa sticky).

- [ ] **Step 11: Rewrite `CTASection.tsx`**

Copy: judul `Sedang mencari magang? Mari ngobrol.` + tombol ke `/contact` dan tombol kedua ke `/resume` (label `Unduh CV`). Pertahankan gaya block besar dari fork.

- [ ] **Step 12: Susun `src/app/page.tsx`**

Urutan section:
1. Hero (dari Task 7)
2. `StatsSection`
3. `ExpertiseSection`
4. Featured projects — 4 kartu dari `portfolioData.projects`, link ke `/projects/[slug]`
5. `AboutSection`
6. `ExperienceStickyScroll` (journey)
7. `GitHubRepos`
8. `Milestones`
9. `CTASection`

- [ ] **Step 12b: Rapi sisa palet neon di `tailwind.config.ts`**

Fork lama masih menyisakan `boxShadow.glow-sm/glow-md/glow-lg` dengan `#00FFFF` dan `backgroundImage.glass-gradient` / `mesh-gradient` bergradien neon. Semuanya harus mengikuti palet baru:
- `glow-sm` → `0 0 10px rgba(200,242,70,0.20)`
- `glow-md` → `0 0 20px rgba(200,242,70,0.28)`
- `glow-lg` → `0 0 40px rgba(200,242,70,0.34)`
- `glow-cyan` → `0 0 24px rgba(51,214,255,0.24)`
- hapus `mesh-gradient`; ganti `glass-gradient` jadi `linear-gradient(135deg, rgba(200,242,70,0.06) 0%, rgba(255,255,255,0.03) 100%)`

- [ ] **Step 13: Jalankan test dan build**

Run: `npm.cmd run test && npm.cmd run build`
Expected: PASS, build sukses.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: homepage sections - stats from data, disciplines, journey, milestones, github repos"
```

---


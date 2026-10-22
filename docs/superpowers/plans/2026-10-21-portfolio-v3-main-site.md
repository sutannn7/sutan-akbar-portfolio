# Portofolio v3 — Main Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah fork MIT `Arfazrll/PersonalBlog` menjadi portofolio pribadi Sutan Akbar Dwi Nugraha yang Positioning-nya "Frontend Engineer", berbahasa ID (default) + EN, dengan tema dark lime, dan tanpa satu pun sisa konten orang lain.

**Architecture:** Fork dimodifikasi in-place (bukan tulis ulang). Satu file data `src/data/portfolio.ts` menjadi sumber kebenaran untuk seluruh konten; `messages/{id,en}.json` hanya berisi label UI. Rute `/blog`, `/gallery`, `/achievements`, `/api/*` dihapus. Rute `/lab` **tidak** dibuat di plan ini (lihat "Plan 2–5" di bawah).

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v3 · next-intl · next-themes · Framer Motion · GSAP + ScrollTrigger · Lenis · @react-three/fiber + drei · Vitest (satu-satunya dev dependency baru)

**Spec:** `docs/superpowers/specs/2026-10-21-portfolio-v3-design.md` (di dalam repo ini — spec ikut travels dengan plan; executor membaca keduanya)

## Plan lain (terpisah, bukan bagian plan ini)

| Plan | Isi | Repo |
|---|---|---|
| 2 | Mini project `command-palette` | `sutannn7/sutan-command-palette` |
| 3 | Mini project `token-playground` | `sutannn7/sutan-token-playground` |
| 4 | Mini project `onboarding-flow` | `sutannn7/sutan-onboarding-flow` |
| 5 | Menambahkan rute `/lab` + section lab ke situs utama | `sutannn7/sutan-akbar-portfolio` |

Plan 2–4 saling independen. Plan 5 bergantung pada Plan 2–4 selesai **dan** mini project-nya sudah live di Vercel. Kalau tenggat mepet: Plan 5 di-drop, bukan dikirim dengan halaman kosong.

## Global Constraints

- Node.js ≥ 20 (mesin ini: v22.15.1). Selalu panggil `npm.cmd`, bukan `npm` — PowerShell memblokir `npm.ps1`.
- `.npmrc` fork (`legacy-peer-deps=true`) **wajib ada**. Jangan dihapus.
- Tailwind **v3**, bukan v4. Jangan migrasikan.
- `defaultLocale` = `'id'`. Auto-detect `accept-language` **dimatikan**.
- Palet (HSL, `src/styles/globals.css`): dark `--background: 240 10% 4%`, `--card: 240 8% 7%`, `--muted: 240 7% 13%`, `--border: 240 10% 18%`, `--foreground: 240 20% 95%`, `--muted-foreground: 240 8% 62%`, `--primary: 74 100% 63%`, `--primary-foreground: 240 10% 5%`, `--accent: 190 100% 60%`. Light: `--background: 0 0% 99%`, `--card: 0 0% 100%`, `--muted: 240 10% 95%`, `--border: 240 10% 88%`, `--foreground: 240 12% 8%`, `--muted-foreground: 240 6% 42%`, `--primary` & `--primary-foreground` sama dengan dark.
- Lime `#C8F246` **tidak boleh** jadi warna teks di light mode. Di light mode hanya boleh jadi fill dengan `primary-foreground` di atasnya.
- Font: `Inter` (body) + `JetBrains_Mono` (label/kode). Hapus `Playfair_Display` dan `Alex_Brush`.
- Larangan klaim di seluruh teks: kata `AI`, `Data Science`, `Machine Learning`, `Full-stack Engineer` tidak boleh muncul sebagai positioning/category.
- Tidak boleh ada URL `#`, string kosong, atau `demoUrl`/`repoUrl` yang tidak `https://`.
- Tidak boleh ada secret yang wajib: tidak ada API key LLM, tidak ada SMTP, tidak ada token GitHub.
- `LICENSE` fork (MIT) **tidak boleh** dihapus atau diubah. README harus berisi kredit ke `Arfazrll/PersonalBlog`. Footer harus punya link kecil "Built on MIT-licensed open source".
- Tidak boleh ada teks konten Indonesia yang dikunci di dalam komponen — semuanya lewat `portfolio.ts` atau `messages/*.json`.

## Review Focus

Lima kelas input/kondisi yang paling mungkin menggigit orang yang memakai situs ini — masing-masing punya test-nya di task yang owns kodenya:

1. **Koneksi GitHub API gagal atau rate-limited** → blok Repo GitHub harus tetap menampilkan link, tidak boleh section kosong (§6.4). → Task 8, test `src/lib/github.test.ts`.
2. **Viewport mobile / perangkat low-end** → Canvas 3D, shader, marquee, dan click spark harus mati; konten tetap terbaca dan LCP tidak tertahan WebGL (§9). → Task 7, test `src/lib/performance.test.ts`.
3. **`prefers-reduced-motion: reduce`** → tidak boleh ada GSAP ScrollTrigger, Lenis, atau marquee yang jalan (§9). → Task 7.
4. **Browser dengan `accept-language: en-US`** → tetap harus dapat versi ID, bukan EN (§7, keputusan #10). → Task 5, test `src/lib/locale.test.ts`.
5. **Browser tanpa JavaScript / JS gagal load** → seluruh konten utama harus tetap terbaca dari SSR, termasuk headline `FRONT / END / ENGINEER` dan link kontak (§9). → Task 7 + Task 11, test `scripts/verify-build.mjs`.

---

## File Structure

```
portofolio-v3/
├─ docs/superpowers/specs/2026-10-21-portfolio-v3-design.md   # salinan spec (Task 1)
├─ docs/superpowers/plans/2026-10-21-portfolio-v3-main-site.md # plan ini
├─ LICENSE                                                     # MIT asli — JANGAN diubah
├─ README.md                                                   # ditulis ulang (Task 11)
├─ vitest.config.ts                                            # BARU (Task 1)
├─ scripts/verify-build.mjs                                    # BARU (Task 1)
├─ messages/{id,en}.json                                       # MODIFIKASI (Task 5)
├─ tailwind.config.ts                                          # MODIFIKASI (Task 3)
├─ next.config.ts                                              # MODIFIKASI (Task 3)
├─ package.json                                                # MODIFIKASI (Task 1, 2)
└─ src/
   ├─ types/index.ts                     # MODIFIKASI (Task 4) — tipe data baru
   ├─ data/portfolio.ts                  # MODIFIKASI (Task 4) — 186KB → ~12KB
   ├─ data/navigation.ts                 # BARU (Task 6) — daftar nav + label
   ├─ lib/stats.ts                       # BARU (Task 8) — hitung statistik dari data
   ├─ lib/stats.test.ts                  # BARU (Task 8)
   ├─ lib/locale.ts                      # BARU (Task 5) — resolveLocale()
   ├─ lib/locale.test.ts                 # BARU (Task 5)
   ├─ lib/github.ts                      # BARU (Task 8) — fetch repo publik + fallback
   ├─ lib/github.test.ts                 # BARU (Task 8)
   ├─ lib/portfolio.validate.test.ts     # BARU (Task 4) — anti-goal guard
   ├─ i18n/settings.ts                   # MODIFIKASI (Task 5)
   ├─ i18n/request.ts                    # MODIFIKASI (Task 5)
   ├─ lib/i18n.ts                        # HAPUS (Task 5, jika tak terpakai)
   ├─ styles/globals.css                 # MODIFIKASI (Task 3)
   ├─ app/layout.tsx                     # MODIFIKASI (Task 6)
   ├─ app/page.tsx                       # MODIFIKASI (Task 7, 8)
   ├─ app/about/page.tsx                 # BARU (Task 6) — di-enrich di Task 10
   ├─ app/{projects,skills,contact,resume}/page.tsx                  # MODIFIKASI (Task 9, 10)
   ├─ app/api/                           # HAPUS semua (Task 2)
   ├─ components/layout/{Navbar,Footer}.tsx                    # MODIFIKASI (Task 6)
   ├─ components/sections/*.tsx          # MODIFIKASI / HAPUS (Task 2, 8)
   ├─ components/three/NamePlate.tsx     # BARU (Task 7) — R3F glass slab
   └─ components/three/Lanyard.tsx       # HAPUS (Task 2)
```

**Route `/about` dibuat di Task 6 dan di-enrich di Task 10. Route `/lab` tidak dibuat di plan ini — ia datang di Plan 5.**

---

### Task 1: Repo hygiene, test bootstrap, dan spec masuk repo

**Files:**
- Modify: `package.json` (tambah script `test`, `verify`, `typecheck`)
- Create: `vitest.config.ts`
- Create: `scripts/verify-build.mjs`
- Create: `docs/superpowers/specs/2026-10-21-portfolio-v3-design.md` (salin dari `C:\Users\lenovo\Documents\Proyek Bawaan\docs\superpowers\specs\2026-10-21-portfolio-v3-design.md`)
- Create: `.env.example`

**Interfaces:**
- Consumes: —
- Produces: `npm.cmd run test` (vitest run), `npm.cmd run verify` (node scripts/verify-build.mjs), `npm.cmd run typecheck` (tsc --noEmit). `scripts/verify-build.mjs` menerima argumen `--forbidden=<string>` yang bisa diulang, dan keluar non-zero kalau salah satu string forbidden muncul di `.next` output.

- [ ] **Step 1: Set remote dan install dependency**

```bash
cd C:\Users\lenovo\portofolio-v3
git remote rename origin upstream
git remote add origin https://github.com/sutannn7/sutan-akbar-portfolio.git
npm.cmd install
```
Expected: `npm install` selesai tanpa error; `node_modules/` berisi `next`, `react`, `tailwindcss`.

Lalu salin dua screenshot yang sudah ada ke `public/projects/`:
```bash
mkdir -p public\projects
copy "C:\Users\lenovo\portofolio-nextjs\public\projects\polsri.jpg" public\projects\
copy "C:\Users\lenovo\portofolio-nextjs\public\projects\kopi.jpg" public\projects\
```
Verified: kedua file ada di `public/projects/`. (`learnease.jpg` dan screenshot portofolio v3 menyusul di Task 11; sampai itu, kartu proyek itu merender tanpa gambar — bukan dengan gambar placeholder.)

- [ ] **Step 2: Tambah vitest sebagai satu-satunya dev dependency baru**

```bash
npm.cmd install -D vitest
```
Tambahkan ke `package.json`:
```json
"scripts": {
  "test": "vitest run",
  "typecheck": "tsc --noEmit",
  "verify": "node --experimental-strip-types scripts/verify-build.ts"
}
```
Tambahkan juga ke `tsconfig.json` pada array `exclude`: `"scripts"` (agar `tsc --noEmit` tidak mengecek import berekstensi `.ts` di dalam `scripts/`).

- [ ] **Step 3: Buat `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
```

- [ ] **Step 4: Tulis test yang gagal untuk `scripts/verify-build.mjs`**

Buat `src/lib/verify-build.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { findForbidden } from '@/lib/verify-build';

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
});
```

- [ ] **Step 5: Jalankan test untuk memastikan gagal**

Run: `npm.cmd run test`
Expected: FAIL — `Cannot find module '@/lib/verify-build'`.

- [ ] **Step 6: Implementasikan `src/lib/verify-build.ts`**

```ts
export function findForbidden(text: string, forbidden: string[]): string[] {
  const lower = text.toLowerCase();
  return forbidden.filter((f) => lower.includes(f.toLowerCase()));
}
```
Buat `scripts/verify-build.ts` yang: meng-import `findForbidden` dari `../src/lib/verify-build.ts` (satu-satunya implementasi — jangan duplikasi logikanya), membaca semua file teks di `.next/server/app` dan `.next/static`, mengumnikan string forbidden dari argumen `--forbidden=`, mencetak offending file + string, dan `process.exit(1)` kalau ada yang kena. Kalau `.next/server/app` belum ada, keluar 0 dengan pesan "no build output - jalankan npm run build dulu".

- [ ] **Step 7: Jalankan test untuk memastikan lulus**

Run: `npm.cmd run test`
Expected: PASS, 3 tests.

- [ ] **Step 8: Buat `.env.example`**

Isi **hanya** ini (hanya satu env var yang boleh dipakai situs ini):
```
# Username GitHub untuk blok Repo GitHub. Tidak perlu token.
NEXT_PUBLIC_GITHUB_USERNAME=sutannn7
```
`GITHUB_TOKEN`, `GROQ_API_KEY`, `GEMINI_API_KEY`, `EMAIL_USER`, `WAKATIME_API_KEY` **tidak boleh** ada.

- [ ] **Step 9: Salin spec ke dalam repo**

```bash
mkdir docs/superpowers/specs
copy "C:\Users\lenovo\Documents\Proyek Bawaan\docs\superpowers\specs\2026-10-21-portfolio-v3-design.md" docs\superpowers\specs\
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: bootstrap repo - vitest, verify-build script, spec, env example"
```

---

### Task 2: Pangkas rute, komponen, dan dependency

**Files:**
- Delete: `src/app/api/` (seluruhnya: chat, contact, gallery, github-languages, github-stats, kaggle-stats, wakatime, wakatime-stats, downloadlanyard)
- Delete: `src/app/blog/`, `src/app/gallery/`, `src/app/achievements/`, `src/app/experience/` (rute `/experience` tidak ada di spec §5.1; perannya pindah ke section journey di homepage dan ke `/about`)
- Delete: `src/app/actions/getGalleryImages.ts`, `src/app/actions/getJourneyImages.ts`, `src/app/actions/getProjectImages.ts`
- Delete: `src/components/layout/ChatBot.tsx`
- Delete: `src/components/layout/SocialCorner.tsx` (widget sosial Arfazrll; meng-import ChatBot)
- Delete: `src/components/stats/WakaTimeCard.tsx`, `src/components/stats/WakaTimeStats.tsx`, `src/components/stats/GitHubStats.tsx`, `src/components/stats/StatsCard.tsx` (fetch ke `/api/github-stats` yang dihapus; tidak ada importer lain)
- Delete: `src/components/ui/github-showcase.tsx` (memakai `retro-space-shooter-git-hub-calendar`; digantikan blok Repo GitHub baru di Task 8)
- Delete: `src/components/sections/CertificateHeroScroll.tsx`
- Delete: `src/components/sections/gallery/`, `src/components/sections/blog/`
- Delete: `src/components/ui/kaggle-showcase.tsx`, `src/components/ui/wakatime-showcase.tsx`, `src/components/ui/SkillRadar.tsx`, `src/components/ui/SplineScene.tsx`, `src/components/ui/Hyperspeed.tsx`, `src/components/ui/retro-space-shooter-git-hub-calendar.tsx`, `src/components/ui/pdf-viewer.tsx`, `src/components/ui/DesignTestimonials.tsx`
- Delete: `src/components/three/Lanyard.tsx`, `src/components/three/Scene3D.tsx`, `src/components/three/index.ts` (hero digantikan `NamePlate.tsx` di Task 7)
- Modify: `package.json` (buang dependency yang tidak lagi terpakai)

**Interfaces:**
- Consumes: `npm.cmd run test`, `npm.cmd run typecheck` dari Task 1
- Produces: repo yang `npm.cmd run build` sukses tanpa file yang dihapus. Tidak ada interface baru.

- [ ] **Step 1: Catat baseline — build harus hijau SEBELUM penghapusan**

Run: `npm.cmd run build`
Expected: build sukses. Kalau sudah gagal, perbaiki dulu (fork mungkin butuh `npm.cmd install` ulang) sebelum lanjut. Catat error yang muncul sebagai catatan.

- [ ] **Step 2: Hapus rute dan API route**

```bash
git rm -r --cached src/app/api src/app/blog src/app/gallery src/app/achievements src/app/actions
Remove-Item -Recurse -Force src/app/api, src/app/blog, src/app/gallery, src/app/achievements, src/app/actions
```

- [ ] **Step 3: Hapus komponen yang CONTENT-nya milik orang lain**

```bash
Remove-Item -Recurse -Force src/components/layout/ChatBot.tsx, src/components/stats/WakaTimeCard.tsx, src/components/stats/WakaTimeStats.tsx, src/components/sections/CertificateHeroScroll.tsx, src/components/sections/gallery, src/components/sections/blog, src/components/ui/kaggle-showcase.tsx, src/components/ui/wakatime-showcase.tsx, src/components/ui/SkillRadar.tsx, src/components/ui/SplineScene.tsx, src/components/ui/Hyperspeed.tsx, src/components/ui/retro-space-shooter-git-hub-calendar.tsx, src/components/ui/pdf-viewer.tsx, src/components/ui/DesignTestimonials.tsx, src/components/three/Lanyard.tsx, src/components/three/index.ts
```

- [ ] **Step 4: Cari sisa import dari file yang dihapus**

```bash
grep -rn "ChatBot\|WakaTime\|kaggle-showcase\|SkillRadar\|SplineScene\|Hyperspeed\|pdf-viewer\|Lanyard\|Scene3D\|getProjectImages\|getGalleryImages\|getJourneyImages\|SocialCorner\|GitHubStats\|github-showcase\|retro-space-shooter" src/
```

**Peta kerusakan yang sudah dipetakan sebelum task ini (verifikasi ulang, jangan percaya buta):**

| File yang tersisa | Yang di-import | Tetap rusak sampai |
|---|---|---|
| `src/app/page.tsx` | `SocialCorner`, `Hyperspeed` (dynamic), `Scene3D` (dynamic) | Task 7 |
| `src/app/layout.tsx` | `ChatBot` | Task 6 |
| `src/app/skills/page.tsx` | `SplineScene` | Task 10 |
| `src/app/resume/page.tsx` | `PdfViewer` | Task 10 |
| `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx` | `getProjectImages` | Task 9 |
| `src/app/contact/page.tsx` | `fetch('/api/contact')` | Task 10 |
| `src/components/sections/AboutSection.tsx` | `KaggleShowcase`, `WakaTimeShowcase`, `GitHubShowcase`, `SocialCorner` | Task 8 |

Semua file di tabel itu **akan** ditulis ulang oleh task yang disebut. Kalau hasil grep menunjukkan file lain yang tidak ada di tabel, hapus import-nya sekarang juga dan catat di commit body.

- [ ] **Step 5: Buang dependency yang tidak terpakai**

Hapus dari `package.json` (hanya kalau `grep -rn "<pkg>" src/` kosong, **dan** `npm.cmd run build` tetap hijau):
`@splinetool/react-spline`, `@splinetool/runtime`, `matter-js`, `@types/matter-js`, `ogl`, `tsparticles`, `@tsparticles/react`, `@tsparticles/slim`, `aos`, `@types/aos`, `nodemailer`, `@types/nodemailer`, `react-pdf`, `shiki`, `react-github-calendar`, `date-fns`, `meshline`, `gl-matrix`, `@headlessui/react`, `@base-ui/react`, `@hugeicons/core-free-icons`, `@hugeicons/react`, `@phosphor-icons/react`, `react-icons`, `@react-spring/web`, `react-spring`, `@radix-ui/react-avatar`, `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `@radix-ui/react-tooltip`, `three-globe`, `@react-three/postprocessing`, `postprocessing`, `@react-three/rapier`, `twpm` — **kecuali** `@react-three/drei` dan `@react-three/fiber` (dipakai Task 7).

Setelah mengubah `package.json`, jalankan `npm.cmd install` untuk memperbarui lockfile.

- [ ] **Step 6: Verifikasi build**

Run: `npm.cmd run build`
Expected: **FAIL** dengan error "Module not found" untuk file yang di-import tapi sudah dihapus. Ini normal, dan Task 6-10 yang akan menggantinya. **Catat daftar error persis di file mana saja.**

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: prune unused routes, components and dependencies"
```
Commit boleh gagal build — Task 6–10 yang memperbaikinya. Catat di commit body: "build broken until Task 6-10".

---

### Task 2b: Pangkas komponen yatim dan dependency sisa

**Files:**
- Delete: 70 file yatim (daftar lengkap di bawah)
- Modify: `package.json` (buang 11 package yang jadi tak terpakai)
- Create: `scripts/find-unreachable.mjs`

**Interfaces:**
- Consumes: state repo setelah Task 2 (92 file terjangkau, 86 tak terjangkau)
- Produces: `scripts/find-unreachable.mjs` — alat reachability graph: parse import statis + dynamic import dari entry point `src/app/**` dan `src/proxy.ts`, lalu cetak file yang tak terjangkau. Dijalankan: `node scripts/find-unreachable.mjs`.

> **Raison d'être:** repo ini adalah portofolio publik. 86 file tak terjangkau = 86 file mati yang dibaca siapa pun yang cloned repo. Membersihkannya memangkas repo jadi ~⅓ dan melepas 11 package.

- [ ] **Step 1: Buat `scripts/find-unreachable.mjs`**

Node script yang:
1. Mengumpulkan semua `.ts/.tsx/.js/.jsx` di bawah `src/`.
2. Entry point = semua file di `src/app/**` + `src/proxy.ts`.
3. Parse import via regex `(?:from\s+|import\s*\(|require\s*\(|import\s+)['"]([^'"]+)['"]`.
4. Resolve: `@/x` → `src/x`, `./x` → relatif ke file pengimpor; coba ekstens `.ts .tsx .js .jsx` lalu `index.ts`/`index.tsx`. **Normalize path** (`path.normalize`) supaya separator Windows tidak merusak pencocokan.
5. Print: jumlah file terjangkau, jumlah tak terjangkau, lalu daftar per file.

Wajib menyertakan test: `src/lib/find-unreachable.test.ts` yang menguji fungsi resolvernya pada kasus `@/x`, `./x`, dan subfolder `index.ts`.

- [ ] **Step 2: Jalankan alatnya dan cocokkan dengan daftar**

Run: `node scripts/find-unreachable.mjs`
Expected: 178 file total, 92 terjangkau, 86 tak terjangkau.

- [ ] **Step 3: Hapus file yatim — HANYA yang memenuhi DUA syarat**

(a) tidak terjangkau dari entry point, DAN (b) **tidak** disebut di File Structure plan ini maupun di daftar file task mana pun (Task 3–10).

File yang **WAJIB** dipertahankan meski tak terjangkau (dipakai task lain):
`src/components/projects/ProjectDetail.tsx` (Task 9) · `src/components/sections/ExperienceStickyScroll.tsx` (Task 8) · `src/components/sections/skills/SoftSkills.tsx` (Task 10) · `src/i18n/request.ts` + `src/i18n/settings.ts` (dipakai `next.config.ts` via `createNextIntlPlugin`) · `src/lib/verify-build.ts` + `src/lib/verify-build.test.ts` (dipakai `scripts/`) · `src/types/global.d.ts`, `src/types.d.ts` (deklarasi global).

Daftar hapus (70 file — hapus hanya yang lolos dua syarat di atas; kalau ternyata ada yang diimpor file terjangkau, **pertahankan** dan laporkan):
```
src/components/animate-ui/components/animate/code.tsx
src/components/animate-ui/components/buttons/copy.tsx
src/components/animate-ui/primitives/animate/code-block.tsx
src/components/animate-ui/primitives/animate/slot.tsx
src/components/animate-ui/primitives/buttons/button.tsx
src/components/effects/FallingText.tsx
src/components/globe-demo.tsx
src/components/sections/AboutMeHub.tsx
src/components/sections/ExperienceMarquee.tsx
src/components/sections/ExperienceTabsSection.tsx
src/components/sections/InnovativeExperienceHero.tsx
src/components/sections/SmoothScrollHero.tsx
src/components/sections/skills/SkillsClosing.tsx
src/components/ui/3d-folder.tsx
src/components/ui/AnimatedMist.tsx
src/components/ui/BlogCard.tsx
src/components/ui/CircularGallery.tsx
src/components/ui/DomeGallery.tsx
src/components/ui/FlickeringGrid.tsx
src/components/ui/FlowingMenu.tsx
src/components/ui/GalleryFolder.tsx
src/components/ui/GalleryStack.tsx
src/components/ui/Lens.tsx
src/components/ui/Marquee.tsx
src/components/ui/MonolithStack.tsx
src/components/ui/NebulaWorkbench.tsx
src/components/ui/OrbitalWorkbench.tsx
src/components/ui/Particles.tsx
src/components/ui/ScrollStack.tsx
src/components/ui/SystemPipeline.tsx
src/components/ui/TechConstellation.tsx
src/components/ui/TextScrollMarquee.tsx
src/components/ui/VoidWorkbench.tsx
src/components/ui/background-boxes.tsx
src/components/ui/card-hover-effect.tsx
src/components/ui/card.tsx
src/components/ui/davincho-hero-1.tsx
src/components/ui/demo.tsx
src/components/ui/flowing-menu.tsx
src/components/ui/globe.tsx
src/components/ui/glsl-hills.tsx
src/components/ui/hero-highlight.tsx
src/components/ui/impact-section.tsx
src/components/ui/infinite-image-field.tsx
src/components/ui/input.tsx
src/components/ui/liquid-ocean.tsx
src/components/ui/marquee-logo-scroller.tsx
src/components/ui/orbiting-circles.tsx
src/components/ui/parallax-scroll-feature-section.tsx
src/components/ui/popover.tsx
src/components/ui/scroll-area.tsx
src/components/ui/select.tsx
src/components/ui/sheet.tsx
src/components/ui/sidebar.tsx
src/components/ui/skeleton.tsx
src/components/ui/sticky-scroll-reveal.tsx
src/components/ui/svg-mask-effect.tsx
src/components/ui/team-showcase.tsx
src/components/ui/terminal.tsx
src/components/ui/testimonal-slider.tsx
src/components/ui/text-generate-effect.tsx
src/components/ui/text-reveal.tsx
src/components/ui/timeline.tsx
src/components/ui/tooltip.tsx
src/hooks/use-controlled-state.tsx
src/hooks/use-is-in-view.tsx
src/hooks/use-mobile.tsx
src/hooks/useScrollAnimation.ts
src/hooks/useTextScramble.ts
src/hooks/useTypewriter.ts
src/lib/get-strict-context.tsx
src/test-types.ts
src/types/spline.d.ts
src/types/spline-viewer.d.ts
```
`src/hooks/index.ts` dan `src/lib/i18n.ts` **tidak** dihapus di task ini — Task 5 yang memutuskan.

- [ ] **Step 4: Hapus package yang jadi tak terpakai**

Hapus dari `package.json` (hanya kalau `grep -rn "<pkg>" src/` kosong setelah penghapusan file):
`@headlessui/react`, `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-tooltip`, `matter-js`, `@types/matter-js`, `ogl`, `shiki`, `three-globe`.

**Tetap disimpan** (masih dipakai file yang hidup): `@radix-ui/react-slot` (`ui/button.tsx`), `@radix-ui/react-separator` (`sections/HeroVisual.tsx` — Task 7 rewrite), `gl-matrix` (`components/InfiniteMenu.tsx` — Task 8 rewrite), `@splinetool/react-spline` (`sections/ProjectContact.tsx` — Task 9), `@react-three/drei`, `@react-three/fiber` (Task 7).

Package-package ini akan bebas setelah Task 8–10; **sapu dependency** dilakukan di Task 10 Step 8.

Lalu jalankan `npm.cmd install` untuk memperbarui lockfile.

- [ ] **Step 5: Verifikasi**

```bash
npm.cmd run test
npm.cmd run typecheck
node scripts/find-unreachable.mjs
```
Expected: test hijau (termasuk test baru `find-unreachable.test.ts`); typecheck error **tetap 13** dan semuanya di file milik Task 6–10 (tidak boleh bertambah, tidak boleh berkurang); file tak terjangkau berkurang ke ~10 (yang ada di daftar "WAJIB dipertahankan").

- [ ] **Step 6: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "chore: prune unreachable components and remaining deps"
```

---

### Task 2c: Sapu sisa identitas fork (darurat)

> **Kenapa task ini ada:** `src/proxy.ts` (middleware Next.js 16) **redirect SEMUA pengunjung HP ke `https://arfazrllworkspace.vercel.app/`** — situs milik penulis fork. Kalau rekrut'er membuka URL portofolio dari CV-nya di HP, dia melihat situs orang lain. Selain itu masih ada logo fork, metadata "Arfazrll | AI & Software Engineer", CV PDF orang lain, dan beberapa `href="#"`. Semua harus hilang **sebelum** Task 6/7/8 menulis ulang file yang sama — supaya tidak ada yang terlewat.

**Files:**
- Delete: `src/proxy.ts`
- Delete: `public/Arfazrll_dark.svg`, `public/Arfazrll_light.svg`, `public/resume.pdf`
- Modify: `src/app/layout.tsx` (metadata + icons)
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/sections/HeroVisual.tsx`
- Modify: `src/components/sections/NavigationShortcuts.tsx`
- Modify: `src/components/ui/argent-loop-infinite-slider.tsx`
- Modify: `src/lib/portfolio.validate.test.ts` (tambah guard sumber)

**Interfaces:**
- Consumes: `portfolioData.personal.links` (Task 4)
- Produces: **nol** referensi `arfazrll` / `arfazrllworkspace` / `syahrilarfianalmazril` di seluruh `src/` dan `public/`. Guard otomatis baru: `src/lib/fork-identity.test.ts`.

- [ ] **Step 1: Hapus `src/proxy.ts`**

File itu middleware Next.js 16 yang mendeteksi user-agent mobile lalu mengarahkan ke situs penulis fork. Untuk portofolio Sutan, **HP harus menampilkan portofolio yang sama** — tidak ada alasan redirect. Hapus seluruh filenya. `proxy.ts` opsional di Next.js; tanpa itu semua request lolos normal.

Verifikasi tidak ada middleware lain yang meng-importnya.

- [ ] **Step 2: Hapus aset fork di `public/`**

```bash
git rm public/Arfazrll_dark.svg public/Arfazrll_light.svg public/resume.pdf
```
`resume.pdf` adalah CV penulis fork. `public/cv.pdf` (CV Sutan) dibuat di Task 10 Step 5.

- [ ] **Step 3: Perbaiki metadata `src/app/layout.tsx`**

- `metadata.title.default` → `Sutan Akbar — Frontend Engineer`
- `metadata.title.template` → `%s | Sutan Akbar`
- `metadata.description` → `Frontend Engineer dari Palembang. Antarmuka yang ringan, kode yang rapi, dan produk yang jalan di HP orang.`
- `metadata.authors` / `creator` → `Sutan Akbar Dwi Nugraha`
- `metadata.keywords` → `frontend engineer, react, nextjs, tailwind, palembang`
- `metadataBase` → `new URL('https://sutan-akbar.vercel.app')`
- `openGraph` + `twitter`: isi dengan nilai yang sama, `twitter.creator` = `@sutannn7`
- `icons` → `{ icon: '/favicon.svg' }` (hapus `/Arfazrll_light.svg` & `/Arfazrll_dark.svg`)
- `viewport.themeColor` → dark `#08080C`, light `#FAFAFB`

(Task 6 akan menyempurnakan metadata ini lagi — di sini tujuannya hanya membuang identitas fork.)

- [ ] **Step 4: Buang link `arfazrllworkspace` di Navbar, Footer, HeroVisual**

- `src/components/layout/Navbar.tsx:215` — `<Link href="https://arfazrllworkspace.vercel.app/">` → **hapus elemennya** (atau ganti ke `/projects` bila itu tombol CTA-nya).
- `src/components/layout/Footer.tsx:221` — `href="https://arfazrllworkspace.vercel.app/"` → **hapus**.
- `src/components/sections/HeroVisual.tsx:181` dan `:191` — `onClick={() => window.open('https://arfazrllworkspace.vercel.app/', '_blank')}` → **hapus handler-nya**, dan sekalian jangan render tombol yang jadi tanpa tujuan. Kalau tombolnya "Lihat Portofolio", arahkan ke `/projects`.

- [ ] **Step 5: Buang `href="#"` di Footer dan NavigationShortcuts**

- `src/components/layout/Footer.tsx:370-372` — `portfolioData.personal.links.find(s => s.label === 'LinkedIn')?.url || '#'`, `'Instagram'`, `'GitHub'`. `personal.links` = GitHub, LinkedIn, WhatsApp, Email — **tidak ada Instagram**. Render hanya link yang benar-benar ada; kalau tidak ada, **jangan render barisnya** (bukan `href="#"`).
- `src/components/sections/NavigationShortcuts.tsx:242` — `href={item.href || '#'}` → kalau `item.href` kosong, **jangan render** item-nya.

- [ ] **Step 6: Buang link GitHub fork dari slider**

`src/components/ui/argent-loop-infinite-slider.tsx:357` — `href="https://github.com/Arfazrll"` → arahkan ke `https://github.com/sutannn7`, atau hapus elemen link-nya kalau tidak ada tujuan yang masuk akal.

- [ ] **Step 7: Tambah guard sumber `src/lib/fork-identity.test.ts`**

Test yang memindai **seluruh** file `.ts`/`.tsx`/`.svg`/`.json`/`.md` di bawah `src/` dan `public/` (kecuali file test itu sendiri) untuk pola berikut, case-insensitive:
```
/arfazrll/
/arfazrllworkspace/
/syahrilarfianalmazril/
```
**Harus nol match.** Test ini yang mencegah identitas fork merayap balik.

Pengecualian yang sah: file test itu sendiri yang mendeklarasikan regex-nya, dan `src/lib/verify-build.test.ts` yang sengaja memakai kata "Arfazrll" sebagai contoh fixture — **kecualikan kedua file itu dari pemindaian**, dan buat daftar pengecualian itu sebagai konstanta yang jelas di dalam test.

- [ ] **Step 8: Verifikasi**

```bash
npm.cmd run test
npm.cmd run typecheck
node scripts/find-unreachable.mjs
```
Expected: test hijau (termasuk test baru); typecheck **tetap 13** error (semua TS2307 di file milik Task 6–10 — cek bahwa menghapus `proxy.ts` dan aset public **tidak** menambah/mengurangi hitungan itu); jumlah file tak terjangkau tidak bertambah.

- [ ] **Step 9: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "fix: remove fork identity - mobile redirect to foreign site, fork logos, fork CV, dead # links"
```

---

### Task 2d: Matici dead link ke route yang sudah dihapus

> **Kenapa task ini ada:** Task 2 menghapus route `/blog`, `/gallery`, `/achievements`, `/experience`. Tapi 7 file masih menautkan ke sana — sehingga klik di situsDcobaUNTUK membuka 404. Spec §2 anti-goal: "Dead link. Tidak ada tombol demo/proyek yang mengarah ke 404." Task 6/7/8 akan menulis ulang Navbar/Footer/StatsSection, tapi 4 file lain **tidak dimiliki task mana pun** — jadi harus dibersihkan sekarang.

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/sections/StatsSection.tsx`
- Modify: `src/components/sections/NavigationShortcuts.tsx`
- Modify: `src/components/ui/CardNav.tsx`
- Modify: `src/components/ui/arc-preloader-hero.tsx`
- Modify: `src/components/ui/certificate-marquee.tsx`
- Modify: `src/components/ui/testimonial-1.tsx`

**Interfaces:**
- Consumes: `portfolioData` (Task 4), `messages` (Task 5)
- Produces: **nol** referensi ke `/blog`, `/gallery`, `/achievements`, `/experience` di seluruh `src/`.

**Route yang valid (dan HANYA itu):** `/`, `/projects`, `/skills`, `/contact`, `/resume`.
`/about` **belum ada** (Task 6 yang membuatnya) dan `/lab` juga belum (Plan 5) — jadi keduanya **tidak boleh** dipakai sebagai target.

- [ ] **Step 1: `src/components/layout/Navbar.tsx`**

Dropdown "About" memuat `achievements` (`:52`), `experience` (`:54`), `blog` (`:56`) — ketiganya route yang sudah dihapus. **Hapus entri-entri itu** beserta label/deskripsinya. Sisakan entri yang route-nya masih hidup (`/skills`, `/projects`).

- [ ] **Step 2: `src/components/layout/Footer.tsx`**

- `:159` `const isBlog = pathname?.includes('/blog')` dan `:161` `const isGallery = ...` — hapus variabelnya **dan** semua tempat yang memakainya (cek dengan grep di file itu).
- `:443` `/achievements`, `:445` `/experience`, `:447` `/blog`, `:448` `/gallery` — hapus baris link tersebut dari grup footer.
- **`:370` hardcode `"Jakarta, Indonesia"`** — Sutan berdomisili di **Palembang**. Ganti dengan `t('footer.location')` (nilainya sudah `Palembang, Indonesia` di kedua file messages) atau literal `"Palembang, Indonesia"`.
- `:395` hardcode `"SUTAN AKBAR"` → ambil dari `portfolioData.personal.name`.

- [ ] **Step 3: `src/components/sections/StatsSection.tsx`**

`:105` `href="/gallery"`, `:126` dan `:229` `href="/blog"` — hapus elemen link-nya (atau arahkan ke `/projects` kalau itu tombol CTA stats; pilih yang paling masuk akal, tapi jangan pakai route yang tidak ada).

- [ ] **Step 4: `src/components/sections/NavigationShortcuts.tsx`**

`:95` dan `:96` → `/experience`; `:98` → `/achievements`; `:112` → `/blog`; `:113` → `/gallery`. **Hapus item-item ini** dari array shortcut. Item yang tersisa harus punya `href` yang valid.

- [ ] **Step 5: `src/components/ui/CardNav.tsx`**

`:229` array `allHrefs` memuat `/experience`, `/achievements`, `/blog`, `/gallery` — hapus dari array. `:294` `/experience`, `:299` `/achievements`, `:300` `/blog`, `:309` `/gallery` — hapus elemen menu tersebut.

- [ ] **Step 6: `src/components/ui/arc-preloader-hero.tsx`**

`:66` `const isBackToBlog = prevPathname.startsWith('/blog/') && pathname === '/blog'` — hapus variabel itu dan percabangan yang memakainya.

- [ ] **Step 7: `src/components/ui/certificate-marquee.tsx` dan `src/components/ui/testimonial-1.tsx`**

`certificate-marquee.tsx:153` `<ScrambleButton href="/achievements" />` — hapus (atau arahkan ke `/about` **hanya kalau** file `src/app/about/page.tsx` sudah ada; kalau belum, hapus).
`testimonial-1.tsx:58` `href: "/experience"` — hapus entri testimonial itu atau arahkan ke route yang valid.

- [ ] **Step 8: Hapus message key yang jadi yatim**

Setelah penghapusan di atas, beberapa kunci `t('achievements')`, `t('experience')`, `t('blog')`, `t('gallery')`, `t('achievementsDesc')`, `t('experienceDesc')`, `t('blogDesc')`, `t('galleryDesc')`, `t('menu.experience')` mungkin tidak lagi dipakai. Grep `src/` untuk tiap kunci itu; yang tidak terpakai **hapus dari `messages/id.json` DAN `messages/en.json`** (dua file harus tetap punya key set identik).

- [ ] **Step 9: Verifikasi**

```bash
npm.cmd run test
npm.cmd run typecheck
```
Lalu grep untuk memastikan nol sisa:
```bash
grep -rn "/blog\|/gallery\|/achievements\|/experience" src/
```
Expected: tidak ada **link** ke route itu. String yang tersisa hanya boleh di `messages/*.json` kalau masih dipakai, atau di dalam `src/lib/*.test.ts` sebagai fixture.

`npm.cmd run typecheck` harus tetap **13** error. `npm.cmd run test` harus hijau.

- [ ] **Step 10: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "fix: remove links to deleted routes - blog, gallery, achievements, experience"
```

---

### Task 3: Token desain, tema, dan konfigurasi Next

**Files:**
- Modify: `src/styles/globals.css` (blok `:root` dan `.dark`)
- Modify: `tailwind.config.ts` (warna `glow` → ganti; `bento` hapus)
- Modify: `next.config.ts` (hapus `remotePatterns` unsplash & aceternity)
- Create: `src/styles/tokens.test.ts`

**Interfaces:**
- Consumes: —
- Produces: custom property CSS `--background`, `--foreground`, `--card`, `--card-foreground`, `--primary`, `--primary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--border`, `--ring`, `--popover`, `--popover-foreground`, `--destructive`, `--destructive-foreground`, `--input`, `--chart-1..5`. Tailwind utility yang tersedia: `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-primary`, `text-primary-foreground`, `bg-muted`, `text-muted-foreground`, `bg-accent`, `text-accent-foreground`, `border-border`, `ring-ring`.

- [ ] **Step 1: Tulis test token yang gagal**

Buat `src/styles/tokens.test.ts`:
```ts
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
```
Run: `npm.cmd run test`
Expected: FAIL — nilai token lama (hitam/putih) tidak cocok.

- [ ] **Step 2: Terapkan nilai token baru di `src/styles/globals.css`**

Ganti seluruh nilai di blok `:root` (light) dan `.dark` (dark) dengan nilai di langkah 1. Pertahankan nama token yang ada; hanya nilainya yang diganti. `--radius` tetap `0.5rem`. Tambahkan `--chart-1: 74 100% 63%`, `--chart-2: 190 100% 60%`, `--chart-3: 258 90% 66%`, `--chart-4: 43 96% 56%`, `--chart-5: 240 8% 62%` di kedua blok.

- [ ] **Step 3: Rapikan `tailwind.config.ts`**

Ganti blok `colors.glow` (cyan/purple/pink) dengan:
```ts
glow: {
  lime: '#C8F246',
  cyan: '#33D6FF',
  violet: '#8B5CF6',
  amber: '#FBBF24',
}
```
Hapus seluruh blok `colors.bento`. Biarkan `fontFamily` (Inter + JetBrains Mono) dan `animation`/`keyframes` apa adanya.

- [ ] **Step 4: Bersihkan `next.config.ts`**

Hapus `remotePatterns` untuk `images.unsplash.com` dan `assets.aceternity.com`. Sisanya (`reactStrictMode`, `transpilePackages: ['three']`, `formats`) tetap.

- [ ] **Step 5: Jalankan test**

Run: `npm.cmd run test`
Expected: PASS, 2 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: design tokens - dark lime palette, chart colors, local assets only"
```

---

### Task 4: Model data + seluruh konten portofolio

**Files:**
- Modify: `src/types/index.ts` (ganti total)
- Modify: `src/data/portfolio.ts` (ganti total — 186KB → ~12KB)
- Create: `src/lib/portfolio.validate.test.ts`

**Interfaces:**
- Consumes: —
- Produces: `portfolioData: PortfolioData` yang di-ekspor dari `src/data/portfolio.ts`, dengan bentuk:

```ts
export type Localised = { id: string; en: string };
export type SkillBadge = 'dasar' | 'nanodua' | 'mahir';

export interface PortfolioData {
  personal: {
    name: string;
    title: Localised;
    subtitle: Localised;
    bio: Localised;
    avatar: string;
    location: string;
    email: string;
    phone: string;
    resumeUrl: string;
    links: { label: string; url: string; icon: string }[];
    languages: { name: string; level: string }[];
  };
  projects: Project[];
  lab: LabProject[];
  skills: { group: string; items: { name: string; badge: SkillBadge }[] }[];
  softSkills: string[];
  milestones: Milestone[];
  journey: JourneyEntry[];
}
export interface Project {
  id: string; slug: string; title: Localised; category: string;
  description: Localised; longDescription: Localised; highlights: Localised[];
  techStack: string[]; role: string; team?: string; year: string;
  repoUrl?: string; demoUrl?: string; image?: string;
}
export interface LabProject {
  slug: string; title: Localised; tagline: Localised;
  problem: Localised; decision: Localised; techStack: string[];
  repoUrl: string; demoUrl: string; year: string; image: string;
}
export interface Milestone { year: string; title: Localised; description: Localised; href?: string }
export interface JourneyEntry { year: string; title: Localised; org: Localised; points: Localised[] }
```

- [ ] **Step 1: Tulis test validasi yang gagal**

Buat `src/lib/portfolio.validate.test.ts`:
```ts
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
  it('semua Localised punya id dan en yang terisi', () => {
    const localised = allStrings(portfolioData).filter((s) => s.length === 0);
    expect(localised).toHaveLength(0);
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
```
Run: `npm.cmd run test`
Expected: FAIL — data lama (Arfazrll, 19 proyek AI/ML).

- [ ] **Step 2: Tulis ulang `src/types/index.ts`**

Ganti seluruh isi dengan bentuk di blok Interfaces. Hapus `Experience`, `Education`, `Achievement`, `TechStack`, `Tool`, `FAQ`, `BlogPost`, `GalleryItem` — tidak dipakai di plan ini.

- [ ] **Step 3: Tulis ulang `src/data/portfolio.ts`**

Isi dengan konten persis dari spec §6.3. Wajib memuat:
- `personal.name` = `Sutan Akbar Dwi Nugraha`; `title` = `{ id: 'Frontend Engineer', en: 'Frontend Engineer' }`; `location` = `Palembang, Indonesia`; `email` = `Akbarcool998@gmail.com`; `phone` = `0857-5829-2876`; `avatar` = `/avatar.svg`; `resumeUrl` = `/cv.pdf`; `links` = GitHub `https://github.com/sutannn7`, LinkedIn `https://linkedin.com/in/sutan-akbar-dwi-nugraha-193010442`, WhatsApp `https://wa.me/6285758292876`, Email `mailto:Akbarcool998@gmail.com`; `languages` = Indonesia (Aktif), Inggris (Pasif).
- `projects` — 4 proyek sesuai spec §6.3, urutannya LearnEase, Website Jurusan, Nusantara Kopi, Portofolio v3. `category` untuk Website Jurusan = `Web` (bukan `Full-stack`). `demoUrl` Website Jurusan **tidak ada**. `demoUrl` Portofolio v3 = `https://sutan-akbar.vercel.app`. `image` tiap proyek = path lokal di `public/projects/`.
- `longDescription` LearnEase memuat urutan: audit 8 halaman → design token → dark mode → 7 halaman prototipe → test runner → verifikasi headless Chrome → usulan ke moyar.
- `skills` — 5 grup dari spec §6.3 dengan badge: `dasar` untuk TypeScript, Oracle, C++, Java, Python; `nanodua` untuk yang lain; `mahir` untuk HTML, CSS, JavaScript, PHP, MySQL, Git, Bootstrap, Tailwind CSS, React, Next.js, Vite, GitHub, VS Code, Node.js, XAMPP, phpMyAdmin, Android Studio, UML, ERD, DFD.
- `softSkills` — 6 butir dari spec §6.3.
- `milestones` — 5 butir dari spec §6.3.
- `journey` — 6 entri dari spec §6.3.
- `lab` — array kosong `[]` (isiannya datang di Plan 5).

- [ ] **Step 4: Jalankan test**

Run: `npm.cmd run test`
Expected: PASS semua test `portfolio.validate`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: portfolio data model and content - Frontend Engineer positioning"
```

---

### Task 5: i18n — default ID dan penulisan ulang messages

**Files:**
- Modify: `src/i18n/settings.ts`
- Modify: `src/i18n/request.ts`
- Delete: `src/lib/i18n.ts` (hanya kalau `grep -rn "lib/i18n" src/` kosong)
- Modify: `messages/id.json`, `messages/en.json`
- Create: `src/lib/locale.ts`, `src/lib/locale.test.ts`, `src/i18n/messages.test.ts`

**Interfaces:**
- Consumes: —
- Produces: `resolveLocale(cookieValue: string | undefined): Locale` dari `src/lib/locale.ts`, dengan `Locale = 'id' | 'en'`. `defaultLocale` dari `src/i18n/settings.ts` = `'id'`.

- [ ] **Step 1: Tulis test locale yang gagal**

Buat `src/lib/locale.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { resolveLocale } from '@/lib/locale';

describe('resolveLocale', () => {
  it('default ke id saat tidak ada cookie', () => {
    expect(resolveLocale(undefined)).toBe('id');
  });
  it('menghormati cookie yang valid', () => {
    expect(resolveLocale('en')).toBe('en');
    expect(resolveLocale('id')).toBe('id');
  });
  it('menolak cookie yang tidak dikenal', () => {
    expect(resolveLocale('fr')).toBe('id');
    expect(resolveLocale('')).toBe('id');
  });
});
```
Run: `npm.cmd run test`
Expected: FAIL — modul `@/lib/locale` belum ada.

- [ ] **Step 2: Implementasikan `src/lib/locale.ts`**

```ts
export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';

export function resolveLocale(cookieValue: string | undefined): Locale {
  return cookieValue && (locales as readonly string[]).includes(cookieValue)
    ? (cookieValue as Locale)
    : defaultLocale;
}
```

- [ ] **Step 3: Arahkan `src/i18n/settings.ts` dan `src/i18n/request.ts` ke `src/lib/locale.ts`**

`src/i18n/settings.ts` jadi:
```ts
export { locales, defaultLocale, type Locale } from '@/lib/locale';
```
`src/i18n/request.ts`: hapus blok `accept-language` sepenuhnya; pakai `resolveLocale(cookieStore.get('locale')?.value)`. Hapus import `headers`.

- [ ] **Step 4: Hapus `src/lib/i18n.ts` kalau tidak terpakai**

```bash
grep -rn "lib/i18n" src/
```
Kalau kosong: `git rm src/lib/i18n.ts`. Kalau tidak kosong: catat pemakai di commit body — jangan dipaksa terhapus di task ini.

- [ ] **Step 5: Tulis test keys messages**

Buat `src/i18n/messages.test.ts`:
```ts
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
```

- [ ] **Step 6: Tulis ulang `messages/id.json` dan `messages/en.json`**

Namespace yang tersisa (18 - 3 = 15): `navigation`, `hero`, `about`, `projects`, `experience`, `expertise`, `skills`, `contact`, `stats`, `projectHeader`, `footer`, `ctaSection`, `common`, `technical`, plus `milestones` dan `lab` yang baru.

Isi `id.json` dalam bahasa Indonesia; `en.json` padanan Inggris. Wajib ada key baru: `navigation.lab`, `navigation.about`, `navigation.projects`, `navigation.skills`, `navigation.contact`, `hero.eyebrow`, `hero.titleLine1` = `FRONT`, `hero.titleLine2` = `END`, `hero.titleLine3` = `ENGINEER`, `hero.subtitle`, `hero.scrollHint`, `about.milestones`, `about.journey`, `contact.whatsapp`, `contact.email`, `contact.linkedin`, `contact.github`, `footer.credit`, `footer.location`.

Hapus key yang hanya dipakai blog/gallery/chatbot.

- [ ] **Step 7: Jalankan test**

Run: `npm.cmd run test`
Expected: PASS — test locale, test messages, test token, test portfolio.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: i18n - default locale id, drop accept-language detection, rewrite messages"
```

---

### Task 6: Layout, navigasi, dan footer

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Create: `src/data/navigation.ts`, `src/data/navigation.test.ts`

**Interfaces:**
- Consumes: `portfolioData` (Task 4), `messages` (Task 5)
- Produces: `NAV_ITEMS: { href: string; labelKey: string }[]` dari `src/data/navigation.ts` — 5 entri, `href` adalah path internal (`/`, `/projects`, `/skills`, `/about`, `/contact`). Route `/lab` ditambahkan di Plan 5, bukan di plan ini.

- [ ] **Step 1: Tulis test navigasi yang gagal**

Buat `src/data/navigation.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { NAV_ITEMS } from '@/data/navigation';

const APP_DIR = path.resolve(__dirname, '..', 'app');

describe('NAV_ITEMS', () => {
  it('setiap href internal punya route yang ada', () => {
    for (const item of NAV_ITEMS) {
      if (!item.href.startsWith('/')) continue;
      if (item.href === '/') continue;
      const routeDir = path.join(APP_DIR, item.href.replace(/^\//, ''));
      const routeFile = path.join(APP_DIR, `${item.href.replace(/^\//, '')}.tsx`);
      expect(existsSync(routeDir) || existsSync(routeFile), item.href).toBe(true);
    }
  });
  it('tidak ada href ke route yang dibuang', () => {
    for (const item of NAV_ITEMS) {
      expect(['/blog', '/gallery', '/achievements']).not.toContain(item.href);
    }
  });
  it('tidak ada label hardcoded orang lain', () => {
    for (const item of NAV_ITEMS) {
      expect(item.labelKey).toMatch(/^[a-zA-Z.]+$/);
    }
  });
});
```
Run: `npm.cmd run test`
Expected: FAIL — `src/data/navigation.ts` belum ada.

- [ ] **Step 2: Buat `src/data/navigation.ts`**

```ts
export const NAV_ITEMS = [
  { href: '/', labelKey: 'navigation.home' },
  { href: '/projects', labelKey: 'navigation.projects' },
  { href: '/skills', labelKey: 'navigation.skills' },
  { href: '/about', labelKey: 'navigation.about' },
  { href: '/contact', labelKey: 'navigation.contact' },
] as const;
```
Catatan: `/lab` **tidak** ada di plan ini — rutenya belum ada dan akan dibuat di Plan 5. Jangan buat placeholder `/lab` sekarang: halaman kosong = sinyal "situsnya belum jadi". `NAV_ITEMS` berisi 5 entri tanpa `/lab`.

- [ ] **Step 3: Buat `src/app/about/page.tsx` (versi minimal, biar nav tidak punya link mati)**

Halaman yang langsung merender `portfolioData.personal.bio` + `personal.links` + lokasi. Konten nyata, bukan placeholder. Task 10 Step 2 meng-*enrich* halaman ini dengan pendidikan, milestones, dan journey.

- [ ] **Step 4: Rewrite `src/app/layout.tsx`**

- Font: hanya `Inter` + `JetBrains_Mono`. Hapus `Playfair_Display` dan `Alex_Brush`.
- `metadata`: `title.default` = `Sutan Akbar — Frontend Engineer`, `title.template` = `%s | Sutan Akbar`, `description` = `Frontend Engineer dari Palembang. Antarmuka yang ringan, kode yang rapi, dan produk yang jalan di HP orang.`, `keywords` = `frontend engineer, react, nextjs, tailwind, palembang`, `authors`/`creator` = `Sutan Akbar Dwi Nugraha`, `metadataBase` = `new URL('https://sutan-akbar.vercel.app')`, `openGraph` dan `twitter` diisi dengan nilai yang sama.
- `icons`: `icon: '/favicon.svg'`.
- `viewport.themeColor`: dark = `#08080C`, light = `#FAFAFB`.
- Hapus `<ChatBot headless />` (sudah dihapus di Task 2) dan `ThemeAwareClickSpark` kalau bermasalah — biarkan dulu, nanti Task 7 yang mengatur.
- `ThemeProvider`: set `defaultTheme="dark"` dan `enableSystem={false}`.

- [ ] **Step 5: Rewrite `Navbar.tsx`**

- Sumber link dari `NAV_ITEMS` + `useTranslations()` untuk label.
- **`:83` membaca `document.cookie` langsung** — itu menduplikasi sumber locale. Gunakan sumber tunggal (`src/lib/locale.ts` / provider i18n), jangan baca cookie manual.
- Hapus dropdown "About" yang berisi achievements/skills/experience/projects/blog.
- Hapus link `https://arfazrllworkspace.vercel.app/`.
- Tombol kanan: "Mari terhubung" → `/contact`.
- Tambah toggle bahasa ID/EN yang menulis cookie `locale` (nilai `id` / `en`) dan me-refresh. Ganti label toggle dengan `navigation.languageId` / `navigation.languageEn`.

- [ ] **Step 6: Rewrite `Footer.tsx`**

- Hapus blok `isBlog` / `isBlogDetail` / `isGallery`.
- Hapus link Instagram, Twitter, Discord, Spotify — hanya GitHub, LinkedIn, Email, WhatsApp yang diizinkan.
- Ganti `https://www.google.com/maps/place/Jakarta,+Indonesia` dengan `https://www.google.com/maps/place/Palembang,+Indonesia`.
- Tambah link kecil ke `https://github.com/Arfazrll/PersonalBlog` dengan teks `t('footer.credit')` = `Built on MIT-licensed open source`.
- Hapus semua fetch ke `/api/`.

- [ ] **Step 7: Jalankan test dan typecheck**

Run: `npm.cmd run test && npm.cmd run typecheck`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: layout, navbar and footer - Sutan branding, id/en toggle, MIT credit"
```

---

### Task 7: Hero — split headline, 3D name plate, background grid

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/sections/HeroVisual.tsx` (rewrite total)
- Create: `src/components/three/NamePlate.tsx`
- Create: `src/components/sections/HeroGrid.tsx`
- Create: `src/hooks/usePrefersReducedMotion.ts`
- Create: `src/lib/performance.ts`, `src/lib/performance.test.ts`

**Interfaces:**
- Consumes: `portfolioData.personal` (Task 4), `useTranslations` (Task 5), `usePerformance` (existing, `src/hooks/usePerformance.ts` — mengembalikan `{ isMobile, isTablet, isLowPowerMode }`)
- Produces:
  - `shouldRenderHeavyVisuals(opts: { isLowPowerMode: boolean; prefersReducedMotion: boolean }): boolean` dari `src/lib/performance.ts`
  - `<NamePlate name={string} role={string} />` — client component, meng-render slab R3F + overlay HTML nama.

- [ ] **Step 1: Tulis test performance yang gagal**

Buat `src/lib/performance.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { shouldRenderHeavyVisuals } from '@/lib/performance';

describe('shouldRenderHeavyVisuals', () => {
  it('menyalakan visual berat di perangkat kuat tanpa prefers-reduced-motion', () => {
    expect(shouldRenderHeavyVisuals({ isLowPowerMode: false, prefersReducedMotion: false })).toBe(true);
  });
  it('mematikan visual berat di low power', () => {
    expect(shouldRenderHeavyVisuals({ isLowPowerMode: true, prefersReducedMotion: false })).toBe(false);
  });
  it('mematikan visual berat saat prefers-reduced-motion', () => {
    expect(shouldRenderHeavyVisuals({ isLowPowerMode: false, prefersReducedMotion: true })).toBe(false);
  });
});
```
Run: `npm.cmd run test`
Expected: FAIL — modul belum ada.

- [ ] **Step 2: Implementasikan `src/lib/performance.ts`**

```ts
export function shouldRenderHeavyVisuals(opts: {
  isLowPowerMode: boolean;
  prefersReducedMotion: boolean;
}): boolean {
  return !opts.isLowPowerMode && !opts.prefersReducedMotion;
}
```

- [ ] **Step 3: Buat `src/components/three/NamePlate.tsx`**

Client component. Isi:
- `Canvas` dari `@react-three/fiber` dengan `dpr={[1, 1.5]}`, `camera={{ position: [0, 0, 5], fov: 45 }}`.
- Satu mesh: rounded box (geometry dari drei `RoundedBox` args `[3.2, 1.8, 0.12]`, radius 0.12, smoothness 4) dengan `meshPhysicalMaterial` — `transmission={0.9}`, `thickness={0.4}`, `roughness={0.15}`, `ior={1.3}`, `color="#C8F246"`, `transparent`, `opacity={0.35}`.
- Rotasi mengikuti kursor: `useFrame` membaca `state.pointer`, set `rotation.y = pointer.x * 0.35`, `rotation.x = -pointer.y * 0.2`, dengan `MathUtils.damp` supaya halus (bukan `lerp`/`damp` GSAP).
- Float pelan: `position.y = Math.sin(clock.elapsedTime * 0.6) * 0.08`.
- `drei` `Environment preset="city"` **tidak boleh** dipakai (menarik asset dari CDN). Gunakan `<ambientLight intensity={0.6} />` + `<directionalLight position={[2, 3, 4]} intensity={1.2} />` saja.
- Overlay HTML nama: `position: absolute`, teks `name` (font Inter, weight 500, `text-foreground`) dan `role` (mono, `text-muted-foreground`), diposisikan di tengah canvas dengan `pointer-events-none`.
- Komponen menerima prop `name` dan `role`; tidak membaca `portfolioData` sendiri.

- [ ] **Step 4: Buat `src/components/sections/HeroGrid.tsx`**

Server component (tanpa `'use client'`). Render `<div>` dengan:
- Background grid: `backgroundImage` dua `linear-gradient` 1px garis `rgba(255,255,255,0.05)` dengan `backgroundSize: 48px 48px`, di-mask dengan radial gradient supaya memudar ke tepi.
- Grain: SVG `feTurbulence` inline sebagai `background-image: url("data:image/svg+xml,...")` dengan `opacity: 0.04`, `mix-blend-mode: overlay`.
- Layer gradien radial lime tipis di pojok kiri bawah (`radial-gradient(600px circle at 20% 80%, rgba(200,242,70,0.10), transparent)`).
- `aria-hidden="true"`, `pointer-events-none`, `absolute inset-0 -z-10`.

- [ ] **Step 5: Rewrite `src/components/sections/HeroVisual.tsx`**

Struktur (urutan):
1. Eyebrow: `t('hero.eyebrow')` → `PALEMBANG · FRONTEND ENGINEER`, mono uppercase `text-[0.72rem] tracking-[0.22em] text-muted-foreground`.
2. Headline tiga baris: `t('hero.titleLine1')` = `FRONT`, `t('hero.titleLine2')` = `END`, `t('hero.titleLine3')` = `ENGINEER`. Font Inter, weight 500, `text-[clamp(3rem,11vw,10rem)]`, `leading-[0.88]`, `tracking-[-0.045em]`. Baris 1 dan 2 rata kiri; baris 3 rata kanan (`text-right`) supaya tidak monoton.
3. Subhead: `t('hero.subtitle')`, `max-w-[68ch] text-muted-foreground`.
4. Scroll hint: `t('hero.scrollHint')`, dengan ikon panah yang beranimasi halus (`animate-bounce` dimatikan saat `prefers-reduced-motion`).
5. Reveal per baris: pakai Framer Motion `motion.div` dengan `initial={{ opacity: 0, y: 24 }}` `animate={{ opacity: 1, y: 0 }}` `transition={{ duration: 0.6, delay: 0.1 * index }}`. Kalau `prefers-reduced-motion` terdeteksi, set `initial={false}`.
6. Komponen ini **tidak** merender Canvas; Canvas ada di `page.tsx` agar bisa dibungkus gate.

- [ ] **Step 6: Susun hero di `src/app/page.tsx`**

`src/app/page.tsx` meng-import `useTranslations` tapi tidak memakainya — hapus import yang tidak terpakai saat menulis ulang file ini.

```tsx
'use client';
// ...imports
const { isLowPowerMode } = usePerformance();
const prefersReducedMotion = usePrefersReducedMotion(); // hook lokal: matchMedia('(prefers-reduced-motion: reduce)'), default false
const heavy = shouldRenderHeavyVisuals({ isLowPowerMode, prefersReducedMotion });
```
Struktur JSX:
```tsx
<HeroGrid />
{heavy && (
  <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-70">
    <NamePlate name={portfolioData.personal.name} role={portfolioData.personal.title.id} />
  </div>
)}
<div className="relative z-10">
  <HeroVisual />
</div>
```
`usePrefersReducedMotion` ditulis sebagai hook kecil **di dalam file `src/app/page.tsx`** (atau `src/hooks/usePrefersReducedMotion.ts` — buat file terpisah supaya bisa dipakai Task 8 juga). Pilih: file terpisah `src/hooks/usePrefersReducedMotion.ts`.

Hook:
```ts
'use client';
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
```

- [ ] **Step 7: Jalankan test dan build**

Run: `npm.cmd run test && npm.cmd run build`
Expected: PASS, build sukses. Halaman `/` harus berisi teks `FRONT`, `END`, `ENGINEER` di HTML hasil prerender.

- [ ] **Step 8: Verifikasi visual manual**

Jalankan `npm.cmd run dev`, buka `http://localhost:3000` di browser. Cek: headline terbaca jelas di atas name plate, tidak ada teks terpotong, dan hero tetap terbaca ketika Canvas dimatikan (devtools: set device ke mobile atau nonaktifkan WebGL).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: hero - split headline, 3D name plate, grid background, reduced-motion gates"
```

---

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

### Task 9: Rute `/projects`

**Files:**
- Modify: `src/app/projects/page.tsx` (rewrite total — 68KB)
- Modify: `src/app/projects/[slug]/page.tsx`
- Modify: `src/components/projects/ProjectDetail.tsx`
- Modify: `src/components/projects/ProjectPageContent.tsx`
- Modify: `src/components/projects/TechStack.tsx`

**Interfaces:**
- Consumes: `portfolioData.projects` (Task 4), `NAV_ITEMS` (Task 6)
- Produces: `PROJECT_FILTERS: string[]` — daftar unik `techStack` semua proyek, diurutkan alfabetis. Diekspor dari `src/app/projects/page.tsx` atau file baru `src/data/projectFilters.ts` (pilih file baru supaya bisa dites).

- [ ] **Step 1: Buat `src/data/projectFilters.ts` dan test-nya**

```ts
// src/data/projectFilters.ts
import { portfolioData } from '@/data/portfolio';
export const PROJECT_FILTERS: string[] = [
  ...new Set(portfolioData.projects.flatMap((p) => p.techStack)),
].sort();
```
Buat `src/data/projectFilters.test.ts`:
```ts
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
```

- [ ] **Step 2: Rewrite `src/app/projects/page.tsx`**

- Grid kartu: gambar, kategori, judul (`title.id`), deskripsi pendek (`description.id`), chip `techStack`, link repo (kalau ada), link demo (kalau ada), dan **tombol demo hanya tampil kalau `demoUrl` ada**.
- Filter: chip-bar berisi `Semua` + `PROJECT_FILTERS`. Filter berdasarkan `techStack`, bukan `category`. State di `useState`, bukan URL.
- Sort: urutan `portfolioData.projects` (sudah terurut paling kuat dulu). Jangan acak.
- Hapus semua import `getProjectImages`, `LogoTimeline`, `Meteors`, `ProjectStats` yang tidak dipakai.

- [ ] **Step 3: Rewrite `src/app/projects/[slug]/page.tsx`**

- `generateStaticParams()` mengembalikan slug semua proyek.
- Cari proyek by slug; kalau tidak ketemu, `notFound()`.
- Render `ProjectPageContent` dengan data proyek: `longDescription`, `highlights`, `techStack`, `role`, `team`, `year`, link repo & demo, dan image.

- [ ] **Step 4: Adaptasi `ProjectDetail.tsx`, `ProjectPageContent.tsx`, `TechStack.tsx`**

- Hapus `getProjectImages` (server action sudah dihapus di Task 2) — pakai field `image` eksplisit dari data.
- Hapus `getPlaceholderImageUrl` **dan** `ProjectPlaceholder` sepenuhnya — placeholder image dilarang (§2 anti-goal "halaman kosong"). Kartu tanpa `image` merender tanpa `<img>`, bukan dengan gambar generik.
- Hapus `galleryImages` (tidak ada di model baru).
- Pastikan `demoUrl` yang undefined **tidak** menghasilkan `<a href="#">`.

- [ ] **Step 5: Jalankan test dan build**

Run: `npm.cmd run test && npm.cmd run build`
Expected: PASS, build sukses, dan 4 halaman detail ter-prerender.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: projects page - tech filter, 4 projects, no dead demo buttons"
```

---

### Task 10: Rute `/skills`, `/about`, `/contact`, `/resume`

**Files:**
- Modify: `src/app/skills/page.tsx`
- Create: `src/app/about/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/resume/page.tsx`
- Modify: `src/components/sections/skills/HardSkills.tsx`
- Modify: `src/components/sections/skills/SoftSkills.tsx`
- Modify: `src/components/sections/skills/ToolsSection.tsx`

**Interfaces:**
- Consumes: `portfolioData` (Task 4), `messages` (Task 5)
- Produces: empat route yang reachable dari `NAV_ITEMS`.

- [ ] **Step 1: Rewrite `/skills`**

- Lima grup skill dari `portfolioData.skills`, tiap item menampilkan badge `dasar`/`nanodua`/`mahir` (peta ke label dari `messages`).
- **Tanpa radar chart** — `SkillRadar.tsx` sudah dihapus di Task 2, jangan di-import.
- `SoftSkills.tsx` → daftar bullet `portfolioData.softSkills`, tanpa level.
- `ToolsSection.tsx` → dari grup `Tools` di `portfolioData.skills`.

- [ ] **Step 2: Enrich `/about`**

Task 6 sudah membuat halaman ini. Sekarang lengkapi: pendidikan (POLSRI D-IV Manajemen Informatika, IPK 3,55/4,00, 2024–sekarang; SMA Negeri 10 Palembang, 2021–2024), `Milestones`, dan `portfolioData.journey` sebagai timeline lengkap.

- [ ] **Step 3: Rewrite `/contact`**

- **Tanpa form.** Tiga blok kontak besar: WhatsApp (`https://wa.me/6285758292876`), Email (`mailto:Akbarcool998@gmail.com`), LinkedIn.
- Tambah GitHub sebagai link kedua di blok GitHub.
- Hapus semua `useState` form, `nodemailer`, `fetch('/api/contact')`, dan validasi form.
- Copy penutup: "Biasanya membalas dalam 1–2 hari kerja." (ID) / "Usually replies within 1–2 working days." (EN).

- [ ] **Step 4: Sederhanakan `/resume`**

- `src/app/resume/page.tsx:56` masih mereferensikan `/resume.pdf` — file itu **sudah dihapus** di Task 2c (itu CV penulis fork). Arahkan ke `/cv.pdf`.
- `src/app/resume/page.tsx` meng-import `useTranslations` tapi tidak memakainya — hapus import yang tidak terpakai.
- Tombol unduh `public/cv.pdf` (atribut `download`).
- Embed ringan: `<object data="/cv.pdf" type="application/pdf" class="w-full h-[80vh]">` dengan fallback link unduh. **Bukan** `pdf-viewer.tsx` / react-pdf (sudah dihapus di Task 2).
- Tombol "Salin email" (clipboard API) sebagai alternatif.

- [ ] **Step 5: Tambahkan `public/cv.pdf`**

Buat PDF dari `C:\Users\lenovo\Downloads\CV_Sutan_Akbar_Dwi_Nugraha_Update_LearnEase.docx` memakai Word COM automation (Word 16.0 terpasang di mesin ini):

```powershell
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("C:\Users\lenovo\Downloads\CV_Sutan_Akbar_Dwi_Nugraha_Update_LearnEase.docx")
$doc.SaveAs([ref]"C:\Users\lenovo\portofolio-v3\public\cv.pdf", [ref]17)
$doc.Close()
$word.Quit()
```
`17` = format PDF. Kalau gagal, jangan diam-diam lanjut — laporkan, karena `cv.pdf` adalah aset yang wajib ada di `/resume`.

- [ ] **Step 6: Jalankan test dan build**

Run: `npm.cmd run test && npm.cmd run build`
Expected: PASS, build sukses, 4 route baru ter-prerender.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: skills, about, contact and resume routes"
```

---

### Task 11: Audit konten, deploy, dan penarikan CV

**Files:**
- Modify: `README.md`
- Modify: `scripts/verify-build.mjs`
- Modify (repo lain): `C:\Users\lenovo\Documents\Proyek Bawaan\update_cv.py` → buat `update_cv_v3.py`
- Create (repo lain): `C:\Users\lenovo\Downloads\CV_Sutan_Akbar_Dwi_Nugraha_v3.docx`

**Interfaces:**
- Consumes: seluruh Task 1–10
- Produces: situs live di `https://sutan-akbar.vercel.app`, `public/cv.pdf` yang cocok dengan CV yang diajukan, dan CV baru yang menyebut URL baru.

- [ ] **Step 1: Jalankan build + audit string terlarang**

```bash
npm.cmd run build
npm.cmd run verify -- --forbidden=Arfazrll --forbidden=Syahril --forbidden=Alfazrll --forbidden=alfazrllworkspace --forbidden=kaggle --forbidden=wakatime --forbidden=AI%20Engineer
```
Expected: exit 0. Kalau ada yang kena, perbaiki file sumbernya (bukan output build) lalu ulangi.

- [ ] **Step 2: Cek link eksternal yang mati**

Ekstrak semua URL `https://` dari `src/data/portfolio.ts` dan `messages/*.json`, lalu `curl -s -o /dev/null -w "%{http_code}"` untuk masing-masing. Expected: `200` atau `301`/`302` (redirect); `404` berarti link mati → ganti atau hapus dari data.

- [ ] **Step 3: Cek subtree route**

```bash
npm.cmd run dev
```
Buka manual: `/`, `/projects`, `/projects/learnease-lms-redesign`, `/skills`, `/about`, `/contact`, `/resume`, plus `/blog`, `/gallery`, `/achievements` (harus 404). Cek juga `/projects/<slug-tidak-ada>` → 404.

- [ ] **Step 4: Tulis ulang `README.md`**

Isi: nama, tagline, stack, cara menjalankan lokal, link ke live site, **kredit wajib**:
```
## Credit
Built on [Arfazrll's PersonalBlog](https://github.com/Arfazrll/PersonalBlog) (MIT License).
Original copyright © 2026 S. A. Almazril — see [LICENSE](./LICENSE).
```
Plus catatan "Forked and re-skinned; all content is original to Sutan Akbar Dwi Nugraha."

- [ ] **Step 5: Push ke GitHub**

Repo `sutannn7/sutan-akbar-portfolio` **sudah dibuat Sutan** (21/10/2026, publik, masih kosong) dan remote `origin` sudah mengarah ke sana. **Jangan** jalankan `gh repo create` — itu akan gagal dengan "repository already exists". Cukup:

```bash
git push -u origin feature/v3-reskin
```

Lalu rename branch itu jadi `main` supaya jadi default branch repo:
```bash
git branch -M main
git push -u origin main
```
Atau, kalau kamu ingin branch `main` tetap berisi history upstream (fork), cukup push `main` juga:
```bash
git push -u origin main
```

> Catatan: branch kerja kita bernama `feature/v3-reskin`. Kalau kamu push itu sebagai default, repo GitHub akan menampilkan branch itu sebagai "main"-nya — itu tidak ideal untuk portofolio publik. Pilih salah satu:
> **Opsi A (disarankan)** — rename `feature/v3-reskin` → `main`, lalu push `main`. Branch `main` upstream tetap ada di repo lokal dan bisa di-push juga sebagai `upstream-main` kalau mau.
> **Opsi B** — push `feature/v3-reskin` dan rename default branch di GitHub ke `main` setelahnya.

- [ ] **Step 6: Hubungkan ke project Vercel yang sudah ada (manual oleh Sutan)**

> Project Vercel `sutan-akbar` **sudah dibuat Sutan** (21/10/2026) dengan domain `sutan-akbar.vercel.app`, tapi belum ada deployment (masih 404). Jadi **jangan** bikin project baru — namanya sudah dipakai dan itu akan gagal. Cukup hubungkan repo yang sudah ada.

1. Buka dashboard Vercel → project **`sutan-akbar`** → **Settings → Git** → **Connect Git Repository** → pilih `sutannn7/sutan-akbar-portfolio`, branch `main`.
2. **Settings → Environment Variables** → tambah `NEXT_PUBLIC_GITHUB_USERNAME` = `sutannn7`. **Jangan** tambah token atau API key apa pun.
3. **Deployments → Redeploy** (atau push baru ke `main` untuk memicu deploy otomatis).
4. Tunggu preview hijau, lalu cek `https://sutan-akbar.vercel.app` (bukan URL preview).

- [ ] **Step 7: Patch CV**

Buat `C:\Users\lenovo\Documents\Proyek Bawaan\update_cv_v3.py` mengikuti pola `update_cv.py` yang sudah ada (clone paragraf, ganti teks, pertahankan hyperlink & format). Perubahan wajib:

| Bagian | Dari | Jadi |
|---|---|---|
| Baris kontak | `https://portofolio-nextjs-ecru.vercel.app` | `https://sutan-akbar.vercel.app` |
| Skill web | `Next.js (dasar)` | `Next.js` |
| Skill bahasa | `TypeScript (dasar)` | `TypeScript` |
| Tools | `Visual Studio Code, Vite, Node.js, XAMPP, phpMyAdmin, Git, GitHub` | tambah `Node.js test runner, Chrome headless` |
| Ringkasan | menyebut "satu website portofolio berbasis Next.js" | sebutkan 3 proyek web live + redesign UI/UX LMS |

Output: `C:\Users\lenovo\Downloads\CV_Sutan_Akbar_Dwi_Nugraha_v3.docx`.

- [ ] **Step 8: Regenerate `public/cv.pdf` dari DOCX baru**

Ulangi Step 5 Task 10 dengan file `CV_Sutan_Akbar_Dwi_Nugraha_v3.docx` sebagai sumber, lalu `git add public/cv.pdf && git commit -m "chore: sync cv.pdf with final CV"`. Push.

- [ ] **Step 9: Verifikasi akhir**

```bash
npm.cmd run verify -- --forbidden=portofolio-nextjs-ecru
```
Expected: exit 0 — tidak ada lagi URL lama di build output.

Buka `https://sutan-akbar.vercel.app` di browser: cek hero, 4 proyek, filter tech, repo GitHub, halaman `/contact` (WA/email/LinkedIn berfungsi), `/resume` (PDF ter-render + bisa diunduh).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "docs: rewrite README with MIT credit, deploy notes"
```

---

## Self-Review

**1. Cakupan spec** — setiap bagian spec dipetakan ke task:
§4 fork & re-skin → Task 1. §5 rute IKUT/BUANG → Task 2, 6, 9, 10. §6 model data → Task 4; §6.4 repo GitHub → Task 8. §7 i18n → Task 5, 6. §8.1–8.3 tema/tipografi → Task 3; §8.4 hero → Task 7; §8.5 disciplines → Task 8; §8.6 motion → Task 7, 8. §9 degradation → Task 7, 8, 11. §10 mini project → Plan 2–4 (di luar plan ini, disengaja). §11 aset & lisensi → Task 10, 11. §12 fase → urutan Task 1–11. §13 keputusan final → Task 2 (chatbot & form dibuang), Task 5 (locale), Task 11 (domain & CV).

**2. Yang tidak ada di plan ini (disengaja):** rute `/lab` (Plan 5), 3 mini project (Plan 2–4), blog/gallery/achievements (dibuang), chatbot (dibuang), form kontak (dibuang).

**3. Konsistensi tipe:** `Localised` dipakai di `personal.title`, `personal.subtitle`, `personal.bio`, `Project.title/description/longDescription/highlights`, `LabProject.title/tagline/problem/decision`, `Milestone.title/description`, `JourneyEntry.title/org/points`, dan `stats` label. `computeStats` menerima `PortfolioData` penuh. `fetchRepos` mengembalikan `{ repos, failed }`. Semua nama fungsi disebut dengan signature persis di task yang menjadi antarmuka.

**4. Review Focus** — kelima kelas punya test: GitHub gagal → Task 8 Step 3; low-end/reduced-motion → Task 7 Step 1; `accept-language` → Task 5 Step 1; no-JS → Task 11 Step 1 + 3.

**5. Proporsi:** plan ini 11 task; spec 15 bagian. Panjang plan sebanding dengan spec — tidak ada transcript kode di dalamnya, hanya signature, nama test, dan nilai persis yang dikunci spec.



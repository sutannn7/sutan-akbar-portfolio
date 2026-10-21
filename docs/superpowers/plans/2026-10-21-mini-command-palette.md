# Mini Project — `command-palette` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun command palette (⌘K) yang bisa dicari dan dinavigasi **hanya dengan keyboard**, dengan fuzzy match dan ARIA combobox yang benar.

**Architecture:** Aplikasi Next.js 16 App Router yang berdiri sendiri (bukan bagian dari situs utama). Logika murni — fuzzy scoring, filter, navigasi keyboard — dipisah ke modul yang bisa dites tanpa DOM. Komponen React hanya merender + menyambungkan event.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v3 · Vitest · Testing Library (`@testing-library/react`, `@testing-library/user-event`) · jsdom

**Spec:** bagian "Mini Project Lab (3 starter)" di `C:\Users\lenovo\portofolio-v3\docs\superpowers\specs\2026-10-21-portfolio-v3-design.md` §10. Plan ini adalah plan referensi untuk scaffold — plan `token-playground` dan `onboarding-flow` memakai langkah Task 1 yang sama.

**Mengapa repo terpisah:** Command palette adalah artefak mandiri yang harus bisa dibuka, dipakai, dan dinilai siapa pun tanpa masuk ke situs utama. Itu yang membuatnya bukti craft, bukan sekadar fitur.

## Global Constraints

- Node.js ≥ 20 (mesin ini v22.15.1). Selalu `npm.cmd`, bukan `npm` — PowerShell memblokir `npm.ps1`.
- Stack harus **konsisten visual** dengan situs utama: Next.js 16, React 19, TypeScript, **Tailwind v3** (bukan v4), font Inter + JetBrains Mono.
- Palet: latar `#08080C`, teks `#F2F2F5`, aksen lime `#C8F246`. Lime **tidak boleh** jadi warna teks di light mode.
- Standar minimal untuk setiap mini project (spec §5.4 #3): **satu keputusan teknis fokus** — command palette ini = keyboard navigation + fuzzy match + ARIA combobox. Yang **tidak** dikerjakan: indeks data besar, fuzzy scoring rumit, cmd+C registry, riwayat pencarian, multi-command-source.
- Tidak boleh ada API key, token, atau layanan berbayar.
- README wajib berisi: 1 paragraf masalah → 1 paragraf keputusan teknis → cara run → link demo.
- Deploy: Vercel, satu repo sendiri `sutannn7/sutan-command-palette`.

## Review Focus

1. **Keyboard penuh** — pengguna harus bisa buka (⌘K / Ctrl+K), pindah pilihan (↑ ↓), memilih (Enter), menutup (Esc), **tanpa pernah menyentuh mouse**. Test: seluruh alur ini diuji dengan `user-event` keyboard saja.
2. **Focus management** — saat palette terbuka, focus pindah ke input; saat tertutup, focus **kembali** ke elemen yang membukanya. Test: `document.activeElement` dicek sebelum/sesudah.
3. **Perilaku EMPTY dan SINGLE result** — 0 hasil harus menampilkan pesan "Tidak ada hasil", 1 hasil harus bisa langsung dibuka dengan Enter. Test: dua kasus terpisah.
4. **Filter tidak boleh membuat input kehilangan focus** saat daftar hasil berubah. Test: ketik → daftar berubah → input masih focused.
5. **Tidak ada hasil yang bisa dipilih** — `Enter` pada daftar kosong tidak boleh memicu aksi apa pun. Test: spy callback tidak dipanggil.

---

### Task 1: Scaffold repo + test runner

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Create: `.gitignore`, `README.md`, `.env.example` (file kosong — tidak ada env var yang boleh ada)

**Interfaces:**
- Consumes: —
- Produces: `npm.cmd run dev`, `npm.cmd run test`, `npm.cmd run typecheck`, `npm.cmd run build`. `vitest.config.ts` memakai `environment: 'jsdom'`, `setupFiles: ['./vitest.setup.ts']`, alias `@` → `./src`.

- [ ] **Step 1: Buat folder dan inisialisasi git**

```bash
mkdir C:\Users\lenovo\miniprojects\command-palette
cd C:\Users\lenovo\miniprojects\command-palette
git init -b main
```
Buat juga `C:\Users\lenovo\miniprojects\command-palette\.npmrc` berisi `legacy-peer-deps=true` (konsisten dengan situs utama).

- [ ] **Step 2: Tulis `package.json`**

```json
{
  "name": "command-palette",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "16.2.5",
    "react": "19.2.4",
    "react-dom": "19.2.0"
  },
  "devDependencies": {
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^20.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.39.0",
    "eslint-config-next": "16.2.5",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 3: Tulis `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`**

`tsconfig.json` — pakai `paths: { "@/*": ["./src/*"] }`, `strict: true`, `jsx: "react-jsx"`, `include` hanya `src` + config Next (supaya file di root tidak ikut `tsc`).

`tailwind.config.ts` — `content: ['./src/**/*.{ts,tsx}']`, `theme.extend.colors`:
```ts
colors: {
  background: '#08080C',
  surface: '#101016',
  border: '#24242E',
  foreground: '#F2F2F5',
  muted: '#94949F',
  accent: '#C8F246',
}
```
`fontFamily`: `sans: ['var(--font-inter)', 'system-ui', 'sans-serif']`, `mono: ['var(--font-jetbrains)', 'monospace']`.

`postcss.config.js` — `plugins: { tailwindcss: {}, autoprefixer: {} }`.

`next.config.ts` — `const nextConfig: NextConfig = { reactStrictMode: true }; export default nextConfig;`

- [ ] **Step 4: Tulis `vitest.config.ts` + `vitest.setup.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
```
```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Tulis `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`**

`layout.tsx` — `Inter` + `JetBrains_Mono` dari `next/font/google`, `variable: '--font-inter'` / `'--font-jetbrains'`, `display: 'swap'`, `<html lang="id" className={inter.variable + ' ' + jetbrains.variable}>`.

`globals.css` — hanya tiga baris Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #08080C;
  color: #F2F2F5;
  font-family: var(--font-inter), system-ui, sans-serif;
}
```

`page.tsx` — placeholder yang akan diganti Task 3: `<main className="min-h-screen p-10">Command Palette</main>`.

- [ ] **Step 6: Install dan verifikasi**

```bash
npm.cmd install
npm.cmd run typecheck
npm.cmd run build
```
Expected: ketiganya sukses. `npm.cmd run test` akan keluar non-zero karena belum ada test — itu normal, Task 2 yang menambahkannya. Catat di commit body.

- [ ] **Step 7: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "chore: scaffold command-palette - next 16, tailwind v3, vitest"
```

---

### Task 2: Logika murni — fuzzy match + filter + state navigasi

**Files:**
- Create: `src/lib/fuzzy.ts`, `src/lib/fuzzy.test.ts`
- Create: `src/lib/palette-state.ts`, `src/lib/palette-state.test.ts`
- Create: `src/lib/commands.ts` (tipe + data contoh)

**Interfaces:**
- Consumes: —
- Produces:
  - `src/lib/commands.ts`: `export interface Command { id: string; label: string; hint?: string; group: string; action: () => void }`
  - `src/lib/fuzzy.ts`: `export function fuzzyScore(query: string, target: string): number` — mengembalikan `0` kalau tidak cocok, nilai **lebih besar = lebih baik** kalau cocok. Skor berbasis subsequence: posisi match lebih awal = lebih tinggi, match berurutan = lebih tinggi daripada loncat-loncat.
  - `src/lib/fuzzy.ts`: `export function filterCommands(query: string, commands: Command[]): Command[]` — hasil **diurutkan skor descending**, lalu **stable** pada skor sama (urutan asli). Query kosong → semua perintah, urutan asli.
  - `src/lib/palette-state.ts`: `export function nextIndex(current: number, length: number): number` dan `export function prevIndex(current: number, length: number): number` — wrap-around, dan `length === 0` → `0`.

- [ ] **Step 1: Tulis test fuzzy yang gagal**

Buat `src/lib/fuzzy.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { fuzzyScore, filterCommands } from '@/lib/fuzzy';

const cmds = [
  { id: '1', label: 'Buka Proyek', group: 'Navigasi' },
  { id: '2', label: 'Buka Portofolio', group: 'Navigasi' },
  { id: '3', label: 'Salin Email', group: 'Aksi' },
];

describe('fuzzyScore', () => {
  it('mengembalikan 0 saat tidak ada subsequence yang cocok', () => {
    expect(fuzzyScore('zzz', 'Buka Proyek')).toBe(0);
  });
  it('memberi skor lebih tinggi untuk match persis', () => {
    expect(fuzzyScore('proyek', 'Buka Proyek')).toBeGreaterThan(fuzzyScore('prk', 'Buka Proyek'));
  });
  it('memberi skor lebih tinggi bila match lebih awal', () => {
    expect(fuzzyScore('bp', 'Buka Proyek')).toBeGreaterThan(fuzzyScore('bp', 'Proyek Baku'));
  });
  it('mengabaikan huruf besar-kecil', () => {
    expect(fuzzyScore('PROYEK', 'Buka Proyek')).toBeGreaterThan(0);
  });
});

describe('filterCommands', () => {
  it('query kosong mengembalikan semua urutan asli', () => {
    expect(filterCommands('', cmds as any).map(c => c.id)).toEqual(['1', '2', '3']);
  });
  it('hanya mengembalikan yang cocok', () => {
    const res = filterCommands('email', cmds as any);
    expect(res.map(c => c.id)).toEqual(['3']);
  });
  it('mengurutkan dari skor tertinggi', () => {
    const res = filterCommands('buka', cmds as any);
    expect(res.length).toBe(2);
    expect(res[0].id).toBe('1');
  });
  it('mengembalikan array kosong saat tidak ada yang cocok', () => {
    expect(filterCommands('qqqq', cmds as any)).toEqual([]);
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `npm.cmd run test`
Expected: FAIL — `Cannot find module '@/lib/fuzzy'`.

- [ ] **Step 3: Implementasikan `src/lib/fuzzy.ts`**

```ts
import type { Command } from './commands';

export function fuzzyScore(query: string, target: string): number {
  const q = query.trim().toLowerCase();
  const t = target.toLowerCase();
  if (q.length === 0) return 1;
  if (q.length > t.length) return 0;

  let score = 0;
  let ti = 0;
  let lastMatch = -1;
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    let found = -1;
    for (let i = ti; i < t.length; i++) {
      if (t[i] === ch) { found = i; break; }
    }
    if (found === -1) return 0;
    score += 10;
    if (lastMatch >= 0 && found === lastMatch + 1) score += 5;
    score += Math.max(0, 4 - (found - ti));
    lastMatch = found;
    ti = found + 1;
  }
  return score;
}

export function filterCommands(query: string, commands: Command[]): Command[] {
  const q = query.trim();
  if (q.length === 0) return commands;
  return commands
    .map((c, index) => ({ c, index, score: fuzzyScore(q, c.label) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => (b.score - a.score) || (a.index - b.index))
    .map((x) => x.c);
}
```
`Array.prototype.sort` di V8 stabil, tapi penanda `index` membuat kestabilan eksplisit.

- [ ] **Step 4: Tulis test state yang gagal**

Buat `src/lib/palette-state.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex } from '@/lib/palette-state';

describe('nextIndex', () => {
  it('naik satu', () => { expect(nextIndex(0, 3)).toBe(1); });
  it('wrap ke awal', () => { expect(nextIndex(2, 3)).toBe(0); });
  it('0 saat daftar kosong', () => { expect(nextIndex(0, 0)).toBe(0); });
});
describe('prevIndex', () => {
  it('turun satu', () => { expect(prevIndex(1, 3)).toBe(0); });
  it('wrap ke akhir', () => { expect(prevIndex(0, 3)).toBe(2); });
  it('0 saat daftar kosong', () => { expect(prevIndex(0, 0)).toBe(0); });
});
```

- [ ] **Step 5: Implementasikan `src/lib/palette-state.ts`**

```ts
export function nextIndex(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current + 1) % length;
}

export function prevIndex(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current - 1 + length) % length;
}
```

- [ ] **Step 6: Jalankan test**

Run: `npm.cmd run test`
Expected: PASS, 9 tests.

- [ ] **Step 7: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "feat: fuzzy match and palette navigation state"
```

---

### Task 3: Komponen palette + interaksi keyboard

**Files:**
- Create: `src/components/CommandPalette.tsx`
- Create: `src/components/CommandPalette.test.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `filterCommands` (Task 2), `nextIndex`/`prevIndex` (Task 2), tipe `Command` dari `src/lib/commands.ts`
- Produces: `<CommandPalette commands={Command[]} />` — komponen client, membuka diri sendiri saat ⌘K/Ctrl+K ditekan di level `window`, focus otomatis ke input, mengembalikan focus ke pemicu saat ditutup.

- [ ] **Step 1: Tulis test interaksi yang gagal**

Buat `src/components/CommandPalette.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from '@/components/CommandPalette';

const commands = [
  { id: '1', label: 'Buka Proyek', group: 'Navigasi', action: vi.fn() },
  { id: '2', label: 'Buka Portofolio', group: 'Navigasi', action: vi.fn() },
  { id: '3', label: 'Salin Email', group: 'Aksi', action: vi.fn() },
];

describe('CommandPalette', () => {
  it('terbuka dengan Ctrl+K dan input terfokus', async () => {
    const user = userEvent.setup();
    render(<CommandPalette commands={commands} />);
    const trigger = screen.getByRole('button', { name: /buka command palette/i });
    await user.click(trigger);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('memfilter saat mengetik dan menampilkan pesan kosong bila tidak cocok', async () => {
    const user = userEvent.setup();
    render(<CommandPalette commands={commands} />);
    await user.click(screen.getByRole('button', { name: /buka command palette/i }));
    await user.keyboard('email');
    expect(screen.getByRole('option', { name: /Salin Email/i })).toBeInTheDocument();
    await user.keyboard('zzz');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.getByText(/tidak ada hasil/i)).toBeInTheDocument();
  });

  it('memilih dengan Enter menjalankan aksi', async () => {
    const user = userEvent.setup();
    render(<CommandPalette commands={commands} />);
    await user.click(screen.getByRole('button', { name: /buka command palette/i }));
    await user.keyboard('email');
    await user.keyboard('{Enter}');
    expect(commands[2].action).toHaveBeenCalledTimes(1);
  });

  it('tidak menjalankan aksi saat hasil kosong', async () => {
    const user = userEvent.setup();
    render(<CommandPalette commands={commands} />);
    await user.click(screen.getByRole('button', { name: /buka command palette/i }));
    await user.keyboard('zzzz');
    await user.keyboard('{Enter}');
    expect(commands[0].action).not.toHaveBeenCalled();
    expect(commands[1].action).not.toHaveBeenCalled();
    expect(commands[2].action).not.toHaveBeenCalled();
  });

  it('navigasi panah memindahkan pilihan aktif', async () => {
    const user = userEvent.setup();
    render(<CommandPalette commands={commands} />);
    await user.click(screen.getByRole('button', { name: /buka command palette/i }));
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('Escape menutup palette dan mengembalikan focus ke pemicu', async () => {
    const user = userEvent.setup();
    render(<CommandPalette commands={commands} />);
    const trigger = screen.getByRole('button', { name: /buka command palette/i });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('input tetap fokus setelah daftar hasil berubah', async () => {
    const user = userEvent.setup();
    render(<CommandPalette commands={commands} />);
    await user.click(screen.getByRole('button', { name: /buka command palette/i }));
    await user.keyboard('buka');
    expect(screen.getByRole('combobox')).toHaveFocus();
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `npm.cmd run test`
Expected: FAIL — `Cannot find module '@/components/CommandPalette'`.

- [ ] **Step 3: Implementasikan `src/components/CommandPalette.tsx`**

`'use client'`. Isi:
- `interface Props { commands: Command[] }`
- State: `open` (boolean), `query` (string), `activeIndex` (number).
- `useEffect` untuk listener `keydown` di `window`: `if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')` → `e.preventDefault()`, `setOpen((o) => !o)`.
- `triggerRef` = `useRef<HTMLButtonElement>(null)` dipakai untuk mengembalikan focus.
- Saat `open` berubah jadi `true`: `inputRef.current?.focus()` (dalam `useEffect`).
- Saat `open` berubah jadi `false`: `triggerRef.current?.focus()`, `setQuery('')`, `setActiveIndex(0)`.
- `results = useMemo(() => filterCommands(query, commands), [query, commands])`.
- `useEffect`: saat `results.length` berubah, `setActiveIndex(0)`.
- Input: `role="combobox"`, `aria-expanded`, `aria-controls="command-palette-list"`, `aria-activedescendant` = id dari opsi aktif, `aria-autocomplete="list"`, `autoComplete="off"`.
- Daftar: `<ul id="command-palette-list" role="listbox">`, tiap `<li role="option" id={...} aria-selected={i === activeIndex}>`.
- Opsi aktif diberi `ref` dan di-`scrollIntoView({ block: 'nearest' })`.
- `onKeyDown` pada input:
  - `ArrowDown` → `preventDefault()`, `setActiveIndex((i) => nextIndex(i, results.length))`
  - `ArrowUp` → `preventDefault()`, `setActiveIndex((i) => prevIndex(i, results.length))`
  - `Enter` → `preventDefault()`, `results[activeIndex]?.action()` lalu `setOpen(false)`. Kalau `results.length === 0`, **jangan** panggil aksi apa pun.
  - `Escape` → `setOpen(false)`
- Overlay: `fixed inset-0 bg-black/60 backdrop-blur-sm`, panel `mx-auto mt-[15vh] w-full max-w-lg rounded-2xl border border-border bg-surface`.
- Tombol pemicu: `<button ref={triggerRef} aria-label="Buka command palette">` dengan ikon `⌘K`.
- Label dan placeholder berbahasa Indonesia.
- `aria-label` dan `role` harus persis seperti yang ditulis di test.

- [ ] **Step 4: Jalankan test**

Run: `npm.cmd run test`
Expected: PASS, 7 test di `CommandPalette.test.tsx` (+ 9 dari Task 2).

- [ ] **Step 5: Isi `src/app/page.tsx` dengan data contoh**

Buat `src/lib/commands.ts` dengan `export type Command = { id: string; label: string; hint?: string; group: string; action: () => void }` dan 8–10 perintah contoh (Buka Proyek, Buka Portofolio, Buka Skill, Salin Email, Buka GitHub, Tambah Tema Terang/Gelap, …). Halaman `page.tsx` merender judul besar + penjelasan singkat + `<CommandPalette commands={commands} />`.

- [ ] **Step 6: Jalankan test, typecheck, build**

```bash
npm.cmd run test && npm.cmd run typecheck && npm.cmd run build
```
Expected: ketiganya sukses.

- [ ] **Step 7: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "feat: command palette with keyboard nav, fuzzy match and ARIA combobox"
```

---

### Task 4: README, deploy, dan repo GitHub

**Files:**
- Modify: `README.md`
- Create: `public/og.png` (opsional — screenshot halaman, boleh dilewati)

**Interfaces:**
- Consumes: Task 1–3
- Produces: repo publik `sutannn7/sutan-command-palette` + demo live.

- [ ] **Step 1: Tulis `README.md`**

Struktur wajib:
```markdown
# Command Palette

**Masalah.** Di UI yang padat, mencari aksi lewat mouse itu lambat — pengguna harus hafal nama tombolnya sebelum bisa menekan.

**Keputusan teknis.** ...
**Demo:** https://sutan-command-palette.vercel.app
**Source:** https://github.com/sutannn7/sutan-command-palette

## Menjalankan
npm install
npm run dev
```
Isi 1 paragraf masalah dan 1 paragraf keputusan teknis, jujur (keyboard nav + fuzzy subsequence + ARIA combobox; tanpa fuzzy scoring rumit, tanpa cmd+C registry).

- [ ] **Step 2: Bikin repo GitHub dan push**

```bash
gh repo create sutannn7/sutan-command-palette --public --source=. --remote=origin --push --description "Command palette keyboard-first dengan fuzzy match dan ARIA combobox"
```

- [ ] **Step 3: Hubungkan ke project Vercel yang sudah ada (manual oleh Sutan)**

> Project Vercel `sutan-command-palette` **sudah dibuat Sutan** (21/10/2026) dengan domain `sutan-command-palette.vercel.app`, tapi belum ada deployment (masih 404). **Jangan** bikin project baru — namanya sudah dipakai.

Dashboard Vercel → project `sutan-command-palette` → **Settings → Git** → **Connect Git Repository** → pilih `sutannn7/sutan-command-palette`, branch `main` → **Deployments → Redeploy**. Framework preset Next.js, build command default. **Jangan** tambah environment variable apa pun.

- [ ] **Step 4: Verifikasi**

Buka `https://sutan-command-palette.vercel.app`: tekan Ctrl+K, ketik, arrow, Enter — semua harus jalan. Cek juga tampilan mobile (bukan syarat, tapi tidak boleh rusak total).

- [ ] **Step 5: Kembalikan demoUrl ke plan utama**

Tambah entri ke array `lab` di `src/data/portfolio.ts` repo `sutannn7/sutan-akbar-portfolio` (dikerjakan di Plan 5, bukan di plan ini):
```ts
{
  slug: 'command-palette',
  title: { id: 'Command Palette', en: 'Command Palette' },
  tagline: { id: 'Mencari aksi tanpa menyentuh mouse', en: 'Find actions without touching the mouse' },
  problem: { ... },
  decision: { ... },
  techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vitest'],
  repoUrl: 'https://github.com/sutannn7/sutan-command-palette',
  demoUrl: 'https://sutan-command-palette.vercel.app',
  year: '2026',
  image: '/projects/command-palette.png',
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "docs: README with problem and technical decision"
```

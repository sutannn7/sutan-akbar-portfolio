# Mini Project — `token-playground` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun editor design token yang bisa mengubah warna/spacing/typography **sampai ke preview real-time** lewat CSS variables.

**Architecture:** Token disimpan sebagai data TS (nilai → CSS variable name). Fungsi murni mengubah token menjadi deklarasi CSS; komponen React menuliskan hasilnya ke `document.documentElement.style`. Preview adalah komponen nyata yang memakai token yang sama, jadi perubahannya terlihat seketika.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v3 · Vitest · Testing Library · jsdom

**Spec:** `C:\Users\lenovo\portofolio-v3\docs\superpowers\specs\2026-10-21-portfolio-v3-design.md` §10. Scaffold Task 1 mengikut plan `2026-10-21-mini-command-palette.md` Task 1 (identik, hanya nama paket berbeda).

**Mengapa repo terpisah:** Token playground adalah alat yang bisa dipakai siapa pun untuk memahami cara kerja design token — dan itu bukti bahwa Sutan paham sistem, bukan cuma menempel nilai warna.

## Global Constraints

- Node.js ≥ 20 (mesin ini v22.15.1). Selalu `npm.cmd`, bukan `npm`.
- Stack konsisten dengan situs utama: Next.js 16, React 19, TypeScript, **Tailwind v3**, font Inter + JetBrains Mono.
- Palet dasar: latar `#08080C`, teks `#F2F2F5`, aksen lime `#C8F246`.
- Standar minimal (spec §5.4 #3): **satu keputusan teknis fokus** = live token editing via CSS variables. Yang **tidak** dikerjakan: multi-preset/tema bawaan, ekspor file, riwayat undo, sinkronisasi ke backend, menyimpan token ke localStorage.
- Tidak boleh ada API key, token, atau layanan berbayar.
- README wajib: 1 paragraf masalah → 1 paragraf keputusan teknis → cara run → link demo.
- Deploy: Vercel, repo sendiri `sutannn7/token-playground`.

## Review Focus

1. **Perubahan token benar-benar sampai ke DOM** — mengubah slider harus mengubah `document.documentElement` computed style, bukan cuma state React. Test: baca `getComputedStyle(document.documentElement).getPropertyValue('--accent')`.
2. **Nilai token yang tidak valid ditolak** — input `#zzz` atau angka negatif tidak boleh membuat CSS rusak; nilai sebelumnya harus dipertahankan. Test: dua kasus input invalid.
3. **Nilai token selalu mengembalikan ke bentuk CSS yang valid** — hex jadi `hsl(...)`/hex uppercase, angka jadi `px`, dan nama token jadi kebab-case yang valid. Test: fungsi murni.
4. **Reset mengembalikan keadaan awal persis** — snapshot sebelum edit harus identik setelah reset. Test: bandingkan objek token.
5. **Tidak ada `dangerouslySetInnerHTML`** untuk warna — nilai ditulis lewat `style.setProperty`, bukan string HTML.

---

### Task 1: Scaffold repo + test runner

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `.npmrc`, `.gitignore`, `README.md`, `.env.example` (file kosong)
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `vitest.config.ts`, `vitest.setup.ts`

**Interfaces:**
- Consumes: —
- Produces: `npm.cmd run dev|test|typecheck|build`. `vitest.config.ts` → `environment: 'jsdom'`, `setupFiles: ['./vitest.setup.ts']`, `include: ['src/**/*.test.{ts,tsx}']`, alias `@` → `./src`.

- [ ] **Step 1: Init repo**

```bash
mkdir C:\Users\lenovo\miniprojects\token-playground
cd C:\Users\lenovo\miniprojects\token-playground
git init -b main
```
`C:\Users\lenovo\miniprojects\token-playground\.npmrc` berisi `legacy-peer-deps=true`.

- [ ] **Step 2: Tulis `package.json`**

Sama persis dengan plan `command-palette` Task 1 Step 2, kecuali `"name": "token-playground"`.

- [ ] **Step 3: Tulis config Next/Tailwind/PostCSS/TS**

Sama persis dengan plan `command-palette` Task 1 Step 3 — termasuk `tailwind.config.ts` dengan palet `#08080C / #101016 / #24242E / #F2F2F5 / #94949F / #C8F246`, `fontFamily` Inter + JetBrains Mono, dan `tsconfig.json` yang `include` hanya `src`.

- [ ] **Step 4: Tulis `vitest.config.ts` + `vitest.setup.ts`**

Sama persis dengan plan `command-palette` Task 1 Step 4.

- [ ] **Step 5: Tulis `src/app/layout.tsx`, `globals.css`, `page.tsx`**

`layout.tsx` — `Inter` + `JetBrains_Mono` dari `next/font/google`, `lang="id"`.
`globals.css` — tiga baris Tailwind + blok `:root` yang mendefinisikan token default:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --accent: #C8F246;
  --surface: #101016;
  --foreground: #F2F2F5;
  --radius: 16px;
}
body { background-color: #08080C; color: #F2F2F5; font-family: var(--font-inter), system-ui, sans-serif; }
```
`page.tsx` — placeholder `Token Playground` yang akan diganti Task 3.

- [ ] **Step 6: Install dan verifikasi**

```bash
npm.cmd install
npm.cmd run typecheck
npm.cmd run build
```
Expected: sukses. `npm.cmd run test` keluar non-zero karena belum ada test — normal, Task 2 yang menambahkannya.

- [ ] **Step 7: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "chore: scaffold token-playground"
```

---

### Task 2: Model token + fungsi murni

**Files:**
- Create: `src/lib/tokens.ts`, `src/lib/tokens.test.ts`
- Create: `src/lib/apply-tokens.ts`, `src/lib/apply-tokens.test.ts`

**Interfaces:**
- Consumes: —
- Produces:
  - `src/lib/tokens.ts`: `export type TokenType = 'color' | 'length' | 'radius';` dan `export interface TokenDef { name: string; type: TokenType; value: string; label: string }` serta `export const DEFAULT_TOKENS: TokenDef[]`
  - `src/lib/tokens.ts`: `export function cssVarName(name: string): string` — `accentColor` → `--accent-color`
  - `src/lib/tokens.ts`: `export function normalizeValue(type: TokenType, raw: string): string | null` — `color` → hex uppercase 3/6 digit (`#C8F246`), `length` → angka + `px` (nilai negatif ditolak), `radius` → angka + `px`. Mengembalikan `null` kalau tidak valid.
  - `src/lib/tokens.ts`: `export function toCssText(tokens: TokenDef[]): string` — `"--accent-color: #C8F246;"` per token, dipisah baris baru.
  - `src/lib/apply-tokens.ts`: `export function applyTokens(el: HTMLElement, tokens: TokenDef[]): void` — untuk setiap token, `el.style.setProperty(cssVarName(token.name), normalizeValue(token.type, token.value) ?? token.value)`. Token yang tidak valid **tidak** ditulis (nilai lama dipertahankan).

- [ ] **Step 1: Tulis test tokens yang gagal**

Buat `src/lib/tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { cssVarName, normalizeValue, toCssText } from '@/lib/tokens';

describe('cssVarName', () => {
  it('mengubah camelCase menjadi kebab-case dengan prefiks --', () => {
    expect(cssVarName('accentColor')).toBe('--accent-color');
  });
  it('menjaga nama yang sudah memakai --', () => {
    expect(cssVarName('--accent')).toBe('--accent');
  });
});

describe('normalizeValue', () => {
  it('mem-normalisasi hex menjadi uppercase', () => {
    expect(normalizeValue('color', '#c8f246')).toBe('#C8F246');
  });
  it('menolak hex tidak valid', () => {
    expect(normalizeValue('color', '#zzz')).toBeNull();
    expect(normalizeValue('color', 'merah')).toBeNull();
  });
  it('menambahkan px untuk panjang', () => {
    expect(normalizeValue('length', '16')).toBe('16px');
  });
  it('menolak panjang negatif', () => {
    expect(normalizeValue('length', '-4')).toBeNull();
  });
});

describe('toCssText', () => {
  it('menghasilkan deklarasi css per token', () => {
    const out = toCssText([{ name: 'accent', type: 'color', value: '#C8F246', label: 'Accent' }]);
    expect(out).toContain('--accent: #C8F246;');
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `npm.cmd run test`
Expected: FAIL — `Cannot find module '@/lib/tokens'`.

- [ ] **Step 3: Implementasikan `src/lib/tokens.ts`**

```ts
export type TokenType = 'color' | 'length' | 'radius';

export interface TokenDef {
  name: string;
  type: TokenType;
  value: string;
  label: string;
}

export function cssVarName(name: string): string {
  if (name.startsWith('--')) return name;
  return `--${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function normalizeValue(type: TokenType, raw: string): string | null {
  const value = raw.trim();
  if (type === 'color') {
    if (!HEX.test(value)) return null;
    return value.toUpperCase();
  }
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return null;
  return `${num}px`;
}

export function toCssText(tokens: TokenDef[]): string {
  return tokens
    .map((t) => `${cssVarName(t.name)}: ${normalizeValue(t.type, t.value) ?? t.value};`)
    .join('\n');
}
```

`DEFAULT_TOKENS` — 8 token: `accent` (color `#C8F246`), `background` (color `#08080C`), `surface` (color `#101016`), `foreground` (color `#F2F2F5`), `muted` (color `#94949F`), `radius` (radius `16`), `spaceMd` (length `16`), `spaceLg` (length `32`).

- [ ] **Step 4: Tulis test apply-tokens yang gagal**

Buat `src/lib/apply-tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { applyTokens } from '@/lib/apply-tokens';

describe('applyTokens', () => {
  it('menulis token valid ke style element', () => {
    const el = document.createElement('div');
    applyTokens(el, [{ name: 'accent', type: 'color', value: '#c8f246', label: 'Accent' }]);
    expect(el.style.getPropertyValue('--accent')).toBe('#C8F246');
  });
  it('mempertahankan nilai lama ketika input tidak valid', () => {
    const el = document.createElement('div');
    applyTokens(el, [{ name: 'accent', type: 'color', value: '#C8F246', label: 'Accent' }]);
    applyTokens(el, [{ name: 'accent', type: 'color', value: 'bukan warna', label: 'Accent' }]);
    expect(el.style.getPropertyValue('--accent')).toBe('#C8F246');
  });
});
```

- [ ] **Step 5: Implementasikan `src/lib/apply-tokens.ts`**

```ts
import { cssVarName, normalizeValue, type TokenDef } from './tokens';

export function applyTokens(el: HTMLElement, tokens: TokenDef[]): void {
  for (const token of tokens) {
    const value = normalizeValue(token.type, token.value);
    if (value === null) continue;
    el.style.setProperty(cssVarName(token.name), value);
  }
}
```

- [ ] **Step 6: Jalankan test**

Run: `npm.cmd run test`
Expected: PASS, 7 tests.

- [ ] **Step 7: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "feat: token model and css variable application"
```

---

### Task 3: Editor + preview real-time

**Files:**
- Create: `src/components/TokenEditor.tsx`
- Create: `src/components/TokenEditor.test.tsx`
- Create: `src/components/TokenPreview.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `applyTokens`, `normalizeValue`, `cssVarName`, `DEFAULT_TOKENS` (Task 2)
- Produces: `<TokenEditor />` (client) dan `<TokenPreview />` (client, menerima `tokens: TokenDef[]`).

- [ ] **Step 1: Tulis test editor yang gagal**

Buat `src/components/TokenEditor.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TokenEditor } from '@/components/TokenEditor';

describe('TokenEditor', () => {
  it('menampilkan satu input per token', () => {
    render(<TokenEditor />);
    expect(screen.getAllByRole('textbox')).toHaveLength(8);
  });

  it('menulis token yang diubah ke documentElement', async () => {
    const user = userEvent.setup();
    render(<TokenEditor />);
    const input = screen.getByLabelText(/accent/i);
    await user.clear(input);
    await user.type(input, '#33D6FF');
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#33D6FF');
  });

  it('menolak nilai tidak valid dan mempertahankan nilai lama', async () => {
    const user = userEvent.setup();
    render(<TokenEditor />);
    const input = screen.getByLabelText(/accent/i);
    await user.clear(input);
    await user.type(input, '#33D6FF');
    await user.clear(input);
    await user.type(input, 'bukan warna');
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#33D6FF');
  });

  it('reset mengembalikan nilai awal', async () => {
    const user = userEvent.setup();
    render(<TokenEditor />);
    const input = screen.getByLabelText(/accent/i);
    await user.clear(input);
    await user.type(input, '#33D6FF');
    await user.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.getByLabelText(/accent/i)).toHaveValue('#C8F246');
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `npm.cmd run test`
Expected: FAIL — modul belum ada.

- [ ] **Step 3: Implementasikan `src/components/TokenEditor.tsx`**

`'use client'`.
- `const [tokens, setTokens] = useState<TokenDef[]>(DEFAULT_TOKENS)`.
- `useEffect(() => { applyTokens(document.documentElement, tokens); }, [tokens])`.
- Tiap token dirender sebagai baris: `<label>` (label token) + `<input type="text">` dengan `value={token.value}` dan `aria-label` = `token.label`.
- `onChange`: `setTokens((prev) => prev.map((t) => t.name === name ? { ...t, value } : t))`. Nilai invalid **tetap masuk ke state** (supaya user melihat apa yang dia ketik) tapi `applyTokens` menolaknya → DOM tidak berubah.
- Tombol **Reset** mengembalikan `DEFAULT_TOKENS` (salinan dalam, bukan referensi yang bisa dimutasi).
- Panel kiri = editor, panel kanan = `<TokenPreview tokens={tokens} />`.

- [ ] **Step 4: Implementasikan `src/components/TokenPreview.tsx`**

`'use client'`, menerima `tokens: TokenDef[]`.
- Menampilkan kartu contoh (tombol, input teks, heading, paragraph) yang warnanya diambil dari `var(--accent)`, `var(--surface)`, `var(--foreground)` — **dari CSS variable yang sama**, sehingga perubahan editor terlihat seketika.
- `borderRadius` dari `var(--radius)`, spacing dari `var(--space-md)` / `var(--space-lg)`.
- Gunakan `style={{ borderRadius: 'var(--radius)' }}` — bukan `dangerouslySetInnerHTML`.

- [ ] **Step 5: Isi `src/app/page.tsx`**

Server component yang merender judul, satu kalimat penjelasan, lalu `<TokenEditor />` (client). Tambahkan `export const metadata` dengan title `Token Playground` dan description.

- [ ] **Step 6: Jalankan test, typecheck, build**

```bash
npm.cmd run test && npm.cmd run typecheck && npm.cmd run build
```
Expected: sukses.

- [ ] **Step 7: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "feat: live token editor with real-time preview"
```

---

### Task 4: README + deploy

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Task 1–3
- Produces: repo publik `sutannn7/token-playground` + demo live.

- [ ] **Step 1: Tulis `README.md`**

```markdown
# Token Playground

**Masalah.** Mengubah satu warna di design token statis berarti mengedit file CSS lalu menunggu reload — debugging token jadi lambat dan sering terlewat.

**Keputusan teknis.** Token diubah jadi CSS variables di level `document.documentElement`, jadi preview yang membaca variable yang sama ikut berubah seketika. Nilai input divalidasi sebelum ditulis, sehingga nilai yang tidak valid tidak bisa merusak CSS.

**Demo:** https://token-playground.vercel.app
**Source:** https://github.com/sutannn7/token-playground

## Menjalankan
npm install
npm run dev
```

- [ ] **Step 2: Bikin repo dan push**

```bash
gh repo create sutannn7/token-playground --public --source=. --remote=origin --push --description "Live design token editor dengan CSS variables dan preview real-time"
```

- [ ] **Step 3: Deploy ke Vercel (manual oleh Sutan)**

Import repo, preset Next.js, build command default, project name `token-playground`, deploy. **Jangan** tambah environment variable apa pun.

- [ ] **Step 4: Verifikasi**

Buka demo: ubah `--accent`, preview berubah seketika; coba input `bukan warna` → preview tidak berubah.

- [ ] **Step 5: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "docs: README with problem and technical decision"
```

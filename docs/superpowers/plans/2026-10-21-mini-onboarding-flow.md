# Mini Project — `onboarding-flow` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun alur onboarding bertahap dengan validasi **per langkah**, progress yang jelas, dan pesan error yang bisa langsung ditindaklanjuti.

**Architecture:** Definisi langkah dan aturan validasi dipisah ke modul data murni (`steps.ts`, `validate.ts`) yang bisa dites tanpa DOM. Komponen React hanya merender langkah yang sedang aktif, memanggil validator, dan menyimpan state antar langkah. Unggahan data (submit) sengaja tidak ada — demo berhenti di ringkasan.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v3 · Vitest · Testing Library (`@testing-library/react`, `@testing-library/user-event`) · jsdom

**Spec:** `C:\Users\lenovo\portofolio-v3\docs\superpowers\specs\2026-10-21-portfolio-v3-design.md` §10. Scaffold Task 1 mengikut plan `2026-10-21-mini-command-palette.md` Task 1 (identik, hanya nama paket berbeda).

**Mengapa repo terpisah:** Form multi-langkah adalah tugas harian di hampir setiap kerjaan frontend. Menjelaskan **kenapa** dan **bagaimana** error ditangani adalah pembeda antara "bisa bikin form" dan "paham form".

## Global Constraints

- Node.js ≥ 20 (mesin ini v22.15.1). Selalu `npm.cmd`, bukan `npm`.
- Stack konsisten dengan situs utama: Next.js 16, React 19, TypeScript, **Tailwind v3**, font Inter + JetBrains Mono.
- Palet: latar `#08080C`, teks `#F2F2F5`, aksen lime `#C8F246`. Pesan error memakai merah yang kontras (`#F87171`), bukan lime.
- Standar minimal (spec §5.4 #3): **satu keputusan teknis fokus** = multi-step + validasi per langkah + error UX. Yang **tidak** dikerjakan: draft persistence/localStorage, autentikasi, server action, upload file, analytics.
- Tidak boleh ada API key, token, atau layanan berbayar.
- README wajib: 1 paragraf masalah → 1 paragraf keputusan teknis → cara run → link demo.
- Deploy: Vercel, repo sendiri `sutannn7/sutan-onboarding-flow`.

## Review Focus

1. **Validação hanya memeriksa langkah saat ini** — menekan "Lanjut" dari langkah 1 tidak boleh complain soal field langkah 3. Test: klik "Lanjut" dengan langkah 1 kosong → error hanya untuk field langkah 1.
2. **Error hilang saat field diperbaiki** — begitu input valid, pesan error untuk field itu harus hilang tanpa perlu menekan tombol lagi. Test: ketik → error muncul → perbaiki → error hilang.
3. **Tidak bisa melompat ke langkah berikutnya tanpa validasi** — progress indicator tidak boleh bisa diklik untuk melewati langkah yang belum valid. Test: klik indikator langkah 2 saat langkah 1 invalid → tetap di langkah 1.
4. **State langkah yang sudah diisi tidak hilang** — mundur lalu maju lagi, isian langkah sebelumnya harus tetap ada. Test: isi langkah 1 → Lanjut → Kembali → Lanjut → nilai lama masih ada.
5. **Pesan error terlokalisasi dan menyebut field** — pesan harus menyebut nama field ("Nama lengkap wajib diisi"), bukan "invalid input" generik. Test: teks error mengandung nama field.

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
mkdir C:\Users\lenovo\miniprojects\onboarding-flow
cd C:\Users\lenovo\miniprojects\onboarding-flow
git init -b main
```
`C:\Users\lenovo\miniprojects\onboarding-flow\.npmrc` berisi `legacy-peer-deps=true`.

- [ ] **Step 2: Tulis `package.json`**

Sama persis dengan plan `command-palette` Task 1 Step 2, kecuali `"name": "onboarding-flow"`.

- [ ] **Step 3: Tulis config Next/Tailwind/PostCSS/TS**

Sama persis dengan plan `command-palette` Task 1 Step 3 — termasuk `tailwind.config.ts` dengan palet `#08080C / #101016 / #24242E / #F2F2F5 / #94949F / #C8F246`, `fontFamily` Inter + JetBrains Mono, dan `tsconfig.json` yang `include` hanya `src`.

- [ ] **Step 4: Tulis `vitest.config.ts` + `vitest.setup.ts`**

Sama persis dengan plan `command-palette` Task 1 Step 4.

- [ ] **Step 5: Tulis `src/app/layout.tsx`, `globals.css`, `page.tsx`**

`layout.tsx` — `Inter` + `JetBrains_Mono` dari `next/font/google`, `lang="id"`.
`globals.css` — tiga baris Tailwind + `body { background-color: #08080C; color: #F2F2F5; font-family: var(--font-inter), system-ui, sans-serif; }`.
`page.tsx` — placeholder `Onboarding Flow` yang akan diganti Task 3.

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
git -c user.name="opencode" -c user.email="opencode@local" commit -m "chore: scaffold onboarding-flow"
```

---

### Task 2: Definisi langkah + validator murni

**Files:**
- Create: `src/lib/steps.ts`, `src/lib/steps.test.ts`
- Create: `src/lib/validate.ts`, `src/lib/validate.test.ts`

**Interfaces:**
- Consumes: —
- Produces:
  - `src/lib/steps.ts`: `export type FieldType = 'text' | 'email' | 'select';`
  - `src/lib/steps.ts`: `export interface FieldDef { name: string; label: string; type: FieldType; required: boolean; options?: string[] }`
  - `src/lib/steps.ts`: `export interface StepDef { id: string; title: string; description: string; fields: FieldDef[] }`
  - `src/lib/steps.ts`: `export const STEPS: StepDef[]` — 3 langkah: **Data diri** (`fullName` text required, `email` email required), **Preferensi** (`role` select required dengan opsi `Frontend Developer` / `Backend Developer` / `Designer`, `newsletter` text optional), **Konfirmasi** (tanpa field, hanya ringkasan).
  - `src/lib/validate.ts`: `export type Values = Record<string, string>`
  - `src/lib/validate.ts`: `export function validateStep(step: StepDef, values: Values): Record<string, string>` — mengembalikan peta `fieldName → pesan error`. Field wajib kosong → `"<label> wajib diisi"`. Format email salah → `"Format email tidak valid"`. Field optional kosong → tidak ada error. Field yang tidak ada di langkah ini **tidak pernah** diperiksa.
  - `src/lib/validate.ts`: `export function isStepComplete(step: StepDef, values: Values): boolean` — `Object.keys(validateStep(step, values)).length === 0`.

- [ ] **Step 1: Tulis test validate yang gagal**

Buat `src/lib/validate.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validateStep, isStepComplete } from '@/lib/validate';
import { STEPS } from '@/lib/steps';

const identity = STEPS[0];

describe('validateStep', () => {
  it('menyebut nama field dalam pesan error', () => {
    const errors = validateStep(identity, {});
    expect(errors.fullName).toContain('Nama lengkap');
  });
  it('menolak format email yang salah', () => {
    const errors = validateStep(identity, { fullName: 'Sutan', email: 'bukan-email' });
    expect(errors.email).toBeTruthy();
  });
  it('menerima email yang valid', () => {
    const errors = validateStep(identity, { fullName: 'Sutan', email: 'sutan@example.com' });
    expect(errors).toEqual({});
  });
  it('tidak memeriksa field dari langkah lain', () => {
    const errors = validateStep(identity, { fullName: 'Sutan', email: 'sutan@example.com' });
    expect(errors.role).toBeUndefined();
  });
  it('field opsional kosong tidak jadi error', () => {
    const prefs = STEPS[1];
    const errors = validateStep(prefs, { role: 'Frontend Developer' });
    expect(errors).toEqual({});
  });
});

describe('isStepComplete', () => {
  it('benar saat langkah valid', () => {
    expect(isStepComplete(identity, { fullName: 'Sutan', email: 'sutan@example.com' })).toBe(true);
  });
  it('salah saat ada field wajib kosong', () => {
    expect(isStepComplete(identity, {})).toBe(false);
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `npm.cmd run test`
Expected: FAIL — modul belum ada.

- [ ] **Step 3: Implementasikan `src/lib/steps.ts`**

```ts
export type FieldType = 'text' | 'email' | 'select';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

export interface StepDef {
  id: string;
  title: string;
  description: string;
  fields: FieldDef[];
}

export const STEPS: StepDef[] = [
  {
    id: 'identity',
    title: 'Data diri',
    description: 'Siapa yang akan kita hubungi?',
    fields: [
      { name: 'fullName', label: 'Nama lengkap', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferensi',
    description: 'Kamu mau mengerjakan apa?',
    fields: [
      {
        name: 'role',
        label: 'Peran',
        type: 'select',
        required: true,
        options: ['Frontend Developer', 'Backend Developer', 'Designer'],
      },
      { name: 'company', label: 'Perusahaan', type: 'text', required: false },
    ],
  },
  {
    id: 'confirmation',
    title: 'Konfirmasi',
    description: 'Periksa sekali lagi sebelum kirim.',
    fields: [],
  },
];
```

- [ ] **Step 4: Implementasikan `src/lib/validate.ts`**

```ts
import type { StepDef } from './steps';

export type Values = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateStep(step: StepDef, values: Values): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of step.fields) {
    const value = (values[field.name] ?? '').trim();
    if (!value) {
      if (field.required) errors[field.name] = `${field.label} wajib diisi`;
      continue;
    }
    if (field.type === 'email' && !EMAIL.test(value)) {
      errors[field.name] = 'Format email tidak valid';
    }
  }
  return errors;
}

export function isStepComplete(step: StepDef, values: Values): boolean {
  return Object.keys(validateStep(step, values)).length === 0;
}
```

- [ ] **Step 5: Jalankan test**

Run: `npm.cmd run test`
Expected: PASS, 7 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "feat: onboarding steps and per-step validation"
```

---

### Task 3: Komponen flow + progress + error UX

**Files:**
- Create: `src/components/OnboardingFlow.tsx`
- Create: `src/components/OnboardingFlow.test.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `STEPS`, `StepDef` (`src/lib/steps.ts`), `validateStep`, `isStepComplete` (`src/lib/validate.ts`)
- Produces: `<OnboardingFlow />` — client component; state `values: Values`, `stepIndex: number`, `errors: Record<string,string>`.

- [ ] **Step 1: Tulis test flow yang gagal**

Buat `src/components/OnboardingFlow.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingFlow } from '@/components/OnboardingFlow';

describe('OnboardingFlow', () => {
  it('hanya memeriksa langkah saat ini', async () => {
    const user = userEvent.setup();
    render(<OnboardingFlow />);
    await user.click(screen.getByRole('button', { name: /lanjut/i }));
    expect(screen.getByText(/Nama lengkap wajib diisi/i)).toBeInTheDocument();
    expect(screen.queryByText(/Peran wajib diisi/i)).not.toBeInTheDocument();
  });

  it('error hilang saat field diperbaiki', async () => {
    const user = userEvent.setup();
    render(<OnboardingFlow />);
    await user.click(screen.getByRole('button', { name: /lanjut/i }));
    expect(screen.getByText(/Nama lengkap wajib diisi/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/nama lengkap/i), 'Sutan');
    expect(screen.queryByText(/Nama lengkap wajib diisi/i)).not.toBeInTheDocument();
  });

  it('tidak bisa melewati langkah yang belum valid', async () => {
    const user = userEvent.setup();
    render(<OnboardingFlow />);
    await user.click(screen.getByRole('button', { name: /preferensi/i }));
    expect(screen.getByText(/Data diri/i)).toBeInTheDocument();
  });

  it('menyimpan isian langkah sebelumnya', async () => {
    const user = userEvent.setup();
    render(<OnboardingFlow />);
    await user.type(screen.getByLabelText(/nama lengkap/i), 'Sutan');
    await user.type(screen.getByLabelText(/email/i), 'sutan@example.com');
    await user.click(screen.getByRole('button', { name: /lanjut/i }));
    expect(screen.getByText(/Preferensi/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /kembali/i }));
    expect(screen.getByLabelText(/nama lengkap/i)).toHaveValue('Sutan');
  });

  it('menampilkan ringkasan di langkah terakhir', async () => {
    const user = userEvent.setup();
    render(<OnboardingFlow />);
    await user.type(screen.getByLabelText(/nama lengkap/i), 'Sutan');
    await user.type(screen.getByLabelText(/email/i), 'sutan@example.com');
    await user.click(screen.getByRole('button', { name: /lanjut/i }));
    await user.selectOptions(screen.getByLabelText(/peran/i), 'Frontend Developer');
    await user.click(screen.getByRole('button', { name: /lanjut/i }));
    expect(screen.getByText('Sutan')).toBeInTheDocument();
    expect(screen.getByText('sutan@example.com')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `npm.cmd run test`
Expected: FAIL — modul belum ada.

- [ ] **Step 3: Implementasikan `src/components/OnboardingFlow.tsx`**

`'use client'`.
- State: `values` (`Values`), `stepIndex` (number, default 0), `errors` (`Record<string,string>`).
- `current = STEPS[stepIndex]`.
- **Perbaikan langsung menghapus error field itu**: `onChange` field → `setValues(...)` **dan** `setErrors((prev) => { const next = { ...prev }; delete next[field.name]; return next; })`.
- Tombol **Lanjut**:
  ```ts
  const nextErrors = validateStep(current, values);
  setErrors(nextErrors);
  if (Object.keys(nextErrors).length > 0) return;
  setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  ```
- Tombol **Kembali** (hanya tampil kalau `stepIndex > 0`) → `setStepIndex((i) => Math.max(i - 1, 0))`.
- Progress indicator: satu tombol per langkah, `aria-current` untuk langkah aktif. **Tombol langkah yang belum boleh diakses** (index > stepIndex + 1) → `disabled`. Langkah 0 boleh diklik dari mana saja (kembali ke awal).
- Ringkasan di langkah terakhir: tampilkan `values` sebagai daftar label → nilai.
- Field dirender dari `current.fields`:
  - `text` → `<input type="text">`
  - `email` → `<input type="email">`
  - `select` → `<select>` dengan `current.options`
  - setiap field punya `<label htmlFor={field.name}>` dengan teks `field.label`, dan `aria-invalid` + `aria-describedby` menunjuk ke pesan error.
- Pesan error: `<p id={`${field.name}-error`} role="alert" className="text-sm text-[#F87171]">{errors[field.name]}</p>` — dirender hanya kalau ada error untuk field itu.
- Tombol submit di langkah terakhir = **"Kirim"** yang hanya menampilkan ringkasan (tidak ada server action).

- [ ] **Step 4: Isi `src/app/page.tsx`**

Server component: judul, satu kalimat penjelasan, lalu `<OnboardingFlow />`.

- [ ] **Step 5: Jalankan test, typecheck, build**

```bash
npm.cmd run test && npm.cmd run typecheck && npm.cmd run build
```
Expected: sukses.

- [ ] **Step 6: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "feat: multi-step onboarding with per-step validation and error UX"
```

---

### Task 4: README + deploy

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Task 1–3
- Produces: repo publik `sutannn7/sutan-onboarding-flow` + demo live.

- [ ] **Step 1: Tulis `README.md`**

```markdown
# Onboarding Flow

**Masalah.** Form satu halaman panjang bikin pengguna kehilangan semua isian saat menemukan kesalahan di field terakhir — mereka isi ulang dari awal.

**Keputusan teknis.** Form dipecah jadi langkah-langkah, divalidasi per langkah, dan pesan error menyebut nama field secara spesifik. Error dihapus begitu field diperbaiki, bukan menunggu pengguna menekan tombol lagi, supaya umpan balik terasa langsung.

**Demo:** https://sutan-onboarding-flow.vercel.app
**Source:** https://github.com/sutannn7/sutan-onboarding-flow

## Menjalankan
npm install
npm run dev
```

- [ ] **Step 2: Bikin repo dan push**

```bash
gh repo create sutannn7/sutan-onboarding-flow --public --source=. --remote=origin --push --description "Alur onboarding bertahap dengan validasi per langkah dan pesan error yang bisa ditindaklanjuti"
```

- [ ] **Step 3: Hubungkan ke project Vercel yang sudah ada (manual oleh Sutan)**

> Project Vercel `sutan-onboarding-flow` **sudah dibuat Sutan** (21/10/2026) dengan domain `sutan-onboarding-flow.vercel.app`, tapi belum ada deployment (masih 404). **Jangan** bikin project baru — namanya sudah dipakai.

Dashboard Vercel → project `sutan-onboarding-flow` → **Settings → Git** → **Connect Git Repository** → pilih `sutannn7/sutan-onboarding-flow`, branch `main` → **Deployments → Redeploy**. Framework preset Next.js, build command default. **Jangan** tambah environment variable apa pun.

- [ ] **Step 4: Verifikasi**

Buka demo: coba lanjut dengan kolom kosong → pesan error menyebut nama field; perbaiki → error hilang; coba lompat ke langkah 3 dari langkah 1 → tidak bisa.

- [ ] **Step 5: Commit**

```bash
git add -A
git -c user.name="opencode" -c user.email="opencode@local" commit -m "docs: README with problem and technical decision"
```

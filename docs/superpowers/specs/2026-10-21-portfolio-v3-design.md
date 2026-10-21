# Portofolio v3 — Design Doc

> Tanggal: 2026-10-21 (rev 2 — setelah builder check)
> Status: menunggu jawaban 4 pertanyaan terbuka (§13)
> Pemilik: Sutan Akbar Dwi Nugraha
> Target repo: `C:\Users\lenovo\portofolio-v3` (berkas ini disalin ke sana saat scaffolding)

---

## 1. Intent & Why

Portofolio lama (`portofolio-nextjs-ecru.vercel.app`) belum menyuarakan siapa Sutan sebagai **frontend engineer**. Yang ada sekarang: 5 halaman, palet pastel krem, motion halus, tapi isinya amblas — rekrut'er tidak langsung melihat craft-nya, dan tidak ada tempat untuk mekanik yang baru.

Referensi yang dipilih (https://www.syahrilarfianalmazril.my.id, repo `Arfazrll/PersonalBlog`) adalah portofolio **dark, motion-rich, 3D, dense** yang terlihat seperti portofolio senior engineer. Repo itu **MIT-licensed** dan memakai stack yang persis sama dengan yang sudah dipakai Sutan (Next.js 16, React 19, TypeScript, Tailwind, Framer Motion, GSAP, Lenis).

Maka strateginya: **fork + re-skin**, bukan tulis dari nol. Ambil engine visualnya, ganti seluruh isinya dengan milik Sutan, dan potong semua konten yang tidak berlaku (AI/ML, Kaggle, WakaTime, galeri, blog).

**Target nyata:** screening magang **PT Pupuk Sriwijaya Palembang** (SOE, rekrutemen formal) + reviewer teknis. Artinya situs harus **(a) terbaca HR non-teknis dalam 30 detik** dan **(b) membuktikan craft ke reviewer teknis**.

---

## 2. Goals / Non-Goals / Anti-Goals

### Goals
1. Positioning tunggal yang konsisten di seluruh situs: **Frontend Engineer**.
2. 30 detik pertama: rekrut'er tahu siapa Sutan, apa yang sudah dikerjakan, dan cara menghubungi.
3. Minimal 3 mini project live yang membuktikan craft, bukan sekadar klaim.
4. Visual closet referensi (dark, 3D, dense) tapi **tanpa** konten palsu.
5. Satu sumber data (`portfolio.ts`) — semua section, stats, dan halaman detail membacanya.
6. ID sebagai bahasa default, EN tersedia lewat toggle.
7. Tetap terbaca & ringan di HP dan koneksi lambat.

### Non-Goals
- Tidak ada CMS, database, user account, atau backend milik sendiri.
- Tidak ada analytics wajib (Vercel Analytics boleh kalau mau, tidak dihitung sebagai fitur).
- Tidak ada autentikasi. Tidak ada paid service yang wajib jalan.
- Tidak ada fitur di luar "serbaguna": portofolio + lab mini project. Blog dan gallery sengaja **tidak** dibangun — lihat §5.

### Anti-Goals (hal yang bikin gagal walau secara teknis jalan)
- **Klaim yang tidak didukung.** Tidak ada kata "AI", "Data", "Machine Learning", "Full-stack Engineer" di headline atau section mana pun. Tidak ada angka yang tidak bisa ditelusuri ke `portfolio.ts` atau ke CV.
- **Dead link.** Tidak ada tombol demo/proyek yang mengarah ke 404 atau ke `demoUrl: '#'`.
- **Halaman kosong.** Section yang butuh isi tapi isinya belum ada → section itu dihapus, bukan dibiarkan kosong.
- **Landing page yang cuma bergerak.** Section yang beranimasi tapi tidak menyampaikan informasi → dipangkas.
- **Overlay yang menutupi konten.** Preloader/arc-loader maksimal ~1.2 detik, dan bisa di-skip.

---

## 3. Constraints

| Constraint | Impact |
|---|---|
| Fork MIT: LICENSE asli wajib disimpan | 1 file + 1 baris credit di README + 1 link kecil di footer |
| Fork 440 file, banyak konten orang lain | Harus di-audit & dipangkas, bukan cuma di-replace |
| Fork pakai Tailwind **v3** | **Tetap v3.** Migrasi ke v4 = rewrite config + directive + plugin, bisa makan waktu seminggu tanpa nilai visual. Mini project juga v3 agar konsisten. |
| Fork Next `16.2`, Sutan Next `16.4` | Minor; pakai versi fork |
| Fork `next-intl` sudah ada | Bilingual jadi murah, bukan fitur baru |
| Fork `defaultLocale = 'en'` + auto-detect `accept-language` | Harus dibalik: default selalu `id`, berubah hanya kalau user toggle |
| Target HP + koneksi lambat | Wajib: degradation plan (§9) |
| API key = secret | Tidak ada fitur yang butuh key yang tidak bisa diopsikan |
| Tidak ada Vercel CLI di mesin ini | Deploy lewat **Git integration** (push → auto-deploy), bukan CLI |
| PowerShell memblokir `npm.ps1` | Selalu panggil `npm.cmd` |
| Fork `.npmrc` = `legacy-peer-deps=true` | Wajib ikut |

---

## 4. Pendekatan: Fork & Re-skin

```
1. git clone  https://github.com/Arfazrll/PersonalBlog.git  →  C:\Users\lenovo\portofolio-v3
2. Ganti git remote origin → repo baru milik Sutan (github.com/sutannn7/sutan-akbar-portfolio)
3. Hapus konten & rute yang tidak dipakai (§5)
4. Tulis ulang data: src/data/portfolio.ts (§6)
5. Tulis ulang i18n: messages/id.json, messages/en.json (§7)
6. Ganti tema: tailwind.config.ts + styles/globals.css (§8)
7. Ganti aset: public/ (screenshot, PDF CV, logo, favicon, OG image)
8. Verifikasi build + audit tidak ada sisa konten "Arfazrll"/"Syahril"
```

**Rute pemeliharaan:** fork = `upstream`, repo Sutan = `origin`. Kalau perlu fitur dari upstream: `git fetch upstream && git cherry-pick`. Pola klasik vendor, bukan submodule.

**Yang tidak boleh terjadi:** commit langsung ke `upstream`.

---

## 5. Peta Rute & Apa yang IKUT / BUANG

### 5.1 Rute akhir

| Rute | Status | Isi |
|---|---|---|
| `/` | IKUT (rebuild) | Hero 3D + headline split, marquee, stats, 3 disciplines, featured projects, journey preview, repo GitHub, milestones, CTA |
| `/projects` | IKUT | 4 proyek utama, filter **teknologi**, halaman detail |
| `/lab` | **BARU** | Grid mini project + detail |
| `/skills` | IKUT | Grup skill + badge level + soft skill |
| `/about` | **BARU** (fork tidak punya) | Bio, pendidikan, milestones, timeline perjalanan |
| `/contact` | IKUT | Kontak langsung saja: WhatsApp, email, LinkedIn, GitHub. **Tanpa form** |
| `/resume` | IKUT (sederhana) | Download CV + embed PDF ringan |
| `/blog` | **BUANG** | Mini project lab dipilih sebagai media tumbuh |
| `/gallery` | **BUANG** | Foto pribadi orang lain |
| `/achievements` | **BUANG** | Digabung jadi bagian "Milestones" di `/about` |
| `/api/chat` | **BUANG** | Butuh API key LLM + RAG — §13.3 |
| `/api/contact` (nodemailer) | **BUANG** | Butuh secret Gmail SMTP. Form opsional via Formspree — §13 |
| `/api/*` (WakaTime, GitHub GraphQL) | **BUANG** | Diganti public GitHub REST tanpa token (§6.4) |

> Fork tidak punya `/about` dan `/lab` — keduanya pekerjaan baru, bukan adaptasi.

### 5.2 Komponen yang dibuang / dipangkas

- `ChatBot` + `/api/chat` — lihat §13.3
- `/api/contact` (nodemailer + `EMAIL_USER`/`EMAIL_APP_PASSWORD`) + dependency `nodemailer` — form contact tidak dipakai (§13.4)
- Semua komponen WakaTime (`CodeRuntimeActivity`)
- `KaggleProfile` / `VerifiedKaggle`
- `OpenSourceSection` → **digabung** dengan blok activity jadi satu blok "Repo GitHub" (§6.4)
- `GalleryPage` + semua foto di `public/gallery/`
- `blog/` + keys blog di `messages` + pipeline MDX/shiki
- `CertificateHeroScroll` (sertifikat orang lain) → diganti **Milestones**
- `Spline` (`@splinetool/*`) — berat, tidak berkontribusi apa-apa
- `Hyperspeed` (shader `ogl`) — digantikan name plate (§8.4)
- `SkillRadar` (chart) — diganti daftar badge (§6.3)
- `matter-js`, `ogl`, `tsparticles`, `aos` — hapus dari `package.json` **hanya kalau** memang tidak di-import. Kalau masih di-import, biarkan; jangan refactor yang tidak perlu.
- `getProjectImages` (server action yang scan filesystem) → diganti **path eksplisit** di `portfolio.ts`
- Semua `public/project/*.webp` dan `public/certificate/*` milik orang lain
- `remotePatterns` untuk `images.unsplash.com` & `assets.aceternity.com` di `next.config.ts` → semua aset jadi lokal

### 5.3 Komponen yang DIJAGA (inti dari "kayak gitu")

- `arc-preloader-hero` / `LoadingScreen` → versi ≤1.2s, bisa skip, respect reduced-motion
- `Scene3D` → dipakai ulang sebagai **3D name plate** (§8.4)
- `TextPressure`, `ScrollReveal`, `ClickSpark` (opsional, dimatikan di low-end)
- `StatsSection`, `ExpertiseSection` (3 disciplines), `CTASection`
- `ProjectDetail` / `ProjectPageContent` / `TechStack`
- `ExperienceStickyScroll` (timeline) — adaptasi
- `SmoothScrollProvider` (Lenis), `ThemeProvider` (next-themes), `I18nProvider` (next-intl)
- `usePerformance`, `useIsMobile`, `useCountUp`, `useInView`

### 5.4 Keputusan saya dari builder check

| # | Pertanyaan | Keputusan | Alasan |
|---|---|---|---|
| 1 | Di mana konten & terjemahan hidup? | `portfolio.ts` = konten (field prosa punya pasangan ID/EN), `messages/*.json` = label UI saja | Satu sumber (§6.1) tetap terjaga; komponen baca konten via import biasa, bukan `useTranslations()` |
| 2 | Hero: shader atau name plate? | **3D name plate** (R3F), shader dibuang | Shader full-screen melawan keterbacaan headline; name plate personal & hemat dep (`ogl` keluar) |
| 3 | Standar tiap mini project | **Satu keputusan teknis fokus per project**, bukan semua fitur di daftar | 3 app penuh = sebesar situs utama; fokus = signal lebih jelas |
| 4 | Isi `/projects` & `/lab` | Dua array terpisah, dua kartu berbeda; `/projects` filter **teknologi** (filter kategori menghasilkan 1 item) | 4 proyek/3 kategori = filter kategori tak berguna |
| 5 | Blok GitHub | **Daftar repo ringkas** (nama, deskripsi, stars, update terakhir). Heatmap contribution DIBUANG | Akun masih 6 repo publik → heatmap kosong = persis "halaman kosong" yang dilarang §2 |
| 6 | Skills | Badge teks (`dasar` / `nanodua` / `mahir`), **tanpa radar chart** | Radar butuh angka presisi palsu; soft skill dipisah, tanpa level |
| 7 | Contact | WA + email + LinkedIn = cara utama; form hanya kalau Formspree ID diberikan | Menghapus kebutuhan secret (nodemailer) |
| 8 | Screenshot | Pakai yang sudah ada (`public/projects/polsri.jpg`, `kopi.jpg` di repo lama) + screenshot baru untuk LearnEase & mini project | Tidak ada alasan bikin gambar placeholder |
| 9 | Kategori proyek #2 | **"Web"**, bukan "Full-stack" | "Full-stack" = klaim posisi kedua, padahal satu-satunya positioning sudah Frontend Engineer |
| 10 | Default locale | Selalu `id`; EN hanya kalau user toggle (hapus auto-detect `accept-language`) | Browser `en-US` tidak boleh memaksa situs berbahasa ID |
| 11 | GitHub token | Public REST, tanpa secret (env token opsional) | Tidak ada fitur yang gagal total tanpa secret |

---

## 6. Model Data

### 6.1 Sumber tunggal

`src/data/portfolio.ts` — **satu-satunya sumber kebenaran** untuk konten. Semua section, stats, dan halaman detail membacanya. Stats dihitung dari data, bukan ditulis manual, supaya tidak bisa basi.

### 6.2 Bentuk data

```ts
type Localized = { id: string; en: string }

type PortfolioData = {
  personal: {
    name: string
    title: Localized          // id: "Frontend Engineer" / en: "Frontend Engineer"
    subtitle: Localized
    bio: Localized
    avatar: string
    location: string
    email: string
    phone: string
    resumeUrl: string
    links: { label: string; url: string; icon: string }[]
    languages: { name: string; level: string }[]
  }
  projects: Project[]
  lab: LabProject[]
  skills: { group: string; items: { name: string; badge: 'dasar' | 'nanodua' | 'mahir' }[] }[]
  softSkills: string[]
  milestones: { year: string; title: Localized; description: Localized; href?: string }[]
  journey: { year: string; title: Localized; org: Localized; points: Localized[] }[]
  stats: { label: Localized; value: number; suffix?: string }[]
}
```

> EN untuk prosa panjang boleh lebih ringkas daripada ID. EN untuk judul, label, dan tombol harus lengkap.

### 6.3 Isi nyata

**personal**
- name: `Sutan Akbar Dwi Nugraha`
- title: `Frontend Engineer`
- subtitle (ID): `Frontend Engineer — antarmuka yang ringan, kode yang rapi, dan produk yang jalan di HP orang.`
- subtitle (EN): `Frontend Engineer — lightweight interfaces, clean code, and products that work on a phone.`
- location: `Palembang, Indonesia`
- email: `Akbarcool998@gmail.com`
- phone: `0857-5829-2876`
- links: GitHub `github.com/sutannn7`, LinkedIn `linkedin.com/in/sutan-akbar-dwi-nugraha-193010442`, WhatsApp `wa.me/6285758292876`, Email
- languages: Indonesia (Aktif), Inggris (Pasif)

**projects** (urutan = urutan tampil, paling kuat dulu)

| # | Judul | Kategori | Peran | Tahun | Repo | Demo |
|---|---|---|---|---|---|---|
| 1 | LearnEase — Redesign UI/UX LMS POLSRI | UI/UX & Frontend | Developer, tim 5 orang | 2026 | github.com/sutannn7/polsri-lms-frontend | polsri-lms-frontend.vercel.app |
| 2 | Website Profil Jurusan MI POLSRI | Web | Mandiri | 2026 | github.com/sutannn7/web-informatika-mi-polsri | — (tanpa demo) |
| 3 | Nusantara Kopi | Frontend | Tim 4 orang, Event SINTAK | 2025 | — | nusantara-kopi.vercel.app |
| 4 | Portofolio Pribadi (v3 ini) | Frontend | Mandiri | 2026 | github.com/sutannn7/sutan-akbar-portfolio | — |

> Proyek #1 = centerpiece. `longDescription`-nya wajib memuat **proses**: audit 8 halaman → design token → dark mode → 7 halaman prototipe → test runner → verifikasi headless Chrome → usulan perubahan UI/UX ke moyar. Bukan cuma daftar teknologi.
>
> Proyek #2 tidak punya demo live (PHP native + MySQL). Kartu **tidak boleh** menampilkan tombol demo — hanya link repo + screenshot.

**lab** — 3 mini project (§10). Field: `slug, title, tagline: Localized, problem: Localized, decision: Localized, techStack[], repoUrl, demoUrl, year`

**skills** — dari CV, apa adanya, tidak boleh mengarang proficiency:

| Group | Items |
|---|---|
| Frontend & Web | HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS, Bootstrap |
| Backend & Data | PHP (Native), MySQL, Node.js, Oracle (dasar) |
| Mobile & Bahasa | Android Studio, Java, Python, C++ |
| Analisis Sistem | UML, ERD, DFD |
| Tools | VS Code, Vite, Git, GitHub, XAMPP, phpMyAdmin |

> Badge level: `dasar` / `nanodua` / `mahir`. Diisi jujur — default `nanodua`, `dasar` untuk yang disebut "dasar" di CV (TypeScript, Oracle, jaringan, Excel), `mahir` hanya untuk yang dipakai harian (HTML, CSS, JavaScript, PHP, MySQL, Git).
>
> **softSkills** (tanpa level): Kerja tim & kepemimpinan, Komunikasi & negosiasi, Pengambilan keputusan, Berpikir kritis, Kreatif, Bertanggung jawab.
>
> **Patch CV (dikerjakan di fase 6, pakai pola `update_cv.py` yang sudah ada):**
> - `Next.js (dasar)` → `Next.js` — portofoliomu Next.js 16 App Router + TypeScript + Tailwind + Framer Motion + GSAP + Three.js
> - `TypeScript (dasar)` → `TypeScript`
> - Tambah di Tools: `Node.js test runner, Chrome headless` — itu bukti LearnEase yang tidak pernah disebut
> - Ganti URL portofolio lama dengan URL v3
> - Baris ringkasan: tambah yang menyebut 3 proyek web live + redesign UI/UX LMS (audit 8 halaman → prototipe → pengujian otomatis → usulan ke moyar), dan hapus "satu website portofolio berbasis Next.js" yang akan jadi dobel dengan v3 ini

**milestones**
1. `2026` — IPK 3,55 / 4,00 (D-IV Manajemen Informatika, hingga Semester 4)
2. `2022` — Juara 1 Lomba E-Sport PUBG Mobile — MADAGASCAR HUT RI ke-77 (ketua tim: strategi & pembagian peran)
3. `2024–sekarang` — Mahasiswa aktif D-IV Manajemen Informatika, Politeknik Negeri Sriwijaya
4. `2025–sekarang` — Pemimpin tim pada 4 proyek kolaboratif yang dipublikasikan online
5. `2026` — 3 proyek web dipublikasikan online (1 mandiri, 1 tim 4 orang, 1 tim 5 orang)

**journey** (timeline, dibaca sebagai cerita berkembang)
- 2021–2024 — SMA Negeri 10 Palembang: gitaris band, tampil di pentas seni dan lomba 17 Agustus
- 2024 — Mulai D-IV Manajemen Informatika, POLSRI: dasar web, analisis sistem, basis data
- 2025 — Nusantara Kopi: frontend, tim 4 orang, live di Vercel
- 2026 — Website Jurusan: proyek web mandiri (PHP native + MySQL)
- 2026 — LearnEase: redesign UI/UX LMS, tim 5 orang, termasuk pengujian otomatis
- 2026 — Portofolio v3: Next.js 16 + Three.js + Framer Motion

**stats** — WAJIB dihitung dari data (`projects.length`, proyek yang punya `demoUrl`, `lab.length`, tahun aktif), tidak boleh hard-code.

### 6.4 Blok Repo GitHub

Satu blok di homepage (bukan dua). Isinya: daftar repo publik dari `GET /users/sutannn7/repos?sort=updated` — nama, deskripsi, stars, bahasa, tanggal update terakhir. Maksimal 6 repo, link "Lihat semua di GitHub".

Heatmap contribution, WakaTime, dan statistik runtime **tidak** dipakai: akun masih muda, jadi blok itu akan kosong — persis yang dilarang §2.

Kalau request GitHub gagal: tampilkan link GitHub statis, jangan blank.

---

## 7. Bahasa (i18n)

- Default: **selalu `id`**. EN hanya kalau user toggle. Auto-detect `accept-language` **dimatikan** (`src/i18n/settings.ts` → `defaultLocale = 'id'`; `src/lib/i18n.ts` → jangan fallback ke header).
- Toggle ada di navbar, persist ke cookie.
- **Pemagian konten:**
  - `messages/id.json` + `messages/en.json` = **label UI saja** (nav, tombol, section heading generik, placeholder form).
  - `src/data/portfolio.ts` = **konten** (nama, deskripsi proyek, milestone, journey, skill). Field prosa punya pasangan `{ id, en }`.
- Tidak ada teks konten yang dikunci di komponen.

---

## 8. Arah Visual

> Detail implementasi mengikuti house style `design-taste-frontend`. Bagian ini adalah **keputusan yang sudah dikunci**, bukan saran.

### 8.1 Mode

Dark **default**, light mode tersedia (toggle, next-themes, `darkMode: 'class'`). Keduanya wajib lolos WCAG AA untuk body text.

### 8.2 Palet

Sistem tetap HSL CSS-variable seperti fork (`hsl(var(--background))`), tapi nilainya diganti.

**Dark (default)**

| Token | HSL | Hex |
|---|---|---|
| `--background` | `240 10% 4%` | `#08080C` |
| `--card` | `240 8% 7%` | `#101016` |
| `--muted` | `240 7% 13%` | `#1C1C24` |
| `--border` | `240 10% 18%` | `#24242E` |
| `--foreground` | `240 20% 95%` | `#F2F2F5` |
| `--muted-foreground` | `240 8% 62%` | `#94949F` |
| `--primary` | `74 100% 63%` | `#C8F246` (lime) |
| `--primary-foreground` | `240 10% 5%` | `#0A0A0F` |
| `--accent` | `190 100% 60%` | `#33D6FF` (cyan — khusus chart & kode) |

**Light**

| Token | HSL | Hex |
|---|---|---|
| `--background` | `0 0% 99%` | `#FAFAFB` |
| `--card` | `0 0% 100%` | `#FFFFFF` |
| `--muted` | `240 10% 95%` | `#F0F0F4` |
| `--border` | `240 10% 88%` | `#E2E2E8` |
| `--foreground` | `240 12% 8%` | `#111114` |
| `--muted-foreground` | `240 6% 42%` | `#66666F` |
| `--primary` | `74 100% 63%` | `#C8F246` (sama) |
| `--primary-foreground` | `240 10% 5%` | `#0A0A0F` |

**Aturan kunci lime (`#C8F246`):** lime tidak boleh jadi warna teks di light mode (kontras gagal). Di light mode lime hanya boleh sebagai **fill** (tombol, badge, garis) dengan `primary-foreground` di atasnya. Di dark mode lime boleh jadi teks.

Chart/data: lime, cyan `#33D6FF`, violet `#8B5CF6`, amber `#FBBF24`. Tidak ada gradien 3-warna neon + pink soup seperti default fork.

### 8.3 Tipografi

- **Inter** — body & UI. **JetBrains Mono** — label, eyebrow, kode, angka.
- Hapus `Playfair_Display` dan `Alex_Brush` dari fork (2 font ekstra tanpa fungsi).
- Hero: `clamp(3rem, 11vw, 10rem)`, weight 500, letter-spacing `-0.045em`, line-height `0.88`.
- Eyebrow/label: mono, uppercase, `0.72rem`, tracking `0.22em`, `muted-foreground`.
- Body max `68ch`.

### 8.4 Hero

```
[eyebrow: PALEMBANG · FRONTEND ENGINEER]
FRONT
END
ENGINEER
[sub: Antarmuka yang ringan, kode yang rapi, dan produk yang jalan di HP orang.]
[scroll hint]
```

- Kata dipecah 3 baris, reveal per baris (GSAP/Framer), stagger.
- **Visual utama: 3D name plate.** Satu `Canvas` R3F berisi slab kaca (rounded box + `MeshPhysicalMaterial`) yang melayang, berotasi halus, dan bergerak mengikuti kursor (spring). **Teks nama & peran digambar sebagai HTML overlay**, bukan teks 3D — supaya tajam, selectable, bisa dibaca screen reader, dan tidak butuh SDF font.
- **Latar belakang: CSS/SVG animated grid + grain.** Bukan shader full-screen — shader full-screen justru melawan keterbacaan headline dan boros budget.
- Shader `Hyperspeed`/`ogl` **dibuang** (§5.4 #2).
- Preloader/arc-loader: ≤1.2s, bisa di-skip lewat klik atau Escape, respect `prefers-reduced-motion`, dan tidak pernah menutupi konten lebih lama.
- Kalau `usePerformance` = `low`, Canvas tidak dirender sama sekali; diganti plate CSS statis dengan parallax transform.

### 8.5 Tiga Disciplines

Section "Three disciplines, one engineer" di referensi dipetakan ulang:

```
INTERFACE CRAFT     → pixel detail, tipografi, animasi, aksesibilitas
FRONTEND SYSTEMS    → React/Next, state, API, optimasi, tooling
PRODUCT THINKING   → dari kebutuhan user → keputusan teknis
```

### 8.6 Motion

- Framer Motion untuk transisi dan micro-interaction; GSAP ScrollTrigger untuk scroll-linked; Lenis untuk smooth scroll.
- Semua motion respect `prefers-reduced-motion: reduce` → statis, tanpa GSAP/Lenis.
- `usePerformance` (dari fork) menentukan tier: `low` → matikan Canvas, ClickSpark, marquee, dan pakai transisi fade sederhana.

---

## 9. Degradation & Performa

| Kondisi | Yang dimatikan |
|---|---|
| `prefers-reduced-motion` | GSAP scroll, Lenis, marquee, autoplay, click spark |
| Perangkat low-end / mobile (`usePerformance`) | Canvas R3F, postprocessing, particles |
| Gagal load GitHub API | Blok repo → link GitHub statis |
| Gagal load form | Tampilkan link mailto/WA sebagai ganti |
| JS gagal total | Konten tetap terbaca (SSR) |

Target: LCP < 2.5s di 4G, bundle route utama < 200KB gzip, CLS < 0.1.

---

## 10. Mini Project Lab (3 starter)

Tiap mini project = **repo GitHub sendiri** + **deploy Vercel sendiri** + **kartu di `/lab`**.
Lokasi disk: `C:\Users\lenovo\miniprojects\<slug>`. Stack: **Next.js 16 + TypeScript + Tailwind v3** (konsisten dengan situs utama), tanpa deps berat.

**Standar tiap project (§5.4 #3): satu keputusan teknis fokus, bukan semua fitur di daftar.**

| # | Slug | Masalah | Keputusan fokus yang ditampilkan | Yang **tidak** dikerjakan |
|---|---|---|---|---|
| 1 | `command-palette` | Pencarian cepat di UI padat | Keyboard navigation + fuzzy match + ARIA combobox | tidak ada indeks besar, tidak ada fuzzy scoring yang rumit |
| 2 | `token-playground` | Design token statis sulit di-debug | Live edit token → CSS variables → preview real-time | tidak ada multi-preset, tidak ada ekspor |
| 3 | `onboarding-flow` | Form panjang = sumber error user | Multi-step + validasi per langkah + error UX | tidak ada draft persistence, tidak ada auth |

Setiap mini project wajib punya:
- README: 1 paragraf masalah → 1 paragraf keputusan teknis → cara run
- `demoUrl` (Vercel) + `repoUrl` (GitHub)
- 1 screenshot untuk kartu `/lab`
- Deskripsi di `portfolio.ts` maksimal 3 kalimat

---

## 11. Aset & Lisensi

- `LICENSE` fork **tetap apa adanya** (MIT, © 2026 S. A. Almazril).
- README versi Sutan wajib berisi: **credit ke `Arfazrll/PersonalBlog` (MIT)** + link ke lisensi.
- Footer situs: link kecil "Built on MIT-licensed open source" → repo upstream. Ini perlindungan untuk "substantial portions".
- `public/` — hapus seluruh aset orang lain, isi dengan:
  - logo/inisial Sutan (SVG), favicon, OG image
  - screenshot: `polsri.jpg` & `kopi.jpg` (sudah ada di repo lama `portofolio-nextjs/public/projects/`) + screenshot baru LearnEase + 3 mini project
  - `cv.pdf` — hasil konversi dari DOCX CV final (Word 16.0 terpasang, bisa konversi lokal)
- Tidak ada foto orang lain. Avatar = **monogram inisial** (konsisten dengan name plate 3D), kecuali Sutan menyediakan foto (§13).

---

## 12. Fase Pelaksanaan (ringkas)

| Fase | Isi | Output |
|---|---|---|
| 0 | Fork repo, set remote, bersihkan konten & rute | Repo jalan, `npm.cmd run dev` bisa |
| 1 | `portfolio.ts` + i18n + tema + aset | Homepage render dengan data Sutan |
| 2 | Rute `/projects`, `/skills`, `/about`, `/contact`, `/resume` | Semua route berfungsi |
| 3 | 3 mini project: repo terpisah + deploy | `/lab` punya isi nyata |
| 4 | Audit: tidak ada sisa konten orang lain, semua link hidup | Checklist audit hijau |
| 5 | Deploy Vercel (Git integration) → URL final | Live, URL stabil |
| 6 | `cv.pdf` dari DOCX CV final; CV disetel ulang ke URL v3 + patch skill list | CV + situs konsisten |

> **Critical path = fase 5 → 6.** URL portofolio dicetak di CV yang diajukan, jadi deploy harus selesai **sebelum** CV dibekukan.
>
> **Kalau tenggat mepet:** `/lab` **dibuang seluruhnya** (route + section), bukan dikirim kosong. Section kosong = sinyal "situsnya belum jadi". `/lab` ditambahkan setelah 3 mini project live.

---

## 13. Keputusan Final (dijawab Sutan, 2026-10-21)

1. **Siklus & tenggat** — magang Februari–Mei (2027). **URL portofolio dicetak di CV yang diajukan.**
   - Konsekuensi: deploy harus selesai sebelum CV dibekukan (fase 5 → 6). `/lab` tidak boleh dikirim kosong; kalau tenggat mepet, `/lab` dibuang dan ditambahkan belakangan.
   - Sumber CV: `CV_Sutan_Akbar_Dwi_Nugraha_Update_LearnEase.docx` (21/10/2026) sebagai basis, diedit pakai pola `update_cv.py` yang sudah ada di repo `Proyek Bawaan`.
2. **Domain — FINAL (keputusan Sutan, 21/10/2026):** `https://sutan-akbar.vercel.app`. Tetap Vercel, tanpa domain sendiri. Project Vercel `sutan-akbar` sudah dibuat Sutan; URL ini yang dicetak di CV. **Situs lama tetap online** sampai v3 terverifikasi.
3. **Chatbot AI — tidak dibangun.** *(disetujui Sutan 2026-10-21)* Komponen `ChatBot` + `/api/chat` dihapus saat cleanup. Kalau nanti mau, bisa di-*cherry-pick* dari `upstream` tanpa ganggu bagian lain. Efeknya: tidak pernah ada `GROQ_API_KEY`/`GEMINI_API_KEY` yang harus dikelola, dan tidak ada biaya API.
4. **Form kontak — tidak ada form.** `/contact` = WhatsApp + email + LinkedIn + GitHub. Route `/api/contact` (nodemailer) dan dependency `nodemailer` dihapus. Nol secret yang harus dikelola.

---

## 14. Yang Builder Boleh Putuskan Sendiri

- Struktur internal komponen, penamaan file, urutan import
- Library tambahan kecil **hanya** kalau benar-benar perlu dan belum ada di fork
- Token CSS tambahan di dalam palet yang sudah dikunci (misal `--surface-2`)
- Detail copywriting dalam batas makna yang dikunci di sini (bahasa ID, nada: lugas, teknis, tanpa jargon marketing)
- Detail spacing dan animasi yang tidak bertentangan dengan §8

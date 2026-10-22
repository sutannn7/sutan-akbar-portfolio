# SDD ledger — plan: docs/superpowers/plans/2026-10-21-portfolio-v3-main-site.md

## 🔴, RESUME — 22/10/2026 malam (setelah Task 11 sebagian)

**Status sekarang:**
- Branch **`main`** (renamed dari `feature/v3-reskin`), HEAD `b041781`, working tree bersih.
- **Sudah di-push** ke `origin` = `sutannn7/sutan-akbar-portfolio` → `refs/heads/main` = `b041781`. Repo sebelumnya shallow → sudah di-`git fetch --unshallow upstream` (378 commit) karena push ditolak GitHub (`index-pack failed`).
- Test **54/54 hijau** (13 file), typecheck **0 error**, `next build` sukses (12/12 halaman).
- 7 route terverifikasi di browser headless (1440×900), **0 console error**: `/`, `/projects`, `/projects/learnease`, `/skills`, `/about`, `/contact`, `/resume`.

**Sudah dikerjakan pada sesi ini:**
1. **Task 9** (`/projects`) — grid kartu + filter 16 chip, detail page locale-aware. Commit `9444e51`.
2. **Task 10** (`/skills`, `/about`, `/contact`, `/resume`) — 4 route ditulis ulang dari nol sebagai Server Component. `contact.form` + `hero.ticker` dihapus dari kedua file messages, 2 jawaban FAQ diubah (tidak lagi menyebut formulir). `public/cv.pdf` dibuat dari `CV_Sutan_Akbar_Dwi_Nugraha_Update_LearnEase.docx` via Word COM (format 17). Commit `6298d8d`.
3. **Task 11 (bagian lokal)** — sapu 39 file yatim (8.068 baris) + 7 package (`@splinetool/react-spline`, 2 radix, cva, gl-matrix, mini-svg-data-uri, react-tooltip), `src/types/global.d.ts` (shim spline) dihapus. Commit `b041781`.
4. **CV dipatch** → `sutan-akbar.vercel.app` + `github.com/sutannn7/sutan-akbar-portfolio` (5 text node), PDF di-regenerate. Sumber: `C:\Users\lenovo\Downloads\CV_Sutan_Akbar_Dwi_Nugraha_Final.docx`.

**Yang MENUNGGU Sutan (tidak bisa dari sini):**
- Connect `sutannn7/sutan-akbar-portfolio` → project Vercel `sutan-akbar`: Settings → Git → Connect Git Repository → Redeploy.
- Env di project Vercel `sutan-akbar`: `NEXT_PUBLIC_GITHUB_USERNAME=sutannn7` (blok GitHub di homepage pakai ini).
- Hapus 3 repo kosong di GitHub (Settings → Danger Zone): `sutan-command-palette`, `sutan-token-playground`, `sutan-onboarding-flow` (repo ke-3 ada typo "onbarding"). `gh` tidak punya scope `delete_repo`. Sampai dihapus, ketiganya muncul di blok GitHub homepage.
- Setelah deploy: cek 4 URL mengembalikan 200 — `sutan-akbar.vercel.app`, `polsri-lms-frontend.vercel.app`, `nusantara-kopi.vercel.app`, + repo `sutan-akbar-portfolio`.

**Catatan animasi (Ruling 30):** efek scroll TIDAK boleh hilang di route yang ditulis ulang. Navbar sudah hide-on-scroll (scroll bawah → sembunyi, scroll atas → muncul). Section-level reveal pakai 1 komponen `src/components/ui/Reveal.tsx` (client, fade + naik 24px, `viewport once`, hormati `prefers-reduced-motion`). Halaman yang memakai: `/skills`, `/about`, `/contact`, `/resume`. Content reveal homepage sudah punya sendiri (`whileInView`).

**Sapu aset publik (Ruling 31):** audit `public/` vs referensi di `src/` menemukan **131 file (45,7 MB) yang tidak dirujuk kode sama sekali** tapi tetap ikut ter-deploy ke Vercel dan ter-commit ke repo publik. Termasuk `public/about/arfazrll.webp` (**foto penulis asli**, 1,2 MB) dan `public/certificate/` (**31 sertifikat** — "Dasar Artificial Intelligence", "Generative AI", "Machine Learning Foundations", "elevAIte", dll) plus `public/gallery/`, `public/journey/`, `public/experience/`, `public/lanyard/` (2,4 MB), `public/assets/` (23 logo perusahaan), `public/project/`, `public/feature/`. Semua dihapus. `public/` sekarang 6 file, 0,8 MB: `cv.pdf`, `favicon.svg`, `noise.svg`, `projects/{learnease,polsri,kopi}.jpg`.

**Slot foto profil (menunggu Sutan):** `portfolioData.personal.avatar` → `/avatar.jpg`. `src/components/ui/ProfileAvatar.tsx` cek keberadaan file saat render; kalau belum ada → monogram inisial "SA" (bukan gambar tiruan). Slot sudah dipasang di atas judul `/about`. Cara supplying foto: taruh file di `public/avatar.jpg` (format jpg/png/webp, potret, ≥800px).

**Bug 404 diperbaiki:** `QuantumError.tsx` memakai `useState(new Date())` → jam render berbeda antara server dan client → hydration error di halaman 404 (terbukti di browser: "21.06.16" vs "21.06.14"). Sekarang jam hanya tampil setelah mount, placeholder `--.--.--` sebelum itu.


## ⏸ RESUME — 22/10/2026 sore (Sutan pulang, lanjut dari rumah)

**Lanjut dari:** Task 7 fix round 2 (5 cacat visual di hero) — subagent sedang jalan saat sesi ditutup. Cek dulu `git log` + `git status`: kalau ada commit `fix: ...` untuk hero, itu hasilnya; kalau working tree kotor, `git diff` dulu sebelum lanjut.

**Status saat sesi ditutup:**
- Branch `feature/v3-reskin`, HEAD `76e5136` (chore: AGENTS.md).
- Test **44/44 hijau** (10 file). Typecheck **9 error** — semuanya TS2307 "Cannot find module" di file milik Task 8–10 (`contact/page.tsx` → Lanyard, `projects/page.tsx` + `projects/[slug]/page.tsx` → getProjectImages ×2, `resume/page.tsx` → pdf-viewer, `skills/page.tsx` → SplineScene, `AboutSection.tsx` → 4 showcase module). Itu **disengaja** — build belum hijau sampai Task 10.
- **Sudah di-deploy? belum.** Repo GitHub `sutannn7/sutan-akbar-portfolio` masih kosong; branch belum di-push. Vercel project `sutan-akbar` ada tapi belum connect repo → masih 404.

**Urutan sisa:**
1. **Task 7 fix round 2** (jika belum selesai) → screenshot ulang → pastikan 5 cacat visual hilang.
2. **Task 8** — section homepage. Brief: `.superpowers/sdd/2026-10-21-portfolio-v3-main-site/task-8-brief.md` (232 baris, siap). Addendum wajib (lihat "Addendum Task 8" di bawah).
3. **Task 9** (rute `/projects`) → **Task 10** (`/skills`, `/about`, `/contact`, `/resume`) → **Task 11** (audit + deploy + update CV).
4. Lalu Plan 2/3/4 (3 mini project terpisah) → Plan 5 (rute `/lab`).

**PENTING — dua aturan baru (Ruling 26 & 28):**
- **Cek browser wajib** tiap task visual: jalankan `npm.cmd run dev`, ambil screenshot Chrome headless, **buka gambarnya dan lihat**. Dua bug fatal lolos review statis (Footer crash total + R3F crash). Rulik tech: `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe --headless=new --disable-gpu --no-sandbox --hide-scrollbars --user-data-dir=<tmp> --virtual-time-budget=20000 --window-size=1440,1000 --screenshot=<out.png> <url>`. **Restart dev server + hapus `.next`** kalau masih error lama (HMR sering stale).
- **Jangan pernah `git add -A` / `git commit -a`** selama subagent implementer jalan di repo yang sama. Selalu path eksplisit. (Sudah pernah kejadian sekali — Ruling 25.)

**Mesin:** `C:\Users\lenovo\portofolio-v3` · remote `origin` = `sutannn7/sutan-akbar-portfolio`, `upstream` = `Arfazrll/PersonalBlog` · Node v22.15.1 · selalu `npm.cmd` (PowerShell memblokir `npm.ps1`) · commit tanpa global git user: `git -c user.name="opencode" -c user.email="opencode@local" commit -m "..."`.

**Yang MENUNGGU tindakan Sutan (tidak bisa dikerjakan dari sini):** connect 4 repo ke 4 project Vercel — Settings → Git → Connect Git Repository → Redeploy. Detail di tabel "Checklist yang MENUNGGU TINDAKAN Sutan". Project Vercel `sutan-akbar` juga butuh env `NEXT_PUBLIC_GITHUB_USERNAME=sutannn7`.

**Addendum Task 8 (wajib ikut, sudah diketahui dari temuan browser):**
- `src/app/page.tsx` **write-override** (Ruling 4): blok hero dari Task 7 **tidak boleh diubah**, hanya dikelilingi section baru.
- Task 8 **tidak boleh** memakai `useTranslations` yang di-scope ke namespace yang tidak ada — pakai guard `src/i18n/message-keys.test.ts` (sudah ada) sebagai pagar.
- `AboutSection.tsx` Step 9: `about.leadIn.*` + `about.profile.narrative*` dipindah dari `messages/*.json` ke `portfolio.ts`, lalu key dihapus dari **kedua** file.
- `contact.faqData` (list di `messages/*.json`) masih berisi klaim terlarang ("Kecerdasan Buatan", "Full-stack Development", "riset AI", "TensorFlow, PyTorch, YOLO") → itu **Task 10**, bukan Task 8.

## ⏸ RESUME — 22/10/2026 (sesi berhenti, Sutan tidur)

**Lanjut dari:** Task 2d — brief sudah dibuat di `.superpowers/sdd/2026-10-21-portfolio-v3-main-site/task-2d-brief.md`, tinggal dispatch.

**Urutan sisa:**
1. **Task 2d** — matici dead link ke `/blog`, `/gallery`, `/achievements`, `/experience` di 8 file + hapus message key yang jadi yatim.
2. **Review Task 5** — implementasi sudah selesai (commit `b920811`, 36/36 test, typecheck 13). Review sudah di-dispatch tapi belum keluar → kalau sesi baru, re-dispatch dengan brief `task-5-brief.md`, report `task-5-report.md`, diff `review-233ed0f..b920811.diff`. **Penting:** kalau reviewer menandai "namespace `achievements`/`experience` dihapus tapi component masih memanggilnya" → itu **BUKAN** temuan yang diperbaiki dengan men-add balik key; yang benar Task 2d yang membersihkan component-nya. Lihat Ruling 24.
3. **Task 6 → 7 → 8 → 9 → 10 → 11**, lalu Plan 2/3/4 (3 mini project), lalu Plan 5 (rute `/lab`).

**Cara melanjutkan:** buka sesi ini dan bilang "lanjut" — semua konteks ada di ledger ini + git history.

**Status repo saat berhenti:** branch `feature/v3-reskin`, HEAD `fd2e522`, working tree **bersih**. Test 36/36 hijau, typecheck 13 error (semua TS2307 di file milik Task 6–10 — disengaja, build sengaja rusak sampai Task 6).

Repo: `C:\Users\lenovo\portofolio-v3` · Remote `upstream` = Arfazrll/PersonalBlog, `origin` = sutannn7/sutan-akbar-portfolio
Spec: `docs/superpowers/specs/2026-10-21-portfolio-v3-design.md` (di dalam repo)
Workspace: `.superpowers/sdd/2026-10-21-portfolio-v3-main-site/`

## Status

| Task | Judul | Status |
|---|---|---|
| 1 | Repo hygiene, test bootstrap, spec masuk repo | **complete** (commit 341a6ef, review clean) |
| 2 | Pangkas rute, komponen, dependency | **complete** (commit 21e094a, review clean) |
| 2b | Pangkas komponen yatim + dependency sisa | **complete** (commit 54cf709, review clean) |
| 3 | Token desain, tema, konfigurasi Next | **complete** (commit 1878ad8, review clean, 0 temuan) |
| 4 | Model data + seluruh konten portofolio | **complete** (commit `183e4c9` + fix `357c284`, review clean) |
| 2c | Sapu sisa identitas fork | **complete** (commit `233ed0f`, review clean) |
| 5 | i18n — default ID + penulisan ulang messages | **complete** (commit `b920811` + rewrite Task 8/9/10, review clean, guard tanpa EXCLUDED)|
| 6 | Layout, navigasi, footer | **complete** (commit `cb0c672` + fix `45a5979` + `1c03e78`, review clean setelah 2 fix round) |
| 7 | Hero — split headline, 3D name plate, grid | **complete** (commit `57519f2` fix material RoundedBox, 5 cacat visual beres)|
| 8 | Section homepage | **complete** (commit `54100d2` + fix `9fae489` `8d6058d` `2ecf45a`)|
| 9 | Rute `/projects` | **complete** (commit `9444e51`, -2228 baris, browser terverifikasi)|
| 10 | Rute `/skills`, `/about`, `/contact`, `/resume` | **complete** (commit `6298d8d`, -1215 baris, browser terverifikasi)|
| 11 | Audit konten, deploy, penarikan CV | pending |

18. **Ruling — 4 project Vercel sudah dibuat Sutan (21/10/2026).** `sutan-akbar`, `sutan-command-palette`, `sutan-token-playground`, `sutan-onboarding-flow` — semua 4 sudah ada di akun Vercel Sutan, masing-masing dengan domain `*.vercel.app`, tapi **belum ada deployment** (semua 404 saat dicek). Konsekuensi: langkah deploy di plan utama + 3 plan mini diubah dari "bikin project baru" → "**connect repo yang sudah ada**" lewat **Settings → Git → Connect Git Repository** + **Deployments → Redeploy**. Bikin project baru akan gagal karena nama sudah dipakai. — Alasan: Sutan sudah membuatnya; tidak perlu bikin ulang. — Biaya kalau salah: 4 project Vercel perlu dihapus & dibuat ulang.

## Checklist yang MENUNGGU TINDAKAN Sutan

> Repo GitHub untuk keempat project **sudah ada** (21/10/2026): `sutannn7/sutan-akbar-portfolio`, `sutannn7/sutan-command-palette`, `sutannn7/sutan-token-playground`, `sutannn7/sutan-onboarding-flow` — semuanya publik & kosong. Sutan juga sudah membuat 4 project Vercel dengan domainnya. Tinggal connect repo → project Vercel, lalu Redeploy.

| Kapan | Apa | Detail |
|---|---|---|
| Task 11 Step 6 | Connect repo → Vercel `sutan-akbar` | Settings → Git → connect `sutannn7/sutan-akbar-portfolio` branch `main`; env `NEXT_PUBLIC_GITHUB_USERNAME=sutannn7`; Redeploy |
| Plan 2 Step 3 | Connect repo → Vercel `sutan-command-palette` | repo `sutannn7/sutan-command-palette` |
| Plan 3 Step 3 | Connect repo → Vercel `sutan-token-playground` | repo `sutannn7/sutan-token-playground` |
| Plan 4 Step 3 | Connect repo → Vercel `sutan-onboarding-flow` | repo `sutannn7/sutan-onboarding-flow` |

## Domain — FINAL

**`https://sutan-akbar.vercel.app`** (keputusan Sutan, 21/10/2026: "pakai vercel aja"). Tanpa domain sendiri. Ini yang dicetak di CV. Project Vercel `sutan-akbar` sudah ada; tinggal connect repo + Redeploy.

19. **Ruling — Task 4 boleh menyentuh file milik Task 6–10, sebatas adaptasi tipe.** Tipe `PortfolioData` baru menghapus array top-level `techStack` / `experiences` / `achievements`, jadi 18 consumer hidup (Navbar, Footer, HeroVisual, StatsSection, AboutSection, HardSkills, ToolsSection, projects/page, contact/page, skills/page, ProjectDetail, ProjectPageContent, TechStack, ProjectStats, brand-scroller, horizontal-scroll-carousel, stack-feature-section, IdentitySequence) **wajib** diadaptasi agar konsisten. Adaptasi mekanis itu sah — Task 6/8/9/10 tinggal书写 ulang di atasnya. Yang TIDAK boleh: Task 4 menyusun ulang halaman secara visual. Invariant "typecheck tetap 13 error" saya longgarkan: **tidak boleh melebihi 13, dan penurunan hanya sah bila errornya hilang karena file yang memang harus diadaptasi** (error `TS2307 Cannot find module` untuk modul yang sudah dihapus di Task 2).
20. **Ruling — 8 error syntax `TS1381/TS1382` di `ProjectDetail.tsx` & `ProjectPageContent.tsx` harus hilang.** Itu hasil edisi Task 4 (penggantian di dalam teks JSX merusak `>` / `}`). Kalau masih ada saat review → Critical, harus dibetulkan sebelum Task 9 lanjut.
21. **Ruling — 2 URL basi di `src/data/portfolio.ts` harus dikoreksi.** Brief Task 4 diekstrak SEBELUM rename, jadi datanya masih pakai URL lama:
    - `repoUrl` Portofolio v3: `https://github.com/sutannn7/portofolio-v3` → `https://github.com/sutannn7/sutan-akbar-portfolio`
    - `demoUrl` Portofolio v3: `https://sutannn7.vercel.app` → `https://sutan-akbar.vercel.app`

    Ini masuk fix round Task 4 (dibundel bareng temuan reviewer), bukan dibiarkan sampai Task 11 — URL ini yang akan tercetak di CV. — Biaya kalau salah: 2 baris.

22. **Ruling — spec §6.2 `stats` dihapus; §6.3 yang menang.** §6.2 mendaftarkan `stats` sebagai field `PortfolioData`, sedangkan §6.3 bilang stats **dihitung dari data** saat render. Dua-duanya tidak bisa benar: array `stats` yang disimpan bisa basi. Ruling: tidak ada field `stats` di tipe — angka statistik dihitung. Spec sudah dikoreksi (catatan eksplisit di §6.2).
23. **Ruling — spec §6.3 tabel proyek #4 dikoreksi.** Demo Portofolio v3 = `https://sutan-akbar.vercel.app` (bukan `—`), repo = `github.com/sutannn7/sutan-akbar-portfolio`. Nilai inilah yang dicetak di CV.

## Task 4 — hasil & temuan

- **Review 1: ❌ 3 Important + 4 Minor.** 3 Important: (a) klaim terlarang "AI Engineer & Software Engineer" + heading "AI & DATA" + kalimat hardcoded Inggris masih nempel di `HeroVisual.tsx` — test data-level nggak nyentuh copy komponen; (b) badge `mahir` overclaim di 19 item padahal spec §6.3 bilang `mahir` HANYA untuk {HTML, CSS, JS, PHP, MySQL, Git}; (c) `contact/page.tsx` render link twitter/discord/spotify → `href="#"` (dead link, anti-goal §2). 4 Minor: URL proyek #4 basi, tab mati di `ProjectDetail.tsx`, link ke `/experience` yang sudah dihapus, celah cakupan test.
- **Fix round 1/5** (commit `357c284`, 13 file): 7/7 temuan dikerjakan — `mahir` persis 6 item, `AI & DATA` + teks hardcoded dibuang (title/description sekarang dari `personal.title` + `personal.bio` lokal), baris social diturunkan dari `personal.links` (tanpa `href="#"`), `|| '#'` di `projects/page.tsx` dibuang, tab mati dibuang, `/experience` → `/about`, test tambah 5 assertion + scan komponen. Test 24 → **29/29**, typecheck **13 → 13**.
- Catatan: reviewer memverifikasi ulang bahwa 18 adaptasi consumer itu mekanis & benar, dan tipe datanya persis sama dengan spec.

## Task 2c — hasil

- **Review: ✅ Approved.** `src/proxy.ts` **dihapus** (bukan jadi middleware no-op) — ini bug paling serius di seluruh proyek: middleware itu mengarahkan **semua pengunjung HP ke `arfazrllworkspace.vercel.app`**, situs milik penulis fork. Kalau rekrut'er membuka URL CV dari HP, dia melihat situs orang lain.
- Dihapus juga: `public/Arfazrll_dark.svg`, `public/Arfazrll_light.svg`, `public/resume.pdf` (CV penulis fork).
- `src/app/layout.tsx` metadata → `Sutan Akbar — Frontend Engineer`, `metadataBase` → `https://sutan-akbar.vercel.app`, icons → `/favicon.svg`.
- Semua `arfazrllworkspace` di Navbar/Footer/HeroVisual dibuang; `href="#"` di Footer/NavigationShortcuts/CardNav dibuang **dengan tidak merender elemennya** (bukan ganti placeholder lain).
- Guard baru `src/lib/fork-identity.test.ts`: memindai `src/` + `public/` untuk `/arfazrll/`, `/arfazrllworkspace/`, `/syahrilarfianalmazril/` — harus nol match, kecuali 2 file yang diizinkan (file itu sendiri + `verify-build.test.ts` yang memang pakai kata itu sebagai fixture). TDD: RED 10 offender → GREEN.
- Verifikasi controller: test **30/30**, typecheck **13**, unreachable 15 → 16 (hanya +1 = file test baru, nol file produksi).
- **Minor carried forward ke task pemilik:** (a) `src/components/projects/ProjectDetail.tsx:464` masih bisa render `href="#"` → Task 9; (b) `src/components/ui/CardNav.tsx:162-163` ada `isChat`/`href === '#'` jadi kode mati → Task 2b sudah lewat, jadi dibersihkan di Task 10 atau final sweep; (c) `src/app/resume/page.tsx:56` masih `/resume.pdf` → sudah dicatat di plan Task 10 Step 4.

24. **Ruling — namespace i18n yang dihapus TIDAK boleh di-add balik; component-nya yang dibersihkan.** Kalau review Task 5 menandai "namespace `achievements`/`experience`/`technical` dihapus sementara Navbar/Footer/NavigationShortcuts masih memanggil `t('achievements')` dsb" → temuan itu **benar sebagai symptom**, tapi **fix-nya bukan** men-add balik key. Fix-nya Task 2d: bersihkan 8 file yang menaut ke route yang sudah dihapus, lalu hapus key yang jadi yatim. Key yang sudah dihapus memang tidak akan dipakai — struktur nav/footer lama (achievements/blog/gallery/experience) memang sudah dibuang. — Alasan: spec §5.1 hanya punya 7 route akhir; key untuk route yang tidak ada = junk. — Biaya kalau salah: 0 (Task 2d sudah di briefs).

## Task 5 — hasil & temuan

- **Review: ✅ Approved, nol Critical/Important.** Locale single-source (`src/lib/locale.ts` satu-satunya; `settings.ts` re-export; `request.ts` pakai `resolveLocale`; `accept-language` hilang total; `src/lib/i18n.ts` dihapus, nol importer). `defaultLocale = 'id'`. Test: 36/36, typecheck 13→13.
- Message file: 345/356 key → **147 key di masing-masing file, key set identik byte-per-byte**, nol nilai kosong. 12 namespace tersisa. `navigation.*` yang masih dibaca Navbar/Footer **dipertahankan** — jadi tidak ada risiko render key mentah.
- **Minor carried forward:**
  - (a) `Footer.tsx:370` hardcode **`"Jakarta, Indonesia"`** → harus Palembang. → dimasukkan ke **Task 2d Step 2**.
  - (b) `Footer.tsx:395` hardcode `"SUTAN AKBAR"` → ambil dari `portfolioData.personal.name`. → Task 2d Step 2.
  - (c) `Navbar.tsx:83` baca `document.cookie` langsung, bukan dari sumber locale tunggal → Task 6.
  - (d) prosa masih di message file (`about.leadIn.*`, `about.profile.narrative*`) karena `AboutSection`/`IdentitySequence` masih membacanya → harus pindah ke `portfolio.ts` saat Task 8 menulis ulang AboutSection.
  - (e) `src/app/page.tsx` + `src/app/resume/page.tsx` import `useTranslations` tapi tidak memakainya → Task 7 & Task 10.
  - (f) `NavigationShortcuts.tsx:85-116` masih referensi key yang dihapus, tapi di balik `return null` (tidak pernah render) → ikut bersih di Task 2d.

25. **Ruling — commit `8526ad3` berisi DUA hal, bukan cuma docs.** Commit ituitled "docs: carry 4 minor findings…" tapi **juga** menyapu sebagian perubahan Task 2d (`src/components/layout/Footer.tsx`, `src/components/layout/Navbar.tsx`) karena controller menjalankan `git add -A` sementara subagent masih bekerja. Isi kodenya **benar** (memenuhi Task 2d), hanya label commit-nya yang tidak akurat. **Tidak di-amend** — menggeser HEAD di tengah subagent berjalan berisiko konflik. Konsekuensi: **review Task 2d harus pakai BASE = `e5b6e76`** (sebelum sweep), bukan `8526ad3`, supaya seluruh perubahan Task 2d tercakup dalam satu diff review.
    **Pelajaran (terpakai untuk sisa sesi):** JANGAN pernah `git add -A` / `git commit -a` selama subagent implementer sedang berjalan di repo yang sama. Selalu pakai path eksplisit (`git add <path>`) untuk commit milik controller.

## Cara menjelaskan ke Sutan (permintaan eksplisit, 22/10/2026)

Sutan minta penjelasan **dengan cara yang mudah dipahami**. Praktiknya:

- Bahasa Indonesia, kalimat pendek. Hindari istilah git/SDD kalau tidak perlu: bilang "saya simpan progress-nya di commit" bukan "commit sweep".
- Jawab **pertanyaan yangdia tanyakan** dulu, baru tambahan. Jangan dump tabel panjang kalau dia cuma tanya "sudah saya buat" atau "sekarang ngapain".
- Kalau ada yang bertele-tele (mis. kesalahan `git add -A`), jelaskan **dampaknya ke dia** ("tidak ada yang hilang, cuma label commit yang salah") dalam 1–2 kalimat, lalu tutup. Detail teknis ada di ledger.
- Executive summary dulu ("sekarang di mana: 6 dari 11 task selesai"), detail menyusul kalau dia minta.
- Hindari kalimat yang bercabang-cabang. Satu ide = satu kalimat.

## Task 2d — hasil

- **Review: ✅ Approved, nol Critical/Important.** 26 referensi dead link hilang di 8 file (22 link ter-render + 4 entri `allHrefs`); 10 message key yatim dihapus dari kedua file (sekarang 137 key per file, parity test hijau). Semua import/variabel/container yang jadi yatim ikut dibersihkan — tidak ada sisa `isBlog`/`isGallery`/`isBackToBlog`/import tak terpakai.
- Dua fakta salah di Footer dibetulkan: **"Jakarta, Indonesia" → `t('location')` = "Palembang, Indonesia"** (dan link Maps → `Palembang,+Indonesia`), hardcode `"SUTAN AKBAR"` → `portfolioData.personal.name`.
- `NavigationShortcuts.tsx` yang tadinya 275 baris kode mati diganti `() => null` (nama export tetap, biar importer tidak rusak).
- Grep ulang: **nol** link ke `/blog`, `/gallery`, `/achievements`, `/experience` di `src/`. Yang tersisa hanya path asset gambar `/gallery/*.webp` (di AboutSection & StatsSection — itu nama folder aset, bukan rute) dan satu komentar.
- **Minor carried forward:** (a) `StatsSection.tsx:23` `const blogs: any[] = []` — slider "Latest Stories" mengindeks array kosong sehingga bisa render `undefined` / crash → **Task 8** (StatsSection ditulis ulang di situ); (b) `Navbar.tsx:44-45` satu baris komentar dobel → Task 6.

## Task 6 — hasil

- **Review 1: ❌ 3 Important + 1 Important-ish.** Semua *"requirement struktural"* terpenuhi (5 NAV_ITEMS, tanpa `/lab`, `/about` berisi konten nyata, metadata & tema verbatim, toggle locale write-only, kredit MIT, nol dead link, typecheck 12 tanpa error baru) — **tapi hasil render-nya rusak**:
  - `Navbar.tsx` pakai `useTranslations('navigation')` lalu `t('navigation.home')` → resolve ke `navigation.navigation.home` (tidak ada) → **semua label menu tampil sebagai teks mentah**.
  - `handleHomeClick` (yang `preventDefault()` saat `pathname === '/'`) terpasang di **semua** link desktop → klik `/projects`, `/skills`, `/about` dari beranda **tidak pernah navigating**.
  - `about/page.tsx` panggil `t('contact.hero.title')` di bawah `useTranslations('about')` → namespace salah.
  - Guard `fork-identity` mengecualikan **seluruh file** `Footer.tsx` (lemah; pengaman anti-sisa identitas fork).
- **Fix round 1** (commit `45a5979`): label dinormalisasi (strip `navigation.` sebelum lookup scoped), hanya link home yang pakai `handleHomeClick`, heading about pakai `getTranslations('contact')`, guard dipersempit jadi **satu string** (URL kredit MIT) + regression test, heading "Lokasi" dilokalisasi (`about.location`, ditambah ke kedua file). Test 39 → **40/40**, typecheck **12**.
- Penting: ketiga bug di atas **tidak akan ketahuan dari typecheck atau test yang ada** — cuma dari review yang membaca logikanya. Ini alasan kenapa review per-task bukan opsional di alur ini.

## Temuan runtime — cek browser sungguhan (22/10/2026)

Situs **tidak bisa dibuka**: Chrome headless → halaman depan jatuh ke error boundary (`src/app/error.tsx` → `QuantumError`), layar "EXCEPTION_CAUGHT / An internal technical error has occurred."。原因 `MISSING_MESSAGE: Could not resolve 'footer.footer.credit' in messages for locale 'id'`.

**Kenapa test & typecheck tidak menangkapnya:** `next-intl` lempar error itu hanya saat render di browser. Vitest tidak me-render komponen, `tsc` tidak tahu nama key. Review Task 6 sempat "verifikasi key `footer.credit` ada" — tapi tidak memverifikasi **path hasil resolusinya** (`footer.` + `footer.credit`). Type yang sama sudah menimpa Navbar 2× (desktop + mobile) di Task 6. Pola bug yang sama → butuh guard statis.

**Ruling 26 — guard statis kunci message wajib ada.** File `src/i18n/message-keys.test.ts`: telusuri `src/**`, petakan tiap variabel `t` ke namespace-nya (`const t = useTranslations('footer')` → `t` = `footer`), lalu pastikan setiap `t('key')` resolve di `messages/id.json` **dan** `messages/en.json`. Zero-exception untuk file yang sudah selesai; daftar file "pending" harus menyebut task pemiliknya secara eksplisit.

**Ruling 27 — file yatim yang masih berisi isi penulis fork dihapus.** `src/components/sections/ExperienceStickyScroll.tsx` tidak ter-import siapa pun (mati) dan masih memuat "SMAN 88 Jakarta" + "Science Major / Jakarta / Foundation" — yaitu sekolah penulis fork. Guard `fork-identity` tidak menangkapnya karena dia cuma cari literal `arfazrll`. Dihapus, bukan ditulis ulang.

**Carry forward:**
- `src/components/projects/ProjectPageContent.tsx` — 4 key hilang: `projects.sections.keyFeatures`, `.engineeringChronicles`, `.visualGallery`, `.installation` → **Task 9** (file itu ditulis ulang Task 9).
- `src/app/contact/page.tsx` — `contact.faqData` (list) masih berisi klaim terlarang: "Kecerdasan Buatan", "Full-stack Development (Next.js & Node.js)", "riset AI", "TensorFlow, PyTorch, YOLO" → **Task 10**. Test forbidden-claims hanya memindai `portfolio.ts`, bukan `messages/*.json` → ini celah yang harus ditutup.
- `src/components/ui/QuantumError.tsx:160` — "JAKARTA, INDONESIA" → harus PALEMBANG. Teks error/404 masih bahasa Inggris saja → minor, Task 10.
- `src/i18n/request.ts:12` & `src/providers/I18nProvider.tsx:13` — `timeZone: 'Asia/Jakarta'` → **benar** (Palembang juga WIB/UTC+7). Tidak diubah.

## Task 7 — hasil

- **Review: ✅ Approved, nol Critical/Important.** Test 36 → **43/43** (9 file), typecheck 12 → **9** (3 error `page.tsx` hilang karena ditulis ulang). 3D: slab kaca `RoundedBox` + `meshPhysicalMaterial` (transmission 0.9, ior 1.3, lime #C8F246), `MathUtils.damp` buat tilt kursor + float sinus, ONLY ambient 0.6 + directional [2,3,4] 1.2, **tanpa aset CDN**. Nama/peran = overlay HTML (bukan teks 3D) → tajam, selectable, screen-reader friendly. Fallback low-end: plat CSS statis (`border-primary/20` + `bg-primary/5` + transform rotateX/Y) → hero tetap utuh tanpa WebGL.
- **Penting: review Task 7 lolos, tapi situs tetap rusak** — karena error ada di `Footer.tsx` (pemilik Task 6), bukan di file Task 7. Konsekuensi: **review statis saja tidak cukup**; verifikasi browser wajib jadi langkah tiap task visual.

## Task 6 fix round 3 + Task 7 fix round 1 — hasil (22/10/2026)

**Ruling 28 — verifikasi browser wajib tiap task visual.** Alur: implementer → review statis → **controller buka di Chrome headless + screenshot + baca log dev**. Dua bug fatal lolos review statis:
- `Footer.tsx:197` `t('footer.credit')` di bawah `useTranslations('footer')` → `footer.footer.credit` tidak ada → **seluruh situs crash** (error boundary). Review Task 6 "sudah verifikasi key `footer.credit` ada" tapi tidak verifikasi **path hasil resolusinya**.
- `NamePlate.tsx:19` `useFrame` dipanggil di komponen yang **merender** `<Canvas>`, bukan **anak** `<Canvas>` → `R3F: Hooks can only be used within the Canvas component!` → crash.

**Fix round 3 (Task 6, commit `d016b8d`):** Footer `t('credit')`; `QuantumError.tsx:160` JAKARTA → **PALEMBANG**; `src/components/sections/ExperienceStickyScroll.tsx` **dihapus** (yatim + berisi "SMAN 88 Jakarta" = sekolah penulis fork; guard `arfazrll` tak menangkapnya); **guard baru `src/i18n/message-keys.test.ts`** — memetakan tiap variabel `t` ke namespace-nya lalu memastikan tiap `t('key')` resolve di `id.json` **dan** `en.json`. Satu-satunya pengecualian: `ProjectPageContent.tsx` (dimiliki Task 9). Test 43 → **44/44**, typecheck **9**.

**Fix round 1 (Task 7, commit `d904b0f`):** `NamePlate` dipecah jadi `PlateMesh` (anak `<Canvas>`, memegang `useFrame`) + `NamePlate` (wrapper + overlay + Canvas). Kursor dibaca via listener `window.pointermove` → ref → dibaca di `useFrame`, karena `page.tsx` membungkus plate dengan `pointer-events-none` sehingga `state.pointer` R3F selalu 0,0.

**Screenshot `shot-hero4.png` (1440×1000, dev server bersih):** navbar ID benar (Beranda/Proyek/Keahlian/Tentang/Kontak + toggle English + toggle tema + jam), eyebrow "PALEMBANG · FRONTEND ENGINEER" mono muted benar, FRONT/END rata kiri + ENGINEER rata kanan benar, subhead + scroll hint benar, slab 3D render. **Tapi 5 cacat visual:** (1) slab **abu-abu**, bukan lime — `transmission=0.9` + `opacity=0.35` tanpa env map; (2) slab **menimpa** huruf "N" di ENGINEER; (3) nama "Sutan Akbar Dwi Nugraha" nyaris tak terbaca (abu di atas abu) + wrapper `opacity-70` meredupkan; (4) **grid 48px + glow lime tak terlihat** — `mix-blend-overlay` di atas dasar `#08080C` menghapus semuanya; (5) `@keyframes marquee-left/right` terjaring di dalam `@theme inline` (globals.css:533) → `Warning: Parsing CSS source code failed`, keyframes tak pernah terbit.

## Task 8 — brief siap

`.superpowers/sdd/2026-10-21-portfolio-v3-main-site/task-8-brief.md` (232 baris). Section homepage: stats, tentang, keahlian, proyek, GitHub repos, CTA. **Perhatikan:** `computeStats` membaca `techStack` per proyek (Ruling 2) dan `ProjectsSection`/blok GitHub butuh message key yang belum ada (Ruling 3 → tambah ke `id.json` **dan** `en.json`).

## Task 8 — hasil (22/10/2026)

**Implementasi** (commit `54100d2`): `src/lib/stats.ts` + test, `src/lib/github.ts` + test, `src/components/sections/GitHubRepos.tsx` (server component, fallback statis ke github.com/sutannn7), `src/components/sections/Milestones.tsx`, rewrite `StatsSection` / `ExpertiseSection` / `AboutSection` / `ExperienceStickyScroll` / `CTASection`, `page.tsx` 9 section. Stats dari data: Proyek 4 · Live 3 · Lab 0 · Teknologi 16.

**Fix round 1** (`9fae489`): **`page.tsx` harus jadi Server Component** — sebelumnya `'use client'`, jadi `GitHubRepos` + `Milestones` (server component, `getTranslations`) crash: *"`getTranslations` is not supported in Client Components"*. Hero dipindah ke `src/components/sections/HeroSection.tsx` ('use client'), markup hero **byte-identical**. Featured block pakai `getLocale()`/`getTranslations()` dari `next-intl/server`. 4 file yatim dihapus.

**Fix round 2** (`8d6058d`): **12 klaim terlarang masih ada di `messages/*.json`** — `projects.metadata.roleValue` ("Pengembang Full Stack"), `ctaSection.subtitle` ("sistem berbasis AI dan rekayasa full stack"), dan 4 jawaban `contact.faqData.*.a` (Kecerdasan Buatan / AI research / TensorFlow-PyTorch-YOLO / AIoT / deteksi serangan). Guard yang diperluas masih terlalu longgar (hanya multi-word) → sekarang ada **dua level**: nilai message & `portfolioData` pakai daftar ketat (`\bAI\b`, `AIoT`, `\bML\b`, `machine learning`, `data science`, `full[\s-?]*stack`, `tensorflow`, `pytorch`, `scikit-learn`, `yolo`); file `.ts/.tsx` tetap multi-word saja (bare "AI" akan false-positive di `EMAIL`/`MAIN`/`DETAIL`). FAQ ditulis ulang jujur (5 pasang, index sejajar id/en). CTA: judul "Sedang mencari magang? Mari ngobrol." (sebelumnya kalimat terpotong "Mari Membangun Sesuatu yang" karena `together` tak dirender), tombol "Hubungi Saya" + "Unduh CV", `ribbon2` = "FRONTEND ENGINEER · UI ENGINEER · WEB DEVELOPER · FRONTEND ENTHUSIAST". Key `words` + `together` dihapus dari kedua file. Key milestone duplikat "2026" → `${year}-${title.id}`.

**Fix oleh controller** (`2ecf45a`): tahun di timeline journey **menimpa judul** (`absolute -left-[24px]` + teks "2021–2024" selebar ~70px vs konten mulai 48px). Diperbaiki: container `pl-[124px]`, tahun `absolute -left-[112px] w-[96px] text-right` → kolom sendiri.

**Build sekarang HIJAU** (typecheck **0** error, 51/51 test, `next build` sukses 7 rute). Build sebelumnya rusak sejak Task 2 karena 9 import modul yang sudah dihapus — sudah dibersihkan (commit `f4c4eeb`) plus `ProjectContact` kehilangan robot Spline (peer `@splinetool/runtime` tak terpasang & scene dari CDN). `src/components/ui/interactive-3d-robot.tsx` dihapus.

**Tool verifikasi browser (BARU, pakai tiap task visual):**
- `C:\Users\lenovo\AppData\Local\Temp\opencode\shot.mjs` — screenshot **full page** + kumpulkan console error (CDP, `captureBeyondViewport`).
- `...\shot-scroll.mjs` — screenshot **per posisi scroll** (untuk konten yang muncul saat digulir / `whileInView`).
- Catatan: `npm.cmd run dev` + `--window-size` tinggi **tidak boleh** dipakai untuk full page — `min-h-screen` ikut jadi tinggi. Selalu pakai CDP.

**PENTING — 3 bug fatal lolos review statis** dan hanya ketahuan lewat browser: (1) `Footer.tsx` `t('footer.credit')` → crash total; (2) `NamePlate` `useFrame` di luar `<Canvas>` → crash; (3) `page.tsx` client → crash. **Ruling 28 (browser check) adalah wajib, bukan opsional.**

**Ruling 29 — root cause slab 3D (butuh 4 ronde perbaikan).** drei `<RoundedBox>` merender `<mesh>`-nya sendiri. Material yang ditaruh sebagai *saudara* menempel ke mesh luar yang **tanpa geometri**, sedangkan mesh RoundedBox yang terlihat jatuh ke material default three.js (`MeshBasicMaterial` putih) → selalu netral (229,229,229). Fix: `<RoundedBox ref={meshRef}><meshPhysicalMaterial …/></RoundedBox>`. Efek sampingnya: `useFrame` sekarang memegang mesh yang benar → tilt & float benar-benar jalan.

**Sisa pekerjaan:** Task 9 (rute `/projects`) → Task 10 (`/skills`, `/about`, `/contact`, `/resume`) → Task 11 (audit + deploy + CV) → Plan 2/3/4 (3 mini project) → Plan 5 (`/lab`).

**BUTUH TINDAKAN SUTAN:** 3 repo GitHub kosong lama (`command-palette`, `token-playground`, `onbarding-flow` — ada typo) masih ada dan muncul di blok "Repositori GitHub" di situs. `gh` tidak punya scope `delete_repo` → hapus manual: GitHub → Settings → Danger Zone → Delete. Yang dipakai: `sutan-command-palette`, `sutan-token-playground`, `sutan-onboarding-flow`.

## Plan lain (sudah ditulis, di `docs/superpowers/plans/`)
| Plan | Isi | Repo target |
|---|---|---|
| `2026-10-21-mini-command-palette.md` | Mini project 1 — ⌘K palette, keyboard nav + fuzzy match + ARIA combobox | `sutannn7/command-palette` |
| `2026-10-21-mini-token-playground.md` | Mini project 2 — live design token editor via CSS variables | `sutannn7/token-playground` |
| `2026-10-21-mini-onboarding-flow.md` | Mini project 3 — multi-step form + validasi per langkah | `sutannn7/onboarding-flow` |
| `2026-10-21-lab-route.md` | Plan 5 — rute `/lab` + blok lab di homepage (butuh Plan 2-4 selesai & live) | `sutannn7/portofolio-v3` |

## Pre-flight conflict scan

Baris per pasangan task yang berbagi file/antarmuka, dan per-task konsistensi internal.

| Pasangan | File / antarmuka bersama | Yang satu hasilkan vs yang lain pakai | Temuan |
|---|---|---|---|
| 1 → 2 | `package.json` scripts | T1 menambah `test`/`typecheck`/`verify`; T2 menjalankan build | Bersih |
| 1 → 3 | `vitest.config.ts`, alias `@` | T1 buat runner; T3 buat test token | Bersih |
| 2 → 6 | `Navbar.tsx`, `Footer.tsx` | T2 hapus `ChatBot`; T6 rewrite nav/footer | Bersih (urutan) |
| 2 → 7 | `src/app/page.tsx` | T2 hapus `Hyperspeed`/`Scene3D`; T7 tulis ulang hero | Bersih (urutan) |
| 2 → 9 | `src/app/actions/getProjectImages.ts` | T2 hapus; T9 ganti path eksplisit | Bersih |
| 2 → 10 | `react-pdf` / `pdf-viewer.tsx` | T2 hapus; T10 sediakan embed PDF native | Bersih |
| 3 → 7, 8 | `globals.css` token | T3 kunci token; T7/8 pakai utilitas Tailwind | Bersih |
| 4 → 6,7,8,9,10 | `portfolioData` + `src/types/index.ts` | T4 kunci bentuk tipe; task lain Consumption | Bersih, T4 adalah kontrak |
| 4 → 8 | `computeStats` signature | T4 `PortfolioData` tidak punya `techStack` top-level, tapi T8 `computeStats` membaca `data.techStack` | **KONFLIK** → Ruling 2 |
| 5 → 8, 10 | keys `messages/*.json` | T5 daftar key tidak memuat `projects.githubRepos`, `stats.*`, `about.milestones`, `about.journey` yang dipakai T8/T10 | **KONFLIK** → Ruling 3 |
| 6 → 10 | `src/app/about/page.tsx` | T6 buat versi minimal; T10 enrich | Bersih (sudah dikoreksi di plan) |
| 7 → 8 | `src/app/page.tsx` komposisi | T8 menulis ulang komposisi page.tsx secara total → berisiko menghapus blok hero T7 | **KONFLIK** → Ruling 4 |
| 2 → 6..10 | status build | T2 sengaja merusak build sampai T6 | **KONFLIK** → Ruling 5 |
| 4 → 11 | `image` path proyek | T4 isi path; file gambarnya belum ada | **KONFLIK** → Ruling 6 |
| 11 | deploy Vercel | butuh akun Vercel milik Sutan | Manual oleh Sutan (Task 11 Step 6) |

### Konsistensi internal per task

| Task | Tes vs kode yang dispesifikasikan | Temuan |
|---|---|---|
| 1 | test `findForbidden` vs implementasi `src/lib/verify-build.ts` | Cocok. **Tapi** `scripts/verify-build.mjs` (JS) tidak bisa meng-import `.ts` → Ruling 1 |
| 2 | tidak punya test; verifikasi = build + grep | Kekhawatiran: build sengaja rusak → Ruling 5 |
| 3 | test token vs `globals.css` | Cocok; blok `:root` = light, `.dark` = dark sesuai struktur fork |
| 4 | test validasi vs `portfolio.ts` baru | Cocok; test melarang klaim terlarang & URL placeholder |
| 5 | test `resolveLocale` + test keys messages | Cocok |
| 6 | test navigasi butuh route `/about` | Plan sudah dikoreksi: `/about` dibuat di T6 Step 3 |
| 7 | test `shouldRenderHeavyVisuals` vs `src/lib/performance.ts` | Cocok; hook `usePrefersReducedMotion` dibuat T7 |
| 8 | test `computeStats` (fixture `techCount: 0`) vs implementasi | Ruling 2 |
| 8 | test `fetchRepos` (mock fetch) vs `src/lib/github.ts` | Cocok |
| 9 | test `PROJECT_FILTERS` vs `src/data/projectFilters.ts` | Cocok |
| 10 | tidak punya test; verifikasi = build | Diterima (UI) |
| 11 | `verify-build` end-to-end | Ruling 1 |

## Rulings

1. **Ruling — satu implementasi `findForbidden`, bukan dua.** Task 1: `src/lib/verify-build.ts` tetap jadi satu-satunya implementasi dan tetap ada unit test-nya. Script scanner menjadi `scripts/verify-build.ts` (bukan `.mjs`) supaya bisa meng-import `../src/lib/verify-build.ts`; dijalankan dengan `node --experimental-strip-types` (Node 22.15 mendukung). `tsconfig.json` mendapat `"exclude": ["node_modules", "scripts"]` supaya `tsc --noEmit` tidak mengecek import berekstensi `.ts`. `package.json` script: `"verify": "node --experimental-strip-types scripts/verify-build.ts"`. — Alasan: duplikasi logika dua tempat pasti salah satu tidak teruji. — Biaya kalau salah: 1 baris di package.json + 1 di tsconfig.
2. **Ruling — `computeStats` menghitung `techCount` dari `techStack` milik tiap proyek.** Tanda tangan: `computeStats(data: { projects: { demoUrl?: string; techStack?: string[] }[]; lab: unknown[] })`. Tidak ada `techStack` top-level di `PortfolioData`. — Alasan: `PortfolioData` di Task 4 tidak punya field itu; Task 8 sempat menulis sebaliknya. — Biaya kalau salah: 1 signature + 1 assertion di test.
3. **Ruling — kunci messages.** Task 5 wajib menyediakan seluruh kunci yang dirujuk Task 6–10 (minimal: `navigation.*`, `hero.*`, `projects.githubRepos`, `stats.projects/live/lab/tech`, `expertise.*`, `about.milestones`, `about.journey`, `contact.*`, `footer.credit`, `footer.location`, `common.*`). Task 6–10 boleh menambah kunci baru **hanya** jika menambahkannya ke `id.json` **dan** `en.json` di task yang sama, agar test `messages.test.ts` tetap hijau. — Alasan: prevent "key tidak ada" yang baru ketahuan saat runtime. — Biaya kalau salah: beberapa label hilang di satu bahasa.
4. **Ruling — Task 8 memodifikasi `src/app/page.tsx` secara aditif.** Blok hero hasil Task 7 (HeroGrid, gate NamePlate, HeroVisual, `usePrefersReducedMotion`) **tidak boleh** diubah, hanya dikelilingi section baru. — Alasan: Task 7 sudah di-review terpisah; rewrite total membuang hasil review. — Biaya kalau salah: 1 blok hero ditulis ulang.
5. **Ruling — build sengaja rusak antara Task 2 dan Task 6.** `npm.cmd run build` boleh gagal di Task 2–5; **`npm.cmd run test` (vitest) harus hijau di setiap task**. Task 6–10 tidak boleh meninggalkan build lebih rusak dari saat task itu mulai; Task 6 harus mengembalikan build ke hijau. — Alasan: memangkas 40 dependency tanpa rewrite 5 route besar pasti merusak build lebih dulu. — Biaya kalau salah: tidak ada; status build dicatat di tiap commit.
6. **Ruling — gambar proyek.** `public/projects/polosri.jpg` dan `public/projects/kopi.jpg` disalin dari `C:\Users\lenovo\portofolio-nextjs\public\projects\` pada Task 1 Step 1. **Revisi (21/10):** screenshot LearnEase sudah diambil dari demo live memakai Chrome headless (`--headless=new --screenshot=... --window-size=1440,900`), hasilnya `learnease.jpg` 106 KB (PNG 681 KB dikompresi ke JPEG q84) dan tersimpan di workspace ini. File itu dipindah ke `public/projects/learnease.jpg` pada **Task 4**, dan `image: '/projects/learnease.jpg'` diisi di `portfolio.ts`. Screenshot Portofolio v3 diambil setelah deploy (Task 11) — sampai itu kartu proyek itu merender tanpa gambar, **tanpa** gambar placeholder. — Alasan: "no dead link / no fake asset" adalah anti-goal. — Biaya kalau salah: 1 kartu tampil tanpa gambar sampai Task 11.
6b. **Ruling — teknik screenshot.** Browser tool MCP tidak bisa screenshot di mesin ini ("needs a visible tab"). Yang dipakai: Chrome headless CLI di `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe` dengan `--headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=8000 --window-size=1440,900 --screenshot=<path> <url>`, lalu dikompres ke JPEG q84 dengan Pillow (PIL 13.0.0 terpasang). Tidak butuh dependency npm. — Biaya kalau salah: tidak ada.
7. **Ruling — `src/app/experience/page.tsx` ikut dihapus di Task 2.** Rute `/experience` tidak ada di tabel rute spec §5.1; perannya (timeline) pindah ke section journey di homepage dan ke `/about`. — Alasan: meninggalkan rute 56KB berisi konten orang lain = setengah jadi. — Biaya kalau salah: rute `/experience` harus dibuat ulang (tidak ada di spec).
8. **Ruling — `src/components/three/Scene3D.tsx` ikut dihapus di Task 2.** Visual hero digantikan NamePlate (T7); `Scene3D` hanya CSS particles dan tidak dipakai. — Alasan: file mati = File Structure plan tidak menyebutnya. — Biaya kalau salah: tidak ada.
9. **Ruling — `npm.cmd` hanya, tidak `npm`.** PowerShell memblokir `npm.ps1`. Semua perintah di plan dan brief memakai `npm.cmd`. — Alasan: `npm` gagal di mesin ini. — Biaya kalau salah: tidak ada.
10. **Ruling — Task 1 tidak membuat remote GitHub.** `git remote add origin` menunjuk URL yang belum ada; itu tidak error. Repo GitHub baru dibuat di Task 11 Step 5 lewat `gh repo create`. — Alasan: `gh repo create` butuh repo lokal yang punya commit, dan Task 1 sudah membuatnya. — Biaya kalau salah: tidak ada.
11. **Ruling — 4 file tambahan dihapus di Task 2.** Pemetaan ker breakage di repo 440-file (dilakukan controller sebelum Task 2) menunjukkan `src/components/layout/SocialCorner.tsx`, `src/components/stats/GitHubStats.tsx`, `src/components/stats/StatsCard.tsx`, dan `src/components/ui/github-showcase.tsx` ikut mati / jadi yatim. Semuanya widget Arfazrll (social corner, heatmap GitHub, kartu stats) dan digantikan blok Repo GitHub baru di Task 8. — Alasan: meninggalkan file mati = file structure plan tidak menyebutnya + repo jadi bumerah. — Biaya kalau salah: 4 file bisa dipulihkan dari `upstream`.
12. **Ruling — `ProjectPlaceholder` / `getPlaceholderImageUrl` dibuang di Task 9.** Placeholder image melanggar anti-goal §2. Kartu tanpa `image` merender tanpa `<img>`. — Biaya kalau salah: 1 komponen.
13. **Ruling — `gh` terautentikasi (selesai 21/10).** `gh auth login --web` sudah dijalankan Sutan: `Logged in to github.com account sutannn7 (keyring)`, protocol HTTPS, scopes `gist, read:org, repo, workflow`. `gh repo create` di Task 11 Step 5 dan pembuatan repo mini project (Plan 2–4) kini bisa jalan. Blocker Ruling 13 Closed. Catatan: repo **sudah dibuat Sutan** 21/10/2026 16:21 UTC — `sutannn7/sutan-akbar-portfolio`, publik, masih kosong, default branch belum ada. Jadi Task 11 Step 5 tinggal `git push`, **jangan** `gh repo create` (akan gagal "already exists"). Plan Task 11 Step 5 sudah diupdate: pakai `git branch -M main` lalu push, supaya default branch repo = `main` (bukan `feature/v3-reskin`).
14. **Ruling — binary SWC korup; TurbopackPulihkan manual.** Di mesin ini `node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node` (85 MB, header PE valid) gagal dimuat → Next fallback ke WASM → `Error: Turbopack is not supported on this platform (win32/x64) because native bindings are not available`. Penyebabnya unduhan korup, bukan batasan Next. Perbaikan: hapus folder paket, `npm.cmd install` (npm diambil ulang dalam 13 detik), lalu `node -e "require('.../next-swc.win32-x64-msvc.node')"` → `LOAD OK`. Setelah itu `npm.cmd run build` jalan dengan Turbopack dan gagal **hanya** dengan 17 error "Module not found" yang memang disengaja (file milik Task 6–10). Tidak perlu flag `--webpack`. — Alasan: memperbaiki native binding lebih baik daripada memaksa webpack, dan lokal jadi sama dengan Vercel. — Biaya kalau salah: jika corrupt lagi setelah `npm install` di mesin lain, ulangi langkah yang sama.
15. **Ruling — Task 2b ditambahkan: pangkas komponen yatim.** Analisis reachability (controller, script `scripts/find-unreachable.mjs`) menunjukkan **86 dari 178 file di `src/` tak terjangkau** dari entry point `src/app/**`. Repo ini portofolio publik — 86 file mati itu dibaca siapa pun yang clone. Task 2b menghapus ~70 di antaranya dan melepas 11 package sisa. — Alasan: repo jadi ~⅓ dan dependency hilang tanpa mengorbankan apa pun. — Biaya kalau salah: file bisa dipulihkan dari `upstream` (`git checkout upstream/main -- <path>`).
16. **Ruling — `src/app/contact/page.tsx` juga import `Lanyard`.** Peta ker breakage controller tidak menyebut ini; Task 2 yang menemukan. File itu milik Task 10 (rewrite penuh) → tidak disentuh di Task 2, tapi Task 10 WAJIB sekaligus membuang import `Lanyard` + `fetch('/api/contact')`. — Biaya kalau salah: Task 10 tidak hijau.
17. **Ruling — penamaan pakai nama Sutan** (keputusan Sutan, 21/10: "buat yang baru aja pakai nama saya"). Repo utama `sutannn7/sutan-akbar-portfolio`; domain utama `https://sutan-akbar.vercel.app`; mini project `sutannn7/sutan-command-palette` → `sutan-command-palette.vercel.app`, `sutannn7/sutan-token-playground` → `sutan-token-playground.vercel.app`, `sutannn7/sutan-onboarding-flow` → `sutan-onboarding-flow.vercel.app`. Git remote `origin` sudah di-set-url. Semua spec + 5 plan di-update. — Alasan: CV mencetak URL portofolio; URL yang namanya "sutannn7" terlihat seperti username, bukan nama orang. — Biaya kalau salah: rename repo/domain di Vercel + GitHub (5 menit).

## Task 1 — hasil & temuan

- **Review:** ✅ Spec compliant, Task quality: Approved. Tidak ada Critical/Important.
- **Verifikasi byte-for-byte** oleh reviewer: `polsri.jpg`, `kopi.jpg`, dan spec doc identik SHA-256 dengan sumbernya. `.npmrc` (`legacy-peer-deps=true`) utuh.
- ⚠️ "apakah repo GitHub dibuat" — **terjawab: tidak**. `gh` tidak terautentikasi sama sekali, jadi mustahil membuat repo; hanya `git remote add` lokal. Lihat Ruling 13.
- Task 1: minor (deferred): `scripts/verify-build.ts` membaca file biner di `.next/static` — risk false positive di audit Task 11 → **dibundel ke Task 2**
- Task 1: minor (deferred): argumen kosong `--forbidden=` mencocoki semua file → **dibundel ke Task 2**
- Catatan: `vitest` dipin ke `3.2.7` (bukan 5.x) karena `legacy-peer-deps=true` membuat `vite` peer dependency ter-skip. **Jangan naikkan versi** tanpa menambah `vite` sebagai dependency.
- Catatan: `npm.cmd run typecheck` merah dengan 6 error `react-icons@5.7.0` (paket upstream tidak lagi kirim `.d.ts`). Task 2 menghapus `react-icons`, jadi harus hijau setelah Task 2.

## Peta ker breakage Task 2 (verified controller, 21/10)

| File yang tersisa | Yang di-import | Tetap rusak sampai |
|---|---|---|
| `src/app/page.tsx` | `SocialCorner`, `Hyperspeed` (dynamic), `Scene3D` (dynamic) | Task 7 |
| `src/app/layout.tsx` | `ChatBot` | Task 6 |
| `src/app/skills/page.tsx` | `SplineScene` | Task 10 |
| `src/app/resume/page.tsx` | `PdfViewer` | Task 10 |
| `src/app/projects/page.tsx` | `getProjectImages`, `ProjectPlaceholder` | Task 9 |
| `src/app/projects/[slug]/page.tsx` | `getProjectImages` | Task 9 |
| `src/app/contact/page.tsx` | `fetch('/api/contact')` | Task 10 |
| `src/components/sections/AboutSection.tsx` | `KaggleShowcase`, `WakaTimeShowcase`, `GitHubShowcase`, `SocialCorner` | Task 8 |

Semua file di tabel itu akan ditulis ulang oleh task yang disebut — jadi build kembali hijau di Task 6 dan seterusnya.

## Model availability

Akun **tidak punya saldo** untuk model berbayar (`gpt-6-luna`, `claude-haiku-5-5`, `mistral-large-4`, `claude-opus-5-5` → error "Insufficient account funds"). Semua subagent memakai tier gratis:

| Peran | Model | Alasan |
|---|---|---|
| Implementer task mekanis (1, 2, 3, 9, 10, 11) | `opencode/deepseek-v4.1-flash-free` | Task-nya transkripsi + tes, brief berisi kode lengkap |
| Implementer task konten & desain (4, 5, 7, 8) | `opencode/nemotron-3.5-super-vl-free` | Butuh kualitas naskah & keputusan visual |
| Reviewer task | `opencode/nemotron-3.5-super-vl-free` | Lantai mid-tier untuk reviewer |
| Review akhir seluruh branch | `opencode/nemotron-3.5-super-vl-free` | Model terkuat yang tersedia gratis |

Konsekuensi: free tier lebih lemah dari model berbayar → task konten (4, 5) perlu scrutiny extra di review, dan fix loop siap-siap dipakai.

## Dispatch log

| Task | BASE | Model | Sesi | Status |
|---|---|---|---|---|
| 1 | d857a8d | deepseek-v4.1-flash-free | ses_ea17ec39affeXsjdIABkrvYy0F | berjalan |

## Catatan

- Fork di-clone dengan `--depth 1`. Kalau nanti perlu history dari `upstream`, jalankan `git fetch --unshallow upstream` lebih dulu.
- `git -c user.name=... -c user.email=...` dipakai untuk commit otomatis karena config global mesin ini belum ada.

## 2026-10-23 — Arch scroll reveal (adaptasi template softlife)

- `HeroSection`: panel `bg-secondary` tumbuh dari slot lengkung ke layar penuh, di-scrub ScrollTrigger (`bottom bottom` → `bottom 30%`); konten hero naik + fade. Guard `prefers-reduced-motion` lewat `gsap.matchMedia`, tanpa JS panel tetap `opacity-0`.
- `StatsSection`: ground jadi `bg-secondary`, kartu `bg-background`, supaya sambungan arch ke section berikutnya tidak berubah warna.
- Verifikasi: typecheck bersih, 55/55 tes lulus, 0 error konsol; screenshot 1440×900, 1920×1080, 390×844.

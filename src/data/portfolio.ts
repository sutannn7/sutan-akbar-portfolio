import { PortfolioData } from '@/types';

export const portfolioData: PortfolioData = {
  personal: {
    name: 'Sutan Akbar Dwi Nugraha',
    title: { id: 'Frontend Engineer', en: 'Frontend Engineer' },
    subtitle: {
      id: 'Frontend Engineer — antarmuka yang ringan, kode yang rapi, dan produk yang jalan di HP orang.',
      en: 'Frontend Engineer — lightweight interfaces, clean code, and products that work on a phone.',
    },
    bio: {
      id:
        'Sutan Akbar Dwi Nugraha, Frontend Engineer berbasis di Palembang. Saat ini saya mahasiswa D-IV Manajemen Informatika di Politeknik Negeri Sriwijaya dengan IPK 3,55 / 4,00 (hingga Semester 4).\n\nSaya membangun antarmuka web yang ringan, rapi, dan berjalan di ponsel. Pengalaman saya mencakup redesign UI/UX LMS kampus (LearnEase, tim 5 orang: audit 8 halaman, sistem token desain, mode gelap, 7 halaman prototipe, dan runner pengujian otomatis), website profil jurusan MI POLSRI yang saya bangun sendirian dengan PHP native dan MySQL, dan Nusantara Kopi untuk event SINTAK (tim 4 orang, live di Vercel).\n\nSaya berpegang pada jujur dalam portofolio ini: tidak ada klaim yang tidak didukung oleh pekerjaan nyata.',
      en:
        'Sutan Akbar Dwi Nugraha, a Frontend Engineer based in Palembang. He is currently a D-IV Informatics Management student at Politeknik Negeri Sriwijaya (IPK 3.55/4.00 through semester 4).\n\nHe builds lightweight, clean, mobile-ready web interfaces. His work includes the campus LMS UI/UX redesign (LearnEase, team of 5: audit of 8 pages, design tokens, dark mode, 7 prototype pages, and an automated test runner), the MI POLSRI study-program profile website that he built alone with native PHP and MySQL, and Nusantara Kopi for the SINTAK event (team of 4, live on Vercel).\n\nHe commits to honesty in this portfolio: nothing claimed without real work to back it.',
    },
    avatar: '/avatar.svg',
    location: 'Palembang, Indonesia',
    email: 'Akbarcool998@gmail.com',
    phone: '0857-5829-2876',
    resumeUrl: '/cv.pdf',
    links: [
      { label: 'GitHub', url: 'https://github.com/sutannn7', icon: 'github' },
      {
        label: 'LinkedIn',
        url: 'https://linkedin.com/in/sutan-akbar-dwi-nugraha-193010442',
        icon: 'linkedin',
      },
      { label: 'WhatsApp', url: 'https://wa.me/6285758292876', icon: 'whatsapp' },
      { label: 'Email', url: 'mailto:Akbarcool998@gmail.com', icon: 'mail' },
    ],
    languages: [
      { name: 'Indonesia', level: 'Aktif' },
      { name: 'Inggris', level: 'Pasif' },
    ],
  },
  projects: [
    {
      id: 'learnease',
      slug: 'learnease',
      title: {
        id: 'LearnEase — Redesign UI/UX LMS POLSRI',
        en: 'LearnEase — UI/UX Redesign of POLSRI LMS',
      },
      category: 'UI/UX & Frontend',
      description: {
        id: 'Redesign antarmuka LMS kampus bersama tim 5 orang.',
        en: 'Campus LMS interface redesign with a team of 5.',
      },
      longDescription: {
        id:
          'Saya mengikuti seluruh proses redesign UI/UX LMS POLSRI: memulai dengan audit terhadap 8 halaman LMS, kemudian merumuskan sistem token desain, menerapkan mode gelap, merancang 7 halaman prototipe, membangun runner pengujian otomatis, melakukan verifikasi tiap halaman dengan Chrome headless, dan mengakhiri dengan usulan perubahan UI/UX yang disampaikan kepada kepala departemen.',
        en:
          'I ran the full UI/UX redesign process for the POLSRI LMS: starting with an audit of 8 LMS pages, then defining a design token system, implementing dark mode, designing 7 prototype pages, building an automated test runner, and verifying every page with headless Chrome — closing with a written UI/UX change proposal submitted to the department head.',
      },
      highlights: [
        { id: 'Audit 8 halaman LMS', en: 'Audit of 8 LMS pages' },
        { id: 'Sistem token desain', en: 'Design token system' },
        { id: 'Mode gelap', en: 'Dark mode' },
        { id: '7 halaman prototipe', en: '7 prototype pages' },
        { id: 'Runner pengujian otomatis', en: 'Automated test runner' },
        { id: 'Verifikasi Chrome headless', en: 'Headless Chrome verification' },
        { id: 'Usulan UI/UX ke kepala departemen', en: 'UI/UX proposal to department head' },
      ],
      techStack: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Git', 'GitHub', 'Node.js'],
      role: 'Developer',
      team: '5 orang',
      year: '2026',
      repoUrl: 'https://github.com/sutannn7/polsri-lms-frontend',
      demoUrl: 'https://polsri-lms-frontend.vercel.app',
      image: '/projects/learnease.jpg',
    },
    {
      id: 'web-jurusan-mi-polsri',
      slug: 'web-jurusan-mi-polsri',
      title: {
        id: 'Website Profil Jurusan MI POLSRI',
        en: 'MI POLSRI Study Program Profile Website',
      },
      category: 'Web',
      description: {
        id: 'Profil jurusan Manajemen Informatika POLSRI, PHP native dan MySQL, dibangun mandiri, tidak ada demo live.',
        en: 'MI POLSRI Informatics Management program profile site, native PHP and MySQL, built solo, no live demo.',
      },
      longDescription: {
        id:
          'Saya membangun website profil jurusan Manajemen Informatika POLSRI secara mandiri dengan PHP native dan MySQL. Saya merancang basis data, membuat antarmuka, dan menulis kode sisi server yang sederhana. Situs ini tidak di-deploy secara publik: tersedia sebagai repositori GitHub dan dokumentasi screenshot.',
        en:
          'I built the MI POLSRI Informatics Management study-program profile website alone, using native PHP and MySQL. I designed the database, created the interface, and wrote simple server-side code. The site was never deployed publicly; it exists as a GitHub repository and screenshot documentation.',
      },
      highlights: [
        { id: 'PHP native + MySQL', en: 'Native PHP and MySQL' },
        { id: 'Basis data sendiri', en: 'Custom database' },
        { id: 'Dibangun mandiri', en: 'Built solo' },
        { id: 'Tidak ada demo live', en: 'No live demo' },
      ],
      techStack: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Git', 'GitHub', 'XAMPP', 'phpMyAdmin'],
      role: 'Developer',
      year: '2026',
      repoUrl: 'https://github.com/sutannn7/web-informatika-mi-polsri',
      image: '/projects/polsri.jpg',
    },
    {
      id: 'nusantara-kopi',
      slug: 'nusantara-kopi',
      title: {
        id: 'Nusantara Kopi',
        en: 'Nusantara Kopi',
      },
      category: 'Frontend',
      description: {
        id: 'Situs kopi untuk event SINTAK, dibangun tim 4 orang, live di Vercel.',
        en: 'Coffee site for the SINTAK event, built by a team of 4, live on Vercel.',
      },
      longDescription: {
        id:
          'Nusantara Kopi adalah situs kopi yang dibuat untuk event SINTAK oleh tim 4 orang, dengan saya menangani frontend. Situs dirancang responsif dan dipublikasikan di Vercel.',
        en:
          'Nusantara Kopi is a coffee site built for the SINTAK event by a team of 4, with me handling the frontend. Designed to be responsive and published on Vercel.',
      },
      highlights: [
        { id: 'Frontend, tim 4 orang', en: 'Frontend, team of 4' },
        { id: 'Event SINTAK', en: 'SINTAK event' },
        { id: 'Live di Vercel', en: 'Live on Vercel' },
        { id: 'Desain responsif', en: 'Responsive design' },
      ],
      techStack: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Git', 'GitHub'],
      role: 'Frontend Developer',
      team: '4 orang',
      year: '2025',
      demoUrl: 'https://nusantara-kopi.vercel.app',
      image: '/projects/kopi.jpg',
    },
    {
      id: 'portofolio-v3',
      slug: 'portofolio-v3',
      title: {
        id: 'Portofolio Pribadi (v3)',
        en: 'Personal Portfolio (v3)',
      },
      category: 'Frontend',
      description: {
        id: 'Situs portofolio ini sendiri, Next.js 16 dengan TypeScript dan Tailwind CSS.',
        en: 'This portfolio site itself, Next.js 16 with TypeScript and Tailwind CSS.',
      },
      longDescription: {
        id:
          'Portofolio v3 adalah situs pribadi saya yang dibangun dengan Next.js 16 App Router, TypeScript, Tailwind CSS, Framer Motion, dan Three.js. Situs ini menampilkan proyek, keterampilan, dan journey saya sebagai Frontend Engineer, dan merupakan bukti nyata bahwa saya bekerja dengan Next.js dan TypeScript sehari-hari.',
        en:
          'Portfolio v3 is my personal site built with Next.js 16 App Router, TypeScript, Tailwind CSS, Framer Motion, and Three.js. It showcases my projects, skills, and journey as a Frontend Engineer, and is direct proof that I work with Next.js and TypeScript daily.',
      },
      highlights: [
        { id: 'Next.js 16', en: 'Next.js 16' },
        { id: 'TypeScript', en: 'TypeScript' },
        { id: 'Tailwind CSS', en: 'Tailwind CSS' },
        { id: 'Framer Motion', en: 'Framer Motion' },
        { id: 'Three.js', en: 'Three.js' },
        { id: 'Dibangun mandiri', en: 'Built solo' },
      ],
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'Git', 'GitHub'],
      role: 'Developer',
      year: '2026',
      repoUrl: 'https://github.com/sutannn7/sutan-akbar-portfolio',
      demoUrl: 'https://sutan-akbar.vercel.app',
    },
  ],
  lab: [],
  skills: [
    {
      group: { id: 'Frontend & Web', en: 'Frontend & Web' },
      items: [
        { name: 'HTML', badge: 'mahir' },
        { name: 'CSS', badge: 'mahir' },
        { name: 'JavaScript', badge: 'mahir' },
        { name: 'TypeScript', badge: 'dasar' },
        { name: 'React', badge: 'nanodua' },
        { name: 'Next.js', badge: 'nanodua' },
        { name: 'Tailwind CSS', badge: 'nanodua' },
        { name: 'Bootstrap', badge: 'nanodua' },
      ],
    },
    {
      group: { id: 'Backend & Data', en: 'Backend & Data' },
      items: [
        { name: 'PHP (Native)', badge: 'mahir' },
        { name: 'MySQL', badge: 'mahir' },
        { name: 'Node.js', badge: 'nanodua' },
        { name: 'Oracle', badge: 'dasar' },
      ],
    },
    {
      group: { id: 'Mobile & Bahasa', en: 'Mobile & Languages' },
      items: [
        { name: 'Android Studio', badge: 'nanodua' },
        { name: 'Java', badge: 'dasar' },
        { name: 'Python', badge: 'dasar' },
        { name: 'C++', badge: 'dasar' },
      ],
    },
    {
      group: { id: 'Analisis Sistem', en: 'Systems Analysis' },
      items: [
        { name: 'UML', badge: 'nanodua' },
        { name: 'ERD', badge: 'nanodua' },
        { name: 'DFD', badge: 'nanodua' },
      ],
    },
    {
      group: { id: 'Tools', en: 'Tools' },
      items: [
        { name: 'VS Code', badge: 'nanodua' },
        { name: 'Vite', badge: 'nanodua' },
        { name: 'Git', badge: 'mahir' },
        { name: 'GitHub', badge: 'nanodua' },
        { name: 'XAMPP', badge: 'nanodua' },
        { name: 'phpMyAdmin', badge: 'nanodua' },
      ],
    },
  ],
  softSkills: [
    'Kerja tim & kepemimpinan',
    'Komunikasi & negosiasi',
    'Pengambilan keputusan',
    'Berpikir kritis',
    'Kreatif',
    'Bertanggung jawab',
  ],
  milestones: [
    {
      year: '2026',
      title: { id: 'IPK 3,55 / 4,00', en: 'IPK 3.55 / 4.00' },
      description: {
        id: 'D-IV Manajemen Informatika, Politeknik Negeri Sriwijaya — hingga Semester 4',
        en: 'D-IV Informatics Management, Politeknik Negeri Sriwijaya — through semester 4',
      },
    },
    {
      year: '2022',
      title: {
        id: 'Juara 1 Lomba E-Sport PUBG Mobile — MADAGASCAR HUT RI ke-77',
        en: '1st Place PUBG Mobile Esports Competition — MADAGASCAR, 77th Indonesian Independence Day',
      },
      description: {
        id: 'Ketua tim: strategi dan pembagian peran',
        en: 'Team captain: strategy and role division',
      },
    },
    {
      year: '2024–sekarang',
      title: { id: 'Mahasiswa aktif D-IV Manajemen Informatika', en: 'Active D-IV Informatics Management student' },
      description: {
        id: 'Politeknik Negeri Sriwijaya',
        en: 'Politeknik Negeri Sriwijaya',
      },
    },
    {
      year: '2025–sekarang',
      title: { id: 'Pemimpin tim pada 4 proyek kolaboratif', en: 'Team leader on 4 collaborative projects' },
      description: { id: 'Dipublikasikan online', en: 'Published online' },
    },
    {
      year: '2026',
      title: { id: '3 proyek web dipublikasikan online', en: '3 web projects published online' },
      description: {
        id: '1 mandiri, 1 tim 4 orang, 1 tim 5 orang',
        en: '1 solo, 1 team of 4, 1 team of 5',
      },
    },
  ],
  journey: [
    {
      year: '2021–2024',
      title: { id: 'SMA Negeri 10 Palembang', en: 'SMA Negeri 10 Palembang' },
      org: { id: 'SMA Negeri 10 Palembang', en: 'SMA Negeri 10 Palembang' },
      points: [
        { id: 'Gitaris band', en: 'Band guitarist' },
        { id: 'Tampil di pentas seni dan lomba 17 Agustus', en: 'Performed at arts festivals and 17 August competitions' },
      ],
    },
    {
      year: '2024',
      title: { id: 'Mulai D-IV Manajemen Informatika, POLSRI', en: 'Started D-IV Informatics Management at POLSRI' },
      org: { id: 'Politeknik Negeri Sriwijaya', en: 'Politeknik Negeri Sriwijaya' },
      points: [
        { id: 'Dasar web, analisis sistem, basis data', en: 'Web fundamentals, systems analysis, databases' },
      ],
    },
    {
      year: '2025',
      title: { id: 'Nusantara Kopi', en: 'Nusantara Kopi' },
      org: { id: 'Event SINTAK', en: 'SINTAK event' },
      points: [
        { id: 'Frontend, tim 4 orang, live di Vercel', en: 'Frontend, team of 4, live on Vercel' },
      ],
    },
    {
      year: '2026',
      title: { id: 'Website Jurusan MI POLSRI', en: 'MI POLSRI Study Program Website' },
      org: { id: 'Mandiri', en: 'Solo' },
      points: [
        { id: 'Proyek web mandiri (PHP native + MySQL)', en: 'Solo web project (native PHP and MySQL)' },
      ],
    },
    {
      year: '2026',
      title: { id: 'LearnEase', en: 'LearnEase' },
      org: { id: 'Tim 5 orang', en: 'Team of 5' },
      points: [
        { id: 'Redesign UI/UX LMS POLSRI, termasuk pengujian otomatis', en: 'POLSRI LMS UI/UX redesign, including automated testing' },
      ],
    },
    {
      year: '2026',
      title: { id: 'Portofolio v3', en: 'Portfolio v3' },
      org: { id: 'Mandiri', en: 'Solo' },
      points: [
        { id: 'Next.js 16 + Three.js + Framer Motion', en: 'Next.js 16 + Three.js + Framer Motion' },
      ],
    },
  ],
};

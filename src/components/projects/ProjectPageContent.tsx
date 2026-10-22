'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Box,
  Calendar,
  Check,
  Clock,
  Code,
  ExternalLink,
  Github,
  Layers,
  Terminal,
  Users,
  X,
} from 'lucide-react';
import { Locale } from '@/lib/locale';
import { portfolioData } from '@/data/portfolio';
import { Project } from '@/types';
import { TechStack } from './TechStack';

function ImageOrBlock({ project, locale }: { project: Project; locale: Locale }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.title[locale]}
        className="block h-full w-full object-cover"
      />
    );
  }
  // Tanpa image: blok CSS dengan monogram, tidak ada gambar tiruan.
  return (
    <div className="flex h-full w-full items-center justify-center font-mono text-5xl font-bold text-muted-foreground">
      {project.title[locale].charAt(0).toUpperCase()}
    </div>
  );
}

function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</span>
      <h2 className="text-2xl font-bold text-foreground">{label}</h2>
    </div>
  );
}

export function ProjectPageContent({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [lightbox, setLightbox] = useState(false);

  const handleBack = () => {
    if (typeof window !== 'undefined' && document.referrer.includes('/projects')) {
      router.back();
    } else {
      router.push('/projects');
    }
  };

  const otherProjects = useMemo(
    () => portfolioData.projects.filter((p) => p.id !== project.id),
    [project.id],
  );

  const hasDemo = Boolean(project.demoUrl);
  const hasRepo = Boolean(project.repoUrl);

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-20 text-foreground sm:px-10 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={handleBack}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>{t('sections.backToProjects')}</span>
        </button>

        <h1 className="mb-6 text-4xl font-black leading-[1.0] tracking-tighter text-foreground md:text-5xl lg:text-7xl">
          {project.title[locale]}
        </h1>
        <p className="mb-12 max-w-3xl text-xl font-light leading-relaxed text-muted-foreground md:text-2xl">
          {project.description[locale]}
        </p>

        {/* Galeri visual: gambar hero, atau blok monogram bila tidak ada gambar. */}
        <section id="visual-gallery" className="mb-16">
          <SectionHeading icon={<Layers className="h-5 w-5" />} label={t('sections.visualGallery')} />
          <button
            type="button"
            disabled={!project.image}
            onClick={() => project.image && setLightbox(true)}
            className="relative block aspect-[2/1] w-full overflow-hidden rounded-2xl border border-border bg-secondary enabled:cursor-zoom-in"
          >
            <ImageOrBlock project={project} locale={locale} />
          </button>
        </section>

        {/* Metadata */}
        <div className="mb-16 grid grid-cols-2 gap-x-4 gap-y-6 border-y border-border/40 py-6 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Code className="h-3 w-3" /> {t('metadata.role')}
            </span>
            <span className="font-bold text-foreground">{project.role}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Calendar className="h-3 w-3" /> {t('metadata.timeline')}
            </span>
            <span className="font-mono font-bold text-foreground">{project.year}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Users className="h-3 w-3" /> {t('metadata.team')}
            </span>
            <span className="font-bold text-foreground">
              {project.team ?? t('metadata.teamValue')}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Layers className="h-3 w-3" /> {t('metadata.techStack')}
            </span>
            <span className="truncate font-bold text-foreground">
              {project.techStack.length} {t('metadata.techStack')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-20 lg:col-span-8">
            <section id="mission">
              <SectionHeading icon={<Box className="h-5 w-5" />} label={t('sections.missionBrief')} />
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {project.longDescription[locale]}
              </p>
            </section>

            <section id="key-features">
              <SectionHeading icon={<Check className="h-5 w-5" />} label={t('sections.keyFeatures')} />
              <ul className="max-w-2xl list-disc space-y-3 pl-6 text-muted-foreground">
                {project.highlights.map((h) => (
                  <li key={h.id} className="leading-relaxed">
                    {h[locale]}
                  </li>
                ))}
              </ul>
            </section>

            <section id="engineering-chronicles">
              <SectionHeading
                icon={<Clock className="h-5 w-5" />}
                label={t('sections.engineeringChronicles')}
              />
              <dl className="grid grid-cols-1 gap-4 text-muted-foreground sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <dt className="text-[10px] font-bold uppercase tracking-widest">{t('metadata.role')}</dt>
                  <dd className="font-medium text-foreground">{project.role}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[10px] font-bold uppercase tracking-widest">{t('metadata.team')}</dt>
                  <dd className="font-medium text-foreground">
                    {project.team ?? t('metadata.teamValue')}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[10px] font-bold uppercase tracking-widest">{t('metadata.timeline')}</dt>
                  <dd className="font-mono font-medium text-foreground">{project.year}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[10px] font-bold uppercase tracking-widest">
                    {t('sections.technologies')}
                  </dt>
                  <dd className="font-mono font-medium text-foreground">
                    {project.techStack.join(' · ')}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Instalasi hanya bermakna kalau ada repositori publik. */}
            {hasRepo && (
              <section id="installation">
                <SectionHeading icon={<Terminal className="h-5 w-5" />} label={t('sections.installation')} />
                <div className="max-w-md overflow-hidden rounded-lg border border-border bg-secondary">
                  <pre className="overflow-x-auto p-3 font-mono text-xs">{`git clone ${project.repoUrl}`}</pre>
                </div>
              </section>
            )}
          </div>

          <div className="relative lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {(hasDemo || hasRepo) && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {t('sections.projectAccess')}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {hasDemo && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>{t('sections.liveDemo')}</span>
                      </a>
                    )}
                    {hasRepo && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <Github className="h-4 w-4" />
                        <span>{t('sections.sourceCode')}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-6 border-b border-border/40 pb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {t('sections.technologies')}
                </h3>
                <TechStack techStack={project.techStack} />
              </div>

              <div>
                <h3 className="mb-6 border-b border-border/40 pb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {t('sections.contents')}
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <a href="#mission" className="block transition-colors hover:text-primary">
                      · {t('sections.missionBrief')}
                    </a>
                  </li>
                  <li>
                    <a href="#key-features" className="block transition-colors hover:text-primary">
                      · {t('sections.keyFeatures')}
                    </a>
                  </li>
                  <li>
                    <a href="#engineering-chronicles" className="block transition-colors hover:text-primary">
                      · {t('sections.engineeringChronicles')}
                    </a>
                  </li>
                  <li>
                    <a href="#visual-gallery" className="block transition-colors hover:text-primary">
                      · {t('sections.visualGallery')}
                    </a>
                  </li>
                  {hasRepo && (
                    <li>
                      <a href="#installation" className="block transition-colors hover:text-primary">
                        · {t('sections.installation')}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 border-t border-border/40 pt-16">
          <button
            onClick={handleBack}
            className="group mb-16 inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>{t('sections.backToProjects')}</span>
          </button>

          <h2 className="mb-8 text-2xl font-bold text-foreground">{t('sections.moreProjects')}</h2>
          <div className="-mx-6 flex snap-x gap-6 overflow-x-auto px-6 pb-4">
            {otherProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="group relative aspect-video w-[82vw] flex-none snap-center overflow-hidden rounded-xl border border-border/50 bg-secondary md:w-[calc(33.333%-1rem)]"
              >
                <ImageOrBlock project={p} locale={locale} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-5">
                  <h3 className="mb-1 line-clamp-1 text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {p.title[locale]}
                  </h3>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {p.techStack[0]} · {p.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {lightbox && project.image && (
          <div
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
          >
            <img
              src={project.image}
              alt={project.title[locale]}
              className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(false);
              }}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            >
              <span className="sr-only">{tCommon('close')}</span>
              <X className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

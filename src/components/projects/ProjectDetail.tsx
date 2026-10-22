'use client';

import { useTranslations } from 'next-intl';
import { ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/types';
import { TechStack } from './TechStack';

export function ProjectDetail({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const hasDemo = Boolean(project.demoUrl);
  const hasRepo = Boolean(project.repoUrl);

  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8 text-foreground">
      <div className="relative aspect-video rounded-xl overflow-hidden border border-border/60 bg-secondary">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title.id}
            loading="lazy"
            className="w-full h-full object-cover block"
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl bg-secondary/80 text-muted-foreground font-mono font-bold text-5xl">
            {project.title.id.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded border border-border text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
          {project.category}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{project.title.id}</h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{project.description.id}</p>
        <TechStack techStack={project.techStack} />
      </div>

      <div className="mt-auto flex flex-wrap gap-3 border-t border-border/60 pt-4">
        <span className="text-xs font-mono text-muted-foreground">
          {t('metadata.role')}: {project.role}
        </span>
        {hasRepo && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono border border-border bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>{t('sections.sourceCode')}</span>
          </a>
        )}
        {hasDemo && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{t('sections.liveDemo')}</span>
          </a>
        )}
      </div>
    </article>
  );
}

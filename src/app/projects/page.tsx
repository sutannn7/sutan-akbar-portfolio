'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portfolioData } from '@/data/portfolio';
import { PROJECT_FILTERS } from '@/data/projectFilters';
import { Project } from '@/types';

function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const hasDemo = Boolean(project.demoUrl);
  const hasRepo = Boolean(project.repoUrl);

  return (
    <article className={cn(
      "group flex flex-col h-full rounded-xl border border-border bg-card text-foreground",
      "hover:border-primary/50 transition-colors"
    )}>
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border/60 bg-secondary">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title.id}
            loading="lazy"
            className="w-full h-full object-cover block"
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg bg-secondary/80 text-muted-foreground font-mono font-bold text-3xl">
            {project.title.id.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded border border-border text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
          {project.category}
        </span>
      </div>

      <div className="pt-4 pb-2 flex flex-col gap-2">
        <Link href={`/projects/${project.slug}`} className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {project.title.id}
        </Link>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {project.description.id}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded border border-border/60 text-[10px] font-mono text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 pb-4 flex items-center gap-3 border-t border-border/60">
        {hasRepo && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
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
            onClick={(e) => e.stopPropagation()}
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

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return portfolioData.projects;
    return portfolioData.projects.filter((p) => p.techStack.includes(filter));
  }, [filter]);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight">
          {t('featured')}
        </h1>

        {/* Filter: Semua + daftar tech unik, state di useState (bukan URL). */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-mono border transition-colors",
              filter === 'all'
                ? "bg-primary text-primary-foreground border-transparent"
                : "border-border/60 text-muted-foreground hover:border-border hover:bg-secondary"
            )}
          >
            {t('filters.all')}
          </button>
          {PROJECT_FILTERS.map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-mono border transition-colors",
                filter === tech
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "border-border/60 text-muted-foreground hover:border-border hover:bg-secondary"
              )}
            >
              {tech}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

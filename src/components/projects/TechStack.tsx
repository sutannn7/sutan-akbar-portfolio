'use client';

import { cn } from '@/lib/utils';

export function TechStack({ techStack }: { techStack: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {techStack.map((tech) => (
        <span
          key={tech}
          className={cn(
            "px-2.5 py-1 rounded border border-border/60 bg-secondary/50",
            "text-[11px] font-mono font-medium text-muted-foreground"
          )}
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

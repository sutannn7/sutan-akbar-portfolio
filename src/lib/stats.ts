export interface StatsInput {
  projects: { demoUrl?: string; techStack?: string[] }[];
  lab: unknown[];
}

export interface Stats {
  projectsCount: number;
  liveCount: number;
  labCount: number;
  techCount: number;
}

export function computeStats(data: StatsInput): Stats {
  const projects = data.projects ?? [];
  const tech = new Set(projects.flatMap((p) => p.techStack ?? []).filter(Boolean));
  return {
    projectsCount: projects.length,
    liveCount: projects.filter(
      (p) => typeof p.demoUrl === 'string' && p.demoUrl.length > 0
    ).length,
    labCount: (data.lab ?? []).length,
    techCount: tech.size,
  };
}

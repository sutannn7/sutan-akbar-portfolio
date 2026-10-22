import { portfolioData } from '@/data/portfolio';

export const PROJECT_FILTERS: string[] = [
  ...new Set(portfolioData.projects.flatMap((p) => p.techStack)),
].sort();

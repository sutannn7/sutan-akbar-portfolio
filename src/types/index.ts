export type Localised = { id: string; en: string };
export type SkillBadge = 'dasar' | 'nanodua' | 'mahir';

export interface PortfolioData {
  personal: {
    name: string;
    title: Localised;
    subtitle: Localised;
    bio: Localised;
    avatar: string;
    location: string;
    email: string;
    phone: string;
    resumeUrl: string;
    links: { label: string; url: string; icon: string }[];
    languages: { name: string; level: string }[];
  };
  projects: Project[];
  lab: LabProject[];
  skills: { group: Localised; items: { name: string; badge: SkillBadge }[] }[];
  softSkills: string[];
  milestones: Milestone[];
  journey: JourneyEntry[];
}

export interface Project {
  id: string;
  slug: string;
  title: Localised;
  category: string;
  description: Localised;
  longDescription: Localised;
  highlights: Localised[];
  techStack: string[];
  role: string;
  team?: string;
  year: string;
  repoUrl?: string;
  demoUrl?: string;
  image?: string;
}

export interface LabProject {
  slug: string;
  title: Localised;
  tagline: Localised;
  problem: Localised;
  decision: Localised;
  techStack: string[];
  repoUrl: string;
  demoUrl: string;
  year: string;
  image: string;
}

export interface Milestone {
  year: string;
  title: Localised;
  description: Localised;
  href?: string;
}

export interface JourneyEntry {
  year: string;
  title: Localised;
  org: Localised;
  points: Localised[];
}

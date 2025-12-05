export interface ResumeHeader {
  name: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface EducationItem {
  id: string;
  school: string;
  location: string;
  degree: string;
  dates: string;
  coursework: string[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
  link?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  dates: string;
  bullets: string[];
  link?: string;
}

/**
 * Skills organized by category
 * Example: { "Languages": ["JavaScript", "Python"], "Frontend": ["React", "Next.js"] }
 */
export type Skills = Record<string, string[]>;

export interface Resume {
  header: ResumeHeader;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: Skills;
}

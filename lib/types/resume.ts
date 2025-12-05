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

export interface Skills {
  languages: string;
  frameworks: string;
  database: string;
  developerTools: string;
}

export interface Resume {
  header: ResumeHeader;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: Skills;
}

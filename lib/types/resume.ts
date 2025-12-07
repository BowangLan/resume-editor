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
  masterId?: string;  // Reference to master data item
  autoSync?: boolean; // When true, version edits should keep the master copy in sync
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
  link?: string;
  masterId?: string;  // Reference to master data item
  autoSync?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  dates: string;
  bullets: string[];
  link?: string;
  masterId?: string;  // Reference to master data item
  autoSync?: boolean;
}

/**
 * Skills organized by category (legacy format for backward compatibility)
 * Example: { "Languages": ["JavaScript", "Python"], "Frontend": ["React", "Next.js"] }
 */
export type Skills = Record<string, string[]>;

/**
 * Skill category with unique ID for better management in versions
 */
export interface SkillCategory {
  id: string;
  name: string;  // e.g., "Languages", "Frontend"
  skills: string[];
  masterId?: string;  // Reference to master data item
  autoSync?: boolean;
}

/**
 * Single resume (legacy format - maintained for backward compatibility)
 */
export interface Resume {
  header: ResumeHeader;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: Skills;
}

/**
 * Master data - the source of truth for all resume content
 * All versions reference and customize items from this master pool
 */
export interface MasterData {
  header: ResumeHeader;  // Shared across all versions
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
}

/**
 * Individual resume version with selected and customized items
 * Each version can independently customize items from master data
 */
export interface ResumeVersion {
  id: string;
  name: string;  // e.g., "Software Engineer Resume", "Data Science Resume"
  description?: string;
  createdAt: string;
  lastModified: string;

  // Selected and possibly customized items (stored as complete copies from master)
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
}

/**
 * Versioned store structure (new format)
 */
export interface VersionedResumeData {
  masterData: MasterData;
  versions: ResumeVersion[];
  currentVersionId: string | null;
}

/**
 * Legacy store structure (old format) - used for migration
 */
export interface LegacyResumeData {
  resume: Resume | null;
}

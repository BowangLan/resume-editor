import { Skills } from './resume';

/**
 * Represents an improvement to a single bullet point with explanation
 */
export interface BulletImprovement {
  original: string;
  improved: string;
  reason: string; // Explanation of why this change improves the resume
}

/**
 * Improvements for an experience item
 */
export interface ExperienceImprovement {
  id: string;
  bullets: BulletImprovement[];
}

/**
 * Improvements for a project item
 */
export interface ProjectImprovement {
  id: string;
  bullets: BulletImprovement[];
}

/**
 * Improvements for the skills section
 */
export interface SkillsImprovement {
  original: Skills;
  improved: Skills;
  reason: string; // Overall explanation for skill reorganization
}

/**
 * Complete set of improvements for a resume
 */
export interface ImprovedResume {
  experience: ExperienceImprovement[];
  projects: ProjectImprovement[];
  skills: SkillsImprovement;
}

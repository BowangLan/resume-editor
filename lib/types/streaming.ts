import { BulletImprovement } from './improvements';

/**
 * Types of items that can be improved
 */
export type ItemType = 'experience' | 'project' | 'skills';

/**
 * Status of an improvement item
 */
export type ItemStatus = 'pending' | 'processing' | 'completed' | 'error';

/**
 * Progress event for a single experience item improvement
 */
export interface ExperienceProgressEvent {
  type: 'experience';
  id: string;
  status: ItemStatus;
  title: string;
  company: string;
  bullets?: BulletImprovement[];
  error?: string;
}

/**
 * Progress event for a single project item improvement
 */
export interface ProjectProgressEvent {
  type: 'project';
  id: string;
  status: ItemStatus;
  name: string;
  bullets?: BulletImprovement[];
  error?: string;
}

/**
 * Progress event for skills section improvement
 */
export interface SkillsProgressEvent {
  type: 'skills';
  status: ItemStatus;
  original?: Record<string, string[]>;
  improved?: Record<string, string[]>;
  reason?: string;
  error?: string;
}

/**
 * Union type for all progress events
 */
export type ProgressEvent =
  | ExperienceProgressEvent
  | ProjectProgressEvent
  | SkillsProgressEvent;

/**
 * Overall progress summary
 */
export interface ProgressSummary {
  total: number;
  completed: number;
  processing: number;
  pending: number;
  failed: number;
}

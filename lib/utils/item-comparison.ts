import type { EducationItem, ExperienceItem, ProjectItem, SkillCategory } from '@/lib/types/resume';

/**
 * Deep comparison helper for arrays
 */
function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}

/**
 * Compare an education item with its master version
 * Returns true if they are different
 */
export function isEducationDifferentFromMaster(
  versionItem: EducationItem,
  masterItem: EducationItem | undefined
): boolean {
  if (!masterItem) return false; // No master item means it's custom

  return (
    versionItem.school !== masterItem.school ||
    versionItem.location !== masterItem.location ||
    versionItem.degree !== masterItem.degree ||
    versionItem.dates !== masterItem.dates ||
    !arraysEqual(versionItem.coursework, masterItem.coursework)
  );
}

/**
 * Compare an experience item with its master version
 * Returns true if they are different
 */
export function isExperienceDifferentFromMaster(
  versionItem: ExperienceItem,
  masterItem: ExperienceItem | undefined
): boolean {
  if (!masterItem) return false; // No master item means it's custom

  return (
    versionItem.title !== masterItem.title ||
    versionItem.company !== masterItem.company ||
    versionItem.location !== masterItem.location ||
    versionItem.dates !== masterItem.dates ||
    versionItem.link !== masterItem.link ||
    !arraysEqual(versionItem.bullets, masterItem.bullets)
  );
}

/**
 * Compare a project item with its master version
 * Returns true if they are different
 */
export function isProjectDifferentFromMaster(
  versionItem: ProjectItem,
  masterItem: ProjectItem | undefined
): boolean {
  if (!masterItem) return false; // No master item means it's custom

  return (
    versionItem.name !== masterItem.name ||
    versionItem.dates !== masterItem.dates ||
    versionItem.link !== masterItem.link ||
    !arraysEqual(versionItem.bullets, masterItem.bullets)
  );
}

/**
 * Compare a skill category with its master version
 * Returns true if they are different
 */
export function isSkillCategoryDifferentFromMaster(
  versionItem: SkillCategory,
  masterItem: SkillCategory | undefined
): boolean {
  if (!masterItem) return false; // No master item means it's custom

  return (
    versionItem.name !== masterItem.name ||
    !arraysEqual(versionItem.skills, masterItem.skills)
  );
}

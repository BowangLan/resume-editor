"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMemo } from 'react';
import type {
  Resume,
  ResumeHeader,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  Skills,
  SkillCategory,
  VersionedResumeData,
  LegacyResumeData,
} from '@/lib/types/resume';
import {
  isEducationDifferentFromMaster,
  isExperienceDifferentFromMaster,
  isProjectDifferentFromMaster,
  isSkillCategoryDifferentFromMaster,
} from '@/lib/utils/item-comparison';
import type { ImprovedResume } from '@/lib/types/improvements';

// Helper function to convert legacy Skills format to SkillCategory[]
function convertSkillsToCategories(skills: Skills): SkillCategory[] {
  return Object.entries(skills).map(([name, skillList]) => ({
    id: crypto.randomUUID(),
    name,
    skills: skillList,
  }));
}

// Helper function to convert SkillCategory[] back to legacy Skills format
function convertCategoriesToSkills(categories: SkillCategory[]): Skills {
  return categories.reduce((acc, category) => {
    acc[category.name] = category.skills;
    return acc;
  }, {} as Skills);
}

// Migration function to convert legacy data to versioned structure
function migrateLegacyData(legacy: LegacyResumeData): VersionedResumeData {
  if (!legacy.resume) {
    // No existing data - return empty versioned structure
    return {
      masterData: {
        header: {
          name: '',
          phone: '',
          email: '',
          website: '',
          linkedin: '',
          github: '',
        },
        education: [],
        experience: [],
        projects: [],
        skillCategories: [],
      },
      versions: [],
      currentVersionId: null,
    };
  }

  const resume = legacy.resume;
  const skillCategories = convertSkillsToCategories(resume.skills);
  const versionId = crypto.randomUUID();

  // Copy items and add masterId references
  const education = resume.education.map(item => ({ ...item, masterId: item.id }));
  const experience = resume.experience.map(item => ({ ...item, masterId: item.id }));
  const projects = resume.projects.map(item => ({ ...item, masterId: item.id }));
  const versionSkillCategories = skillCategories.map(cat => ({ ...cat, masterId: cat.id }));

  return {
    masterData: {
      header: resume.header,
      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      skillCategories,
    },
    versions: [
      {
        id: versionId,
        name: 'My Resume',
        description: 'Imported from previous version',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        education,
        experience,
        projects,
        skillCategories: versionSkillCategories,
      },
    ],
    currentVersionId: versionId,
  };
}

interface ResumeStore extends VersionedResumeData {

  // Master data actions
  addMasterEducation: (item: EducationItem) => void;
  updateMasterEducation: (id: string, updates: Partial<EducationItem>) => void;
  deleteMasterEducation: (id: string) => void;
  addMasterExperience: (item: ExperienceItem) => void;
  updateMasterExperience: (id: string, updates: Partial<ExperienceItem>) => void;
  deleteMasterExperience: (id: string) => void;
  addMasterProject: (item: ProjectItem) => void;
  updateMasterProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteMasterProject: (id: string) => void;
  addMasterSkillCategory: (category: SkillCategory) => void;
  updateMasterSkillCategory: (id: string, updates: Partial<SkillCategory>) => void;
  deleteMasterSkillCategory: (id: string) => void;
  updateMasterHeader: (header: Partial<ResumeHeader>) => void;

  // Version management actions
  createVersion: (name: string, description?: string) => string;
  deleteVersion: (versionId: string) => void;
  duplicateVersion: (versionId: string, newName: string) => string;
  switchVersion: (versionId: string) => void;
  renameVersion: (versionId: string, name: string, description?: string) => void;

  // Version content actions (for current version)
  addItemToCurrentVersion: (
    type: 'education' | 'experience' | 'projects' | 'skills',
    masterId: string
  ) => void;
  removeItemFromCurrentVersion: (
    type: 'education' | 'experience' | 'projects' | 'skills',
    itemId: string
  ) => void;
  updateCurrentVersionEducation: (education: EducationItem[]) => void;
  updateCurrentVersionExperience: (experience: ExperienceItem[]) => void;
  updateCurrentVersionProjects: (projects: ProjectItem[]) => void;
  updateCurrentVersionSkills: (skillCategories: SkillCategory[]) => void;
  reorderCurrentVersionItems: (
    type: 'education' | 'experience' | 'projects' | 'skills',
    itemIds: string[]
  ) => void;
  syncItemFromMaster: (
    type: 'education' | 'experience' | 'projects' | 'skills',
    itemId: string
  ) => void;
  promoteToMaster: (
    type: 'education' | 'experience' | 'projects' | 'skills',
    itemId: string
  ) => void;

  // Backward compatibility actions (delegate to current version or master)
  setResume: (resume: Resume) => void;
  updateHeader: (header: Partial<ResumeHeader>) => void;
  updateEducation: (education: EducationItem[]) => void;
  updateExperience: (experience: ExperienceItem[]) => void;
  updateProjects: (projects: ProjectItem[]) => void;
  updateSkills: (skills: Skills) => void;
  applyImprovements: (improvements: ImprovedResume) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      masterData: {
        header: {
          name: '',
          phone: '',
          email: '',
          website: '',
          linkedin: '',
          github: '',
        },
        education: [],
        experience: [],
        projects: [],
        skillCategories: [],
      },
      versions: [],
      currentVersionId: null,

      // Master data actions
      addMasterEducation: (item) =>
        set((state) => ({
          masterData: {
            ...state.masterData,
            education: [...state.masterData.education, item],
          },
        })),

      updateMasterEducation: (id, updates) =>
        set((state) => {
          const existing = state.masterData.education.find((item) => item.id === id);
          if (!existing) return state;

          const updatedItem: EducationItem = { ...existing, ...updates };

          let hasVersionUpdates = false;
          const versions = state.versions.map((version) => {
            let modified = false;
            const education = version.education.map((item) => {
              if (
                item.masterId === id &&
                !isEducationDifferentFromMaster(item, existing)
              ) {
                modified = true;
                return { ...updatedItem, id: item.id, masterId: item.masterId };
              }
              return item;
            });

            if (modified) {
              hasVersionUpdates = true;
              return {
                ...version,
                education,
                lastModified: new Date().toISOString(),
              };
            }
            return version;
          });

          return {
            masterData: {
              ...state.masterData,
              education: state.masterData.education.map((item) =>
                item.id === id ? updatedItem : item
              ),
            },
            versions: hasVersionUpdates ? versions : state.versions,
          };
        }),

      deleteMasterEducation: (id) =>
        set((state) => ({
          masterData: {
            ...state.masterData,
            education: state.masterData.education.filter((item) => item.id !== id),
          },
        })),

      addMasterExperience: (item) =>
        set((state) => ({
          masterData: {
            ...state.masterData,
            experience: [...state.masterData.experience, item],
          },
        })),

      updateMasterExperience: (id, updates) =>
        set((state) => {
          const existing = state.masterData.experience.find((item) => item.id === id);
          if (!existing) return state;

          const updatedItem: ExperienceItem = { ...existing, ...updates };

          let hasVersionUpdates = false;
          const versions = state.versions.map((version) => {
            let modified = false;
            const experience = version.experience.map((item) => {
              if (
                item.masterId === id &&
                !isExperienceDifferentFromMaster(item, existing)
              ) {
                modified = true;
                return { ...updatedItem, id: item.id, masterId: item.masterId };
              }
              return item;
            });

            if (modified) {
              hasVersionUpdates = true;
              return {
                ...version,
                experience,
                lastModified: new Date().toISOString(),
              };
            }
            return version;
          });

          return {
            masterData: {
              ...state.masterData,
              experience: state.masterData.experience.map((item) =>
                item.id === id ? updatedItem : item
              ),
            },
            versions: hasVersionUpdates ? versions : state.versions,
          };
        }),

      deleteMasterExperience: (id) =>
        set((state) => ({
          masterData: {
            ...state.masterData,
            experience: state.masterData.experience.filter((item) => item.id !== id),
          },
        })),

      addMasterProject: (item) =>
        set((state) => ({
          masterData: {
            ...state.masterData,
            projects: [...state.masterData.projects, item],
          },
        })),

      updateMasterProject: (id, updates) =>
        set((state) => {
          const existing = state.masterData.projects.find((item) => item.id === id);
          if (!existing) return state;

          const updatedItem: ProjectItem = { ...existing, ...updates };

          let hasVersionUpdates = false;
          const versions = state.versions.map((version) => {
            let modified = false;
            const projects = version.projects.map((item) => {
              if (
                item.masterId === id &&
                !isProjectDifferentFromMaster(item, existing)
              ) {
                modified = true;
                return { ...updatedItem, id: item.id, masterId: item.masterId };
              }
              return item;
            });

            if (modified) {
              hasVersionUpdates = true;
              return {
                ...version,
                projects,
                lastModified: new Date().toISOString(),
              };
            }
            return version;
          });

          return {
            masterData: {
              ...state.masterData,
              projects: state.masterData.projects.map((item) =>
                item.id === id ? updatedItem : item
              ),
            },
            versions: hasVersionUpdates ? versions : state.versions,
          };
        }),

      deleteMasterProject: (id) =>
        set((state) => ({
          masterData: {
            ...state.masterData,
            projects: state.masterData.projects.filter((item) => item.id !== id),
          },
        })),

      addMasterSkillCategory: (category) =>
        set((state) => ({
          masterData: {
            ...state.masterData,
            skillCategories: [...state.masterData.skillCategories, category],
          },
        })),

      updateMasterSkillCategory: (id, updates) =>
        set((state) => {
          const existing = state.masterData.skillCategories.find((cat) => cat.id === id);
          if (!existing) return state;

          const updatedItem: SkillCategory = { ...existing, ...updates };

          let hasVersionUpdates = false;
          const versions = state.versions.map((version) => {
            let modified = false;
            const skillCategories = version.skillCategories.map((cat) => {
              if (
                cat.masterId === id &&
                !isSkillCategoryDifferentFromMaster(cat, existing)
              ) {
                modified = true;
                return { ...updatedItem, id: cat.id, masterId: cat.masterId };
              }
              return cat;
            });

            if (modified) {
              hasVersionUpdates = true;
              return {
                ...version,
                skillCategories,
                lastModified: new Date().toISOString(),
              };
            }
            return version;
          });

          return {
            masterData: {
              ...state.masterData,
              skillCategories: state.masterData.skillCategories.map((cat) =>
                cat.id === id ? updatedItem : cat
              ),
            },
            versions: hasVersionUpdates ? versions : state.versions,
          };
        }),

      deleteMasterSkillCategory: (id) =>
        set((state) => ({
          masterData: {
            ...state.masterData,
            skillCategories: state.masterData.skillCategories.filter(
              (cat) => cat.id !== id
            ),
          },
        })),

      updateMasterHeader: (header) =>
        set((state) => ({
          masterData: {
            ...state.masterData,
            header: { ...state.masterData.header, ...header },
          },
        })),

      // Version management actions
      createVersion: (name, description) => {
        const versionId = crypto.randomUUID();
        set((state) => ({
          versions: [
            ...state.versions,
            {
              id: versionId,
              name,
              description,
              createdAt: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              education: [],
              experience: [],
              projects: [],
              skillCategories: [],
            },
          ],
          currentVersionId: versionId,
        }));
        return versionId;
      },

      deleteVersion: (versionId) =>
        set((state) => {
          const newVersions = state.versions.filter((v) => v.id !== versionId);
          return {
            versions: newVersions,
            currentVersionId:
              state.currentVersionId === versionId
                ? newVersions[0]?.id || null
                : state.currentVersionId,
          };
        }),

      duplicateVersion: (versionId, newName) => {
        const newVersionId = crypto.randomUUID();
        set((state) => {
          const sourceVersion = state.versions.find((v) => v.id === versionId);
          if (!sourceVersion) return state;

          return {
            versions: [
              ...state.versions,
              {
                ...sourceVersion,
                id: newVersionId,
                name: newName,
                description: `Copy of ${sourceVersion.name}`,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                // Deep copy all items
                education: sourceVersion.education.map((item) => ({ ...item })),
                experience: sourceVersion.experience.map((item) => ({ ...item })),
                projects: sourceVersion.projects.map((item) => ({ ...item })),
                skillCategories: sourceVersion.skillCategories.map((cat) => ({
                  ...cat,
                  skills: [...cat.skills],
                })),
              },
            ],
          };
        });
        return newVersionId;
      },

      switchVersion: (versionId) =>
        set((state) => {
          if (state.versions.find((v) => v.id === versionId)) {
            return { currentVersionId: versionId };
          }
          return state;
        }),

      renameVersion: (versionId, name, description) =>
        set((state) => ({
          versions: state.versions.map((v) =>
            v.id === versionId
              ? {
                  ...v,
                  name,
                  description: description !== undefined ? description : v.description,
                  lastModified: new Date().toISOString(),
                }
              : v
          ),
        })),

      // Version content actions
      addItemToCurrentVersion: (type, masterId) =>
        set((state) => {
          if (!state.currentVersionId) return state;

          const versionIndex = state.versions.findIndex(
            (v) => v.id === state.currentVersionId
          );
          if (versionIndex === -1) return state;

          let masterItem;
          switch (type) {
            case 'education':
              masterItem = state.masterData.education.find((i) => i.id === masterId);
              break;
            case 'experience':
              masterItem = state.masterData.experience.find((i) => i.id === masterId);
              break;
            case 'projects':
              masterItem = state.masterData.projects.find((i) => i.id === masterId);
              break;
            case 'skills':
              masterItem = state.masterData.skillCategories.find(
                (i) => i.id === masterId
              );
              break;
          }

          if (!masterItem) return state;

          // Create a copy with new ID and masterId reference
          const versionItem = {
            ...masterItem,
            id: crypto.randomUUID(),
            masterId: masterItem.id,
          };

          const newVersions = [...state.versions];
          const version = { ...newVersions[versionIndex] };

          if (type === 'education') {
            version.education = [...version.education, versionItem as EducationItem];
          } else if (type === 'experience') {
            version.experience = [...version.experience, versionItem as ExperienceItem];
          } else if (type === 'projects') {
            version.projects = [...version.projects, versionItem as ProjectItem];
          } else if (type === 'skills') {
            version.skillCategories = [
              ...version.skillCategories,
              versionItem as SkillCategory,
            ];
          }

          version.lastModified = new Date().toISOString();
          newVersions[versionIndex] = version;

          return { versions: newVersions };
        }),

      removeItemFromCurrentVersion: (type, itemId) =>
        set((state) => {
          if (!state.currentVersionId) return state;

          const versionIndex = state.versions.findIndex(
            (v) => v.id === state.currentVersionId
          );
          if (versionIndex === -1) return state;

          const newVersions = [...state.versions];
          const version = { ...newVersions[versionIndex] };

          if (type === 'education') {
            version.education = version.education.filter((item) => item.id !== itemId);
          } else if (type === 'experience') {
            version.experience = version.experience.filter(
              (item) => item.id !== itemId
            );
          } else if (type === 'projects') {
            version.projects = version.projects.filter((item) => item.id !== itemId);
          } else if (type === 'skills') {
            version.skillCategories = version.skillCategories.filter(
              (cat) => cat.id !== itemId
            );
          }

          version.lastModified = new Date().toISOString();
          newVersions[versionIndex] = version;

          return { versions: newVersions };
        }),

      updateCurrentVersionEducation: (education) =>
        set((state) => {
          if (!state.currentVersionId) return state;

          return {
            versions: state.versions.map((v) =>
              v.id === state.currentVersionId
                ? { ...v, education, lastModified: new Date().toISOString() }
                : v
            ),
          };
        }),

      updateCurrentVersionExperience: (experience) =>
        set((state) => {
          if (!state.currentVersionId) return state;

          return {
            versions: state.versions.map((v) =>
              v.id === state.currentVersionId
                ? { ...v, experience, lastModified: new Date().toISOString() }
                : v
            ),
          };
        }),

      updateCurrentVersionProjects: (projects) =>
        set((state) => {
          if (!state.currentVersionId) return state;

          return {
            versions: state.versions.map((v) =>
              v.id === state.currentVersionId
                ? { ...v, projects, lastModified: new Date().toISOString() }
                : v
            ),
          };
        }),

      updateCurrentVersionSkills: (skillCategories) =>
        set((state) => {
          if (!state.currentVersionId) return state;

          return {
            versions: state.versions.map((v) =>
              v.id === state.currentVersionId
                ? { ...v, skillCategories, lastModified: new Date().toISOString() }
                : v
            ),
          };
        }),

      reorderCurrentVersionItems: (type, itemIds) =>
        set((state) => {
          if (!state.currentVersionId) return state;

          const versionIndex = state.versions.findIndex(
            (v) => v.id === state.currentVersionId
          );
          if (versionIndex === -1) return state;

          const newVersions = [...state.versions];
          const version = { ...newVersions[versionIndex] };

          if (type === 'education') {
            version.education = itemIds
              .map((id) => version.education.find((item) => item.id === id))
              .filter(Boolean) as EducationItem[];
          } else if (type === 'experience') {
            version.experience = itemIds
              .map((id) => version.experience.find((item) => item.id === id))
              .filter(Boolean) as ExperienceItem[];
          } else if (type === 'projects') {
            version.projects = itemIds
              .map((id) => version.projects.find((item) => item.id === id))
              .filter(Boolean) as ProjectItem[];
          } else if (type === 'skills') {
            version.skillCategories = itemIds
              .map((id) => version.skillCategories.find((cat) => cat.id === id))
              .filter(Boolean) as SkillCategory[];
          }

          version.lastModified = new Date().toISOString();
          newVersions[versionIndex] = version;

          return { versions: newVersions };
        }),

      syncItemFromMaster: (type, itemId) =>
        set((state) => {
          if (!state.currentVersionId) return state;

          const versionIndex = state.versions.findIndex(
            (v) => v.id === state.currentVersionId
          );
          if (versionIndex === -1) return state;

          const newVersions = [...state.versions];
          const version = { ...newVersions[versionIndex] };

          // Helper to sync an item by finding masterId and updating from master
          const syncItem = <T extends { id: string; masterId?: string }>(
            items: T[],
            masterItems: T[]
          ): T[] => {
            return items.map((item) => {
              if (item.id === itemId && item.masterId) {
                const masterItem = masterItems.find((m) => m.id === item.masterId);
                if (masterItem) {
                  // Keep version item's ID but update all other fields from master
                  return { ...masterItem, id: item.id, masterId: item.masterId };
                }
              }
              return item;
            });
          };

          if (type === 'education') {
            version.education = syncItem(
              version.education,
              state.masterData.education
            );
          } else if (type === 'experience') {
            version.experience = syncItem(
              version.experience,
              state.masterData.experience
            );
          } else if (type === 'projects') {
            version.projects = syncItem(version.projects, state.masterData.projects);
          } else if (type === 'skills') {
            version.skillCategories = syncItem(
              version.skillCategories,
              state.masterData.skillCategories
            );
          }

          version.lastModified = new Date().toISOString();
          newVersions[versionIndex] = version;

          return { versions: newVersions };
        }),

      promoteToMaster: (type, itemId) =>
        set((state) => {
          if (!state.currentVersionId) return state;

          const version = state.versions.find((v) => v.id === state.currentVersionId);
          if (!version) return state;

          // Find the version item and its masterId
          let versionItem;
          let masterId;

          if (type === 'education') {
            versionItem = version.education.find((item) => item.id === itemId);
            masterId = versionItem?.masterId;
          } else if (type === 'experience') {
            versionItem = version.experience.find((item) => item.id === itemId);
            masterId = versionItem?.masterId;
          } else if (type === 'projects') {
            versionItem = version.projects.find((item) => item.id === itemId);
            masterId = versionItem?.masterId;
          } else if (type === 'skills') {
            versionItem = version.skillCategories.find((item) => item.id === itemId);
            masterId = versionItem?.masterId;
          }

          if (!versionItem || !masterId) return state;

          // Update the master item with version item's data
          const newMasterData = { ...state.masterData };

          if (type === 'education') {
            newMasterData.education = newMasterData.education.map((item) =>
              item.id === masterId ? { ...versionItem, id: masterId, masterId: undefined } as EducationItem : item
            );
          } else if (type === 'experience') {
            newMasterData.experience = newMasterData.experience.map((item) =>
              item.id === masterId ? { ...versionItem, id: masterId, masterId: undefined } as ExperienceItem : item
            );
          } else if (type === 'projects') {
            newMasterData.projects = newMasterData.projects.map((item) =>
              item.id === masterId ? { ...versionItem, id: masterId, masterId: undefined } as ProjectItem : item
            );
          } else if (type === 'skills') {
            newMasterData.skillCategories = newMasterData.skillCategories.map((item) =>
              item.id === masterId ? { ...versionItem, id: masterId, masterId: undefined } as SkillCategory : item
            );
          }

          return { masterData: newMasterData };
        }),

      // Backward compatibility actions
      setResume: (resume) => {
        const state = get();

        // Convert skills to categories
        const skillCategories = convertSkillsToCategories(resume.skills);

        // If no versions exist, create a default version with all items
        if (state.versions.length === 0) {
          const versionId = crypto.randomUUID();
          const education = resume.education.map(item => ({ ...item, masterId: item.id }));
          const experience = resume.experience.map(item => ({ ...item, masterId: item.id }));
          const projects = resume.projects.map(item => ({ ...item, masterId: item.id }));
          const versionSkillCategories = skillCategories.map(cat => ({ ...cat, masterId: cat.id }));

          set({
            masterData: {
              header: resume.header,
              education: resume.education,
              experience: resume.experience,
              projects: resume.projects,
              skillCategories,
            },
            versions: [
              {
                id: versionId,
                name: 'My Resume',
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                education,
                experience,
                projects,
                skillCategories: versionSkillCategories,
              },
            ],
            currentVersionId: versionId,
          });
        } else {
          // Versions exist - add new items to master data AND current version
          // Create version items with masterId references
          const versionEducation = resume.education.map(item => ({ ...item, masterId: item.id }));
          const versionExperience = resume.experience.map(item => ({ ...item, masterId: item.id }));
          const versionProjects = resume.projects.map(item => ({ ...item, masterId: item.id }));
          const versionSkillCategories = skillCategories.map(cat => ({ ...cat, masterId: cat.id }));

          set((state) => ({
            // Update master data with new items (append to existing)
            masterData: {
              header: resume.header,
              education: [...state.masterData.education, ...resume.education],
              experience: [...state.masterData.experience, ...resume.experience],
              projects: [...state.masterData.projects, ...resume.projects],
              skillCategories: [...state.masterData.skillCategories, ...skillCategories],
            },
            // Add items to current version
            versions: state.versions.map((v) =>
              v.id === state.currentVersionId
                ? {
                    ...v,
                    education: [...v.education, ...versionEducation],
                    experience: [...v.experience, ...versionExperience],
                    projects: [...v.projects, ...versionProjects],
                    skillCategories: [...v.skillCategories, ...versionSkillCategories],
                    lastModified: new Date().toISOString(),
                  }
                : v
            ),
          }));
        }
      },

      updateHeader: (header) => {
        get().updateMasterHeader(header);
      },

      updateEducation: (education) => {
        get().updateCurrentVersionEducation(education);
      },

      updateExperience: (experience) => {
        get().updateCurrentVersionExperience(experience);
      },

      updateProjects: (projects) => {
        get().updateCurrentVersionProjects(projects);
      },

      updateSkills: (skills) => {
        const skillCategories = convertSkillsToCategories(skills);
        get().updateCurrentVersionSkills(skillCategories);
      },

      applyImprovements: (improvements) =>
        set((state) => {
          if (!state.currentVersionId) return state;

          const versionIndex = state.versions.findIndex(
            (v) => v.id === state.currentVersionId
          );
          if (versionIndex === -1) return state;

          const version = state.versions[versionIndex];

          // Apply improvements to experience bullets
          const updatedExperience = version.experience.map((exp) => {
            const improvement = improvements.experience.find((imp) => imp.id === exp.id);
            if (improvement) {
              return {
                ...exp,
                bullets: improvement.bullets.map((b) => b.improved),
              };
            }
            return exp;
          });

          // Apply improvements to project bullets
          const updatedProjects = version.projects.map((proj) => {
            const improvement = improvements.projects.find((imp) => imp.id === proj.id);
            if (improvement) {
              return {
                ...proj,
                bullets: improvement.bullets.map((b) => b.improved),
              };
            }
            return proj;
          });

          // Apply improvements to skills
          const updatedSkillCategories = convertSkillsToCategories(
            improvements.skills.improved
          );

          const newVersions = [...state.versions];
          newVersions[versionIndex] = {
            ...version,
            experience: updatedExperience,
            projects: updatedProjects,
            skillCategories: updatedSkillCategories,
            lastModified: new Date().toISOString(),
          };

          return { versions: newVersions };
        }),

      reset: () =>
        set({
          masterData: {
            header: {
              name: '',
              phone: '',
              email: '',
              website: '',
              linkedin: '',
              github: '',
            },
            education: [],
            experience: [],
            projects: [],
            skillCategories: [],
          },
          versions: [],
          currentVersionId: null,
        }),
    }),
    {
      name: 'resume-storage',
      version: 1,
      // Only persist the actual state data, not computed getters
      partialize: (state) => ({
        masterData: state.masterData,
        versions: state.versions,
        currentVersionId: state.currentVersionId,
      }),
      migrate: (persistedState: unknown, version: number) => {
        // Handle migration from legacy format
        if ((version === 0 || !version) && persistedState && typeof persistedState === 'object') {
          // Check if this is legacy format
          if ('resume' in persistedState && !('masterData' in persistedState)) {
            console.log('Migrating from legacy resume format to versioned format...');
            return migrateLegacyData(persistedState as LegacyResumeData);
          }
        }
        return persistedState as ResumeStore;
      },
    }
  )
);

export const useCurrentResume = (): Resume | null => {
  const header = useResumeStore((state) => state.masterData.header);
  const currentVersion = useResumeStore((state) => {
    if (!state.currentVersionId) return null;
    return state.versions.find((v) => v.id === state.currentVersionId) ?? null;
  });

  return useMemo(() => {
    if (!currentVersion) return null;
    return {
      header,
      education: currentVersion.education,
      experience: currentVersion.experience,
      projects: currentVersion.projects,
      skills: convertCategoriesToSkills(currentVersion.skillCategories),
    };
  }, [currentVersion, header]);
};

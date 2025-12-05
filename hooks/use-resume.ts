"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Resume } from '@/lib/types/resume';
import type { ImprovedResume } from '@/lib/types/improvements';

interface ResumeStore {
  resume: Resume | null;
  setResume: (resume: Resume) => void;
  updateHeader: (header: Partial<Resume['header']>) => void;
  updateEducation: (education: Resume['education']) => void;
  updateExperience: (experience: Resume['experience']) => void;
  updateProjects: (projects: Resume['projects']) => void;
  updateSkills: (skills: Resume['skills']) => void;
  applyImprovements: (improvements: ImprovedResume) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: null,
      setResume: (resume) => set({ resume }),
      updateHeader: (header) =>
        set((state) => ({
          resume: state.resume
            ? { ...state.resume, header: { ...state.resume.header, ...header } }
            : null,
        })),
      updateEducation: (education) =>
        set((state) => ({
          resume: state.resume ? { ...state.resume, education } : null,
        })),
      updateExperience: (experience) =>
        set((state) => ({
          resume: state.resume ? { ...state.resume, experience } : null,
        })),
      updateProjects: (projects) =>
        set((state) => ({
          resume: state.resume ? { ...state.resume, projects } : null,
        })),
      updateSkills: (skills) =>
        set((state) => ({
          resume: state.resume
            ? { ...state.resume, skills }
            : null,
        })),
      applyImprovements: (improvements) =>
        set((state) => {
          if (!state.resume) return state;

          // Apply improvements to experience bullets
          const updatedExperience = state.resume.experience.map((exp) => {
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
          const updatedProjects = state.resume.projects.map((proj) => {
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
          const updatedSkills = improvements.skills.improved;

          return {
            resume: {
              ...state.resume,
              experience: updatedExperience,
              projects: updatedProjects,
              skills: updatedSkills,
            },
          };
        }),
      reset: () => set({ resume: null }),
    }),
    {
      name: 'resume-storage', // localStorage key
      skipHydration: false,
    }
  )
);

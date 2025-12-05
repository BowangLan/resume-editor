"use client";

import { create } from 'zustand';
import type { Resume } from '@/lib/types/resume';

interface ResumeStore {
  resume: Resume | null;
  setResume: (resume: Resume) => void;
  updateHeader: (header: Partial<Resume['header']>) => void;
  updateEducation: (education: Resume['education']) => void;
  updateExperience: (experience: Resume['experience']) => void;
  updateProjects: (projects: Resume['projects']) => void;
  updateSkills: (skills: Partial<Resume['skills']>) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
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
        ? { ...state.resume, skills: { ...state.resume.skills, ...skills } }
        : null,
    })),
  reset: () => set({ resume: null }),
}));

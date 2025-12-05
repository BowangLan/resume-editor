"use client";

import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load section components for better code splitting
const HeaderSection = lazy(() =>
  import('./sections/header-section').then((mod) => ({ default: mod.HeaderSection }))
);
const EducationSection = lazy(() =>
  import('./sections/education-section').then((mod) => ({ default: mod.EducationSection }))
);
const ExperienceSection = lazy(() =>
  import('./sections/experience-section').then((mod) => ({ default: mod.ExperienceSection }))
);
const ProjectsSection = lazy(() =>
  import('./sections/projects-section').then((mod) => ({ default: mod.ProjectsSection }))
);
const SkillsSection = lazy(() =>
  import('./sections/skills-section').then((mod) => ({ default: mod.SkillsSection }))
);

function SectionSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

export function ResumeEditor() {
  return (
    <div className="space-y-6 pb-12">
      <Suspense fallback={<SectionSkeleton />}>
        <HeaderSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <EducationSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ExperienceSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <SkillsSection />
      </Suspense>
    </div>
  );
}

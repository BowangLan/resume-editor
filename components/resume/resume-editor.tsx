"use client";

import { lazy, Suspense, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Lazy load section components for better code splitting
const HeaderSection = lazy(() =>
  import("./sections/header-section").then((mod) => ({
    default: mod.HeaderSection,
  }))
);
const EducationSection = lazy(() =>
  import("./sections/education-section").then((mod) => ({
    default: mod.EducationSection,
  }))
);
const ExperienceSection = lazy(() =>
  import("./sections/experience-section").then((mod) => ({
    default: mod.ExperienceSection,
  }))
);
const ProjectsSection = lazy(() =>
  import("./sections/projects-section").then((mod) => ({
    default: mod.ProjectsSection,
  }))
);
const SkillsSection = lazy(() =>
  import("./sections/skills-section").then((mod) => ({
    default: mod.SkillsSection,
  }))
);

const SECTION_CONFIG = [
  { key: "education", Component: EducationSection },
  { key: "experience", Component: ExperienceSection },
  { key: "projects", Component: ProjectsSection },
  { key: "skills", Component: SkillsSection },
] as const;

type SectionEntry = (typeof SECTION_CONFIG)[number];

function SectionChrome({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "[&_[data-slot=card]]:rounded-xl [&_[data-slot=card]]:border [&_[data-slot=card]]:border-border/70",
        "[&_[data-slot=card]]:shadow-none [&_[data-slot=card]]:bg-card",
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionSkeleton() {
  return (
    <Card className="border border-border/70 bg-card shadow-none">
      <CardContent className="space-y-3 pt-4">
        <Skeleton className="h-3 w-32 rounded-full" />
        <Skeleton className="h-4 w-44 rounded-full" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-2/3 rounded-md" />
      </CardContent>
    </Card>
  );
}

export function ResumeEditor() {
  return (
    <div className="space-y-8 pb-12 px-4">
      <SectionChrome>
        <Suspense fallback={<SectionSkeleton />}>
          <HeaderSection />
        </Suspense>
      </SectionChrome>

      <div className="grid grid-cols-1 gap-4">
        {SECTION_CONFIG.map(({ key, Component }: SectionEntry) => (
          <SectionChrome key={key}>
            <Suspense fallback={<SectionSkeleton />}>
              <Component />
            </Suspense>
          </SectionChrome>
        ))}
      </div>
    </div>
  );
}

"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import type { ProjectItem } from "@/lib/types/resume";
import { SectionContainer } from "./section-container";
import { ProjectItemEditor } from "./project-item-editor";
import { RichButton } from "@/components/ui/rich-button";

export const ProjectsSection = memo(function ProjectsSection() {
  const { resume, updateProjects } = useResumeStore();

  const handleAdd = useCallback(() => {
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      name: "",
      dates: "",
      bullets: [""],
      link: "",
    };
    updateProjects([...(resume?.projects || []), newItem]);
  }, [resume?.projects, updateProjects]);

  if (!resume) return null;

  return (
    <SectionContainer
      title="Projects"
      right={
        <RichButton
          onClick={handleAdd}
          size="icon-sm"
          variant="outline"
          tooltip="Add a new project entry"
        >
          <Plus />
        </RichButton>
      }
    >
      {resume.projects.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No project entries. Click "Add Project" to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {resume.projects.map((item, index) => (
            <ProjectItemEditor key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
});

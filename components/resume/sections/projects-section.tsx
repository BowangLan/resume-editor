"use client";

import { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Database } from "lucide-react";
import { useResumeStore, useCurrentResume } from "@/hooks/use-resume";
import type { ProjectItem } from "@/lib/types/resume";
import { SectionContainer } from "./section-container";
import { ProjectItemEditor } from "./project-item-editor";
import { RichButton } from "@/components/ui/rich-button";
import { ItemSelectorDialog } from "../item-selector-dialog";

export const ProjectsSection = memo(function ProjectsSection() {
  const resume = useCurrentResume();
  const updateProjects = useResumeStore((state) => state.updateProjects);
  const addMasterProject = useResumeStore((state) => state.addMasterProject);
  const [selectorOpen, setSelectorOpen] = useState(false);

  const handleAdd = useCallback(() => {
    const masterId = crypto.randomUUID();
    const masterItem: ProjectItem = {
      id: masterId,
      name: "",
      dates: "",
      bullets: [""],
      link: "",
      autoSync: true,
    };

    addMasterProject(masterItem);

    const versionItem: ProjectItem = {
      ...masterItem,
      id: crypto.randomUUID(),
      masterId,
    };
    updateProjects([...(resume?.projects || []), versionItem]);
  }, [addMasterProject, resume?.projects, updateProjects]);

  if (!resume) return null;

  return (
    <>
      <SectionContainer
        title="Projects"
        right={
          <div className="flex items-center gap-2">
            <RichButton
              onClick={() => setSelectorOpen(true)}
              size="icon-sm"
              variant="outline"
              tooltip="Add project from master data"
            >
              <Database />
            </RichButton>
            <RichButton
              onClick={handleAdd}
              size="icon-sm"
              variant="outline"
              tooltip="Add a new project entry"
            >
              <Plus />
            </RichButton>
          </div>
        }
      >
        {resume.projects.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-muted-foreground">
              No project entries in this version yet.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={() => setSelectorOpen(true)}
                variant="outline"
                size="sm"
              >
                <Database className="h-4 w-4" />
                Add from Master Data
              </Button>
              <Button onClick={handleAdd} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
                Create New
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {resume.projects.map((item, index) => (
              <ProjectItemEditor key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </SectionContainer>

      <ItemSelectorDialog
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        type="projects"
      />
    </>
  );
});

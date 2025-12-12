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
import { DropIndicator } from "./drop-indicator";
import {
  clearHighlights,
  getIndicators,
  highlightIndicator,
  reorderItems,
} from "@/lib/drag-drop-utils";

export const ProjectsSection = memo(function ProjectsSection() {
  const resume = useCurrentResume();
  const updateProjects = useResumeStore((state) => state.updateProjects);
  const addMasterProject = useResumeStore((state) => state.addMasterProject);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [active, setActive] = useState(false);

  const SECTION_ID = "projects";

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("itemId", itemId);
  }, []);

  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      const itemId = e.dataTransfer.getData("itemId");

      setActive(false);
      clearHighlights(getIndicators(SECTION_ID));

      const indicators = getIndicators(SECTION_ID);
      const { element } = indicators.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = e.clientY - (box.top + 50);

          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        {
          offset: Number.NEGATIVE_INFINITY,
          element: indicators[indicators.length - 1],
        }
      );

      const beforeId = element?.dataset.before || "-1";

      if (beforeId !== itemId) {
        const reordered = reorderItems(
          resume?.projects || [],
          itemId,
          beforeId === "-1" ? null : beforeId
        );
        updateProjects(reordered);
      }
    },
    [resume?.projects, updateProjects]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      highlightIndicator(e, SECTION_ID);
      setActive(true);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    clearHighlights(getIndicators(SECTION_ID));
    setActive(false);
  }, []);

  const handleAdd = useCallback(() => {
    const masterId = crypto.randomUUID();
    const masterItem: ProjectItem = {
      id: masterId,
      name: "",
      dates: "",
      bullets: [""],
      link: "",
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
          <div
            className={`space-y-3 transition-colors ${
              active ? "bg-accent/20" : ""
            }`}
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {resume.projects.map((item, index) => (
              <div key={item.id}>
                <DropIndicator beforeId={item.id} sectionId={SECTION_ID} />
                <ProjectItemEditor
                  item={item}
                  index={index}
                  draggable={true}
                  onDragStart={handleDragStart}
                />
              </div>
            ))}
            <DropIndicator beforeId={null} sectionId={SECTION_ID} />
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

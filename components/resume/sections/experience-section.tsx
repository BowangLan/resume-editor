"use client";

import { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Database } from "lucide-react";
import { useResumeStore, useCurrentResume } from "@/hooks/use-resume";
import type { ExperienceItem } from "@/lib/types/resume";
import { SectionContainer } from "./section-container";
import { ExperienceItemEditor } from "./experience-item-editor";
import { RichButton } from "@/components/ui/rich-button";
import { ItemSelectorDialog } from "../item-selector-dialog";
import { DropIndicator } from "./drop-indicator";
import {
  clearHighlights,
  getIndicators,
  highlightIndicator,
  reorderItems,
} from "@/lib/drag-drop-utils";

export const ExperienceSection = memo(function ExperienceSection() {
  const resume = useCurrentResume();
  const updateExperience = useResumeStore((state) => state.updateExperience);
  const addMasterExperience = useResumeStore(
    (state) => state.addMasterExperience
  );
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [active, setActive] = useState(false);

  const SECTION_ID = "experience";

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
          resume?.experience || [],
          itemId,
          beforeId === "-1" ? null : beforeId
        );
        updateExperience(reordered);
      }
    },
    [resume?.experience, updateExperience]
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
    const masterItem: ExperienceItem = {
      id: masterId,
      title: "",
      company: "",
      location: "",
      dates: "",
      bullets: [""],
      link: "",
    };

    addMasterExperience(masterItem);

    const versionItem: ExperienceItem = {
      ...masterItem,
      id: crypto.randomUUID(),
      masterId,
    };
    updateExperience([...(resume?.experience || []), versionItem]);
  }, [addMasterExperience, resume?.experience, updateExperience]);

  if (!resume) return null;

  return (
    <>
      <SectionContainer
        title="Experience"
        right={
          <div className="flex items-center gap-2">
            <RichButton
              onClick={() => setSelectorOpen(true)}
              size="icon-sm"
              variant="outline"
              tooltip="Add experience from master data"
            >
              <Database />
            </RichButton>
            <RichButton
              onClick={handleAdd}
              size="icon-sm"
              variant="outline"
              tooltip="Add a new experience entry"
            >
              <Plus />
            </RichButton>
          </div>
        }
      >
        {resume.experience.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-muted-foreground">
              No experience entries in this version yet.
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
            {resume.experience.map((item, index) => (
              <div key={item.id}>
                <DropIndicator beforeId={item.id} sectionId={SECTION_ID} />
                <ExperienceItemEditor
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
        type="experience"
      />
    </>
  );
});

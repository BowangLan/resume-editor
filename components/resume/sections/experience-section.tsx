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

export const ExperienceSection = memo(function ExperienceSection() {
  const resume = useCurrentResume();
  const updateExperience = useResumeStore((state) => state.updateExperience);
  const addMasterExperience = useResumeStore(
    (state) => state.addMasterExperience
  );
  const [selectorOpen, setSelectorOpen] = useState(false);

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
          <div className="space-y-3">
            {resume.experience.map((item, index) => (
              <ExperienceItemEditor key={item.id} item={item} index={index} />
            ))}
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

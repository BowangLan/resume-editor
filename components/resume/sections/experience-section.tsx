"use client";

import { memo, useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Database } from "lucide-react";
import { FormField } from "../form-field";
import { BulletListEditor } from "../bullet-list-editor";
import { useResumeStore, useCurrentResume } from "@/hooks/use-resume";
import type { ExperienceItem } from "@/lib/types/resume";
import { Separator } from "@/components/ui/separator";
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
      autoSync: true,
    };

    addMasterExperience(masterItem);

    const versionItem: ExperienceItem = {
      ...masterItem,
      id: crypto.randomUUID(),
      masterId,
    };
    updateExperience([...(resume?.experience || []), versionItem]);
  }, [addMasterExperience, resume?.experience, updateExperience]);

  const handleRemove = useCallback(
    (id: string) => {
      updateExperience(
        (resume?.experience || []).filter((item) => item.id !== id)
      );
    },
    [resume?.experience, updateExperience]
  );

  const handleChange = useCallback(
    (id: string, field: keyof ExperienceItem, value: unknown) => {
      const items = resume?.experience || [];
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return;

      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateExperience(newItems);
    },
    [resume?.experience, updateExperience]
  );

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

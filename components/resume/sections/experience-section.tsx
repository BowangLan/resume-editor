"use client";

import { memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { FormField } from "../form-field";
import { BulletListEditor } from "../bullet-list-editor";
import { useResumeStore } from "@/hooks/use-resume";
import type { ExperienceItem } from "@/lib/types/resume";
import { Separator } from "@/components/ui/separator";
import { SectionContainer } from "./section-container";
import { ExperienceItemEditor } from "./experience-item-editor";
import { RichButton } from "@/components/ui/rich-button";

export const ExperienceSection = memo(function ExperienceSection() {
  const { resume, updateExperience } = useResumeStore();

  const handleAdd = useCallback(() => {
    const newItem: ExperienceItem = {
      id: crypto.randomUUID(),
      title: "",
      company: "",
      location: "",
      dates: "",
      bullets: [""],
      link: "",
    };
    updateExperience([...(resume?.experience || []), newItem]);
  }, [resume?.experience, updateExperience]);

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
    <SectionContainer
      title="Experience"
      right={
        <RichButton
          onClick={handleAdd}
          size="icon-sm"
          variant="outline"
          tooltip="Add a new experience entry"
        >
          <Plus />
        </RichButton>
      }
    >
      {resume.experience.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No experience entries. Click "Add Experience" to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {resume.experience.map((item, index) => (
            <ExperienceItemEditor key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
});

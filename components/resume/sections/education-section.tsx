"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import type { EducationItem } from "@/lib/types/resume";
import { SectionContainer } from "./section-container";
import { EducationItemEditor } from "./education-item-editor";
import { RichButton } from "@/components/ui/rich-button";

export const EducationSection = memo(function EducationSection() {
  const { resume, updateEducation } = useResumeStore();

  const handleAdd = useCallback(() => {
    const newItem: EducationItem = {
      id: crypto.randomUUID(),
      school: "",
      location: "",
      degree: "",
      dates: "",
      coursework: [],
    };
    updateEducation([...(resume?.education || []), newItem]);
  }, [resume?.education, updateEducation]);

  if (!resume) return null;

  return (
    <SectionContainer
      title="Education"
      right={
        <RichButton
          onClick={handleAdd}
          size="icon-sm"
          variant="outline"
          tooltip="Add a new education entry"
        >
          <Plus />
        </RichButton>
      }
    >
      {resume.education.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No education entries. Click "Add Education" to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {resume.education.map((item, index) => (
            <EducationItemEditor key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
});

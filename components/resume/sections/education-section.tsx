"use client";

import { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Database } from "lucide-react";
import { useResumeStore, useCurrentResume } from "@/hooks/use-resume";
import type { EducationItem } from "@/lib/types/resume";
import { SectionContainer } from "./section-container";
import { EducationItemEditor } from "./education-item-editor";
import { RichButton } from "@/components/ui/rich-button";
import { ItemSelectorDialog } from "../item-selector-dialog";

export const EducationSection = memo(function EducationSection() {
  const resume = useCurrentResume();
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const addMasterEducation = useResumeStore(
    (state) => state.addMasterEducation
  );
  const [selectorOpen, setSelectorOpen] = useState(false);

  const handleAdd = useCallback(() => {
    const masterId = crypto.randomUUID();
    const masterItem: EducationItem = {
      id: masterId,
      school: "",
      location: "",
      degree: "",
      dates: "",
      coursework: [],
    };

    addMasterEducation(masterItem);

    const versionItem: EducationItem = {
      ...masterItem,
      id: crypto.randomUUID(),
      masterId,
    };
    updateEducation([...(resume?.education || []), versionItem]);
  }, [addMasterEducation, resume?.education, updateEducation]);

  if (!resume) return null;

  return (
    <>
      <SectionContainer
        title="Education"
        right={
          <div className="flex items-center gap-2">
            <RichButton
              onClick={() => setSelectorOpen(true)}
              size="icon-sm"
              variant="outline"
              tooltip="Add education from master data"
            >
              <Database />
            </RichButton>
            <RichButton
              onClick={handleAdd}
              size="icon-sm"
              variant="outline"
              tooltip="Add a new education entry"
            >
              <Plus />
            </RichButton>
          </div>
        }
      >
        {resume.education.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-muted-foreground">
              No education entries in this version yet.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={() => setSelectorOpen(true)}
                variant="outline"
                size="sm"
              >
                <Database className="h-4 w-4" />
              </Button>
              <Button onClick={handleAdd} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
                Create New
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {resume.education.map((item, index) => (
              <EducationItemEditor key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </SectionContainer>

      <ItemSelectorDialog
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        type="education"
      />
    </>
  );
});

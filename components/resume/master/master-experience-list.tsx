"use client";

import { memo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RichButton } from "@/components/ui/rich-button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Check, Trash2, Briefcase } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import type { ExperienceItem } from "@/lib/types/resume";
import { BulletListEditor } from "../bullet-list-editor";
import { FormField } from "../form-field";
import { SectionItemContainer } from "../sections/section-item-container";
import { toast } from "sonner";

const MasterExperienceItemEditor = ({
  item,
  onUpdate,
  onRemove,
  usageCount,
}: {
  item: ExperienceItem;
  onUpdate: (id: string, updates: Partial<ExperienceItem>) => void;
  onRemove: (id: string) => void;
  usageCount: number;
}) => {
  const [open, setOpen] = useState(false);

  const handleChange = useCallback(
    (field: keyof ExperienceItem, value: unknown) => {
      onUpdate(item.id, { [field]: value });
    },
    [item.id, onUpdate]
  );

  const subtitle = [item.company, item.dates].filter(Boolean).join(" · ");

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={item.title}
      subtitle={subtitle}
      right={
        <>
          {usageCount > 0 && (
            <Badge variant="secondary" className="mr-2">
              Used in {usageCount} {usageCount === 1 ? "version" : "versions"}
            </Badge>
          )}
          <RichButton
            onClick={() => onRemove(item.id)}
            size="sm"
            variant="ghost"
            className="text-destructive group-hover:opacity-100 opacity-0 trans"
          >
            <Trash2 className="h-4 w-4" />
          </RichButton>
          {open ? (
            <RichButton
              onClick={() => setOpen(false)}
              size="sm"
              variant="default"
            >
              <Check className="h-4 w-4" />
              Done
            </RichButton>
          ) : (
            <RichButton
              onClick={() => setOpen(true)}
              size="sm"
              variant="ghost"
            >
              Edit
            </RichButton>
          )}
        </>
      }
    >
      <div className="space-y-4 px-3 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Job Title"
            value={item.title}
            onChange={(value) => handleChange("title", value)}
            placeholder="Software Engineer"
            required
          />
          <FormField
            label="Dates"
            value={item.dates}
            onChange={(value) => handleChange("dates", value)}
            placeholder="Jan 2023 -- Present"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Company"
            value={item.company}
            onChange={(value) => handleChange("company", value)}
            placeholder="Tech Corp"
            required
          />
          <FormField
            label="Location"
            value={item.location}
            onChange={(value) => handleChange("location", value)}
            placeholder="City, State"
          />
        </div>

        <FormField
          label="Link (optional)"
          value={item.link || ""}
          onChange={(value) => handleChange("link", value)}
          placeholder="https://company.com"
        />

        <BulletListEditor
          bullets={item.bullets}
          onChange={(value) => handleChange("bullets", value)}
          label="Achievements & Responsibilities"
        />
      </div>
    </SectionItemContainer>
  );
};

export const MasterExperienceList = memo(function MasterExperienceList() {
  const masterExperience = useResumeStore((state) => state.masterData.experience);
  const addMasterExperience = useResumeStore((state) => state.addMasterExperience);
  const updateMasterExperience = useResumeStore((state) => state.updateMasterExperience);
  const deleteMasterExperience = useResumeStore((state) => state.deleteMasterExperience);
  const versions = useResumeStore((state) => state.versions);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    const newItem: ExperienceItem = {
      id: crypto.randomUUID(),
      title: "New Experience",
      company: "",
      location: "",
      dates: "",
      bullets: [""],
      link: "",
    };
    addMasterExperience(newItem);
    toast.success("Experience added to master data");
  };

  const handleUpdate = useCallback(
    (id: string, updates: Partial<ExperienceItem>) => {
      updateMasterExperience(id, updates);
    },
    [updateMasterExperience]
  );

  const handleRemove = useCallback(
    (id: string) => {
      setDeletingId(id);
    },
    []
  );

  const handleDelete = () => {
    if (deletingId) {
      deleteMasterExperience(deletingId);
      toast.success("Experience deleted from master data");
      setDeletingId(null);
    }
  };

  const getUsageCount = (itemId: string) => {
    return versions.filter((v) =>
      v.experience.some((exp) => exp.masterId === itemId)
    ).length;
  };

  const deletingItem = masterExperience.find((exp) => exp.id === deletingId);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {masterExperience.length === 0
              ? "No experiences in master data yet"
              : `${masterExperience.length} ${
                  masterExperience.length === 1 ? "experience" : "experiences"
                } in master pool`}
          </p>
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        </div>

        {masterExperience.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No experiences in your master data yet.
            </p>
            <Button onClick={handleCreate} variant="outline">
              <Plus className="h-4 w-4" />
              Add Your First Experience
            </Button>
          </div>
        ) : (
          masterExperience.map((exp) => (
            <MasterExperienceItemEditor
              key={exp.id}
              item={exp}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              usageCount={getUsageCount(exp.id)}
            />
          ))
        )}
      </div>

      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingItem?.title}" from your master
              data? This will not affect existing items in your resume versions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

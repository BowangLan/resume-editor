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
import { Plus, Check, Trash2, GraduationCap } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import type { EducationItem } from "@/lib/types/resume";
import { BulletListEditor } from "../bullet-list-editor";
import { FormField } from "../form-field";
import { SectionItemContainer } from "../sections/section-item-container";
import { toast } from "sonner";

const MasterEducationItemEditor = ({
  item,
  onUpdate,
  onRemove,
  usageCount,
}: {
  item: EducationItem;
  onUpdate: (id: string, updates: Partial<EducationItem>) => void;
  onRemove: (id: string) => void;
  usageCount: number;
}) => {
  const [open, setOpen] = useState(false);

  const handleChange = useCallback(
    (field: keyof EducationItem, value: unknown) => {
      onUpdate(item.id, { [field]: value });
    },
    [item.id, onUpdate]
  );

  const subtitle = [item.location, item.dates].filter(Boolean).join(" · ");

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={item.school}
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
            <RichButton onClick={() => setOpen(true)} size="sm" variant="ghost">
              Edit
            </RichButton>
          )}
        </>
      }
    >
      <div className="space-y-4 px-3 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="School"
            value={item.school}
            onChange={(value) => handleChange("school", value)}
            placeholder="University Name"
            required
          />
          <FormField
            label="Location"
            value={item.location}
            onChange={(value) => handleChange("location", value)}
            placeholder="City, State"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Degree"
            value={item.degree}
            onChange={(value) => handleChange("degree", value)}
            placeholder="Bachelor of Science in Computer Science"
            required
          />
          <FormField
            label="Dates"
            value={item.dates}
            onChange={(value) => handleChange("dates", value)}
            placeholder="Sep 2016 -- May 2020"
          />
        </div>

        <BulletListEditor
          bullets={item.coursework}
          onChange={(value) => handleChange("coursework", value)}
          label="Relevant Coursework (optional)"
        />
      </div>
    </SectionItemContainer>
  );
};

export const MasterEducationList = memo(function MasterEducationList() {
  const masterEducation = useResumeStore((state) => state.masterData.education);
  const addMasterEducation = useResumeStore(
    (state) => state.addMasterEducation
  );
  const updateMasterEducation = useResumeStore(
    (state) => state.updateMasterEducation
  );
  const deleteMasterEducation = useResumeStore(
    (state) => state.deleteMasterEducation
  );
  const versions = useResumeStore((state) => state.versions);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    const newItem: EducationItem = {
      id: crypto.randomUUID(),
      school: "New Education",
      location: "",
      degree: "",
      dates: "",
      coursework: [],
    };
    addMasterEducation(newItem);
    toast.success("Education added to master data");
  };

  const handleUpdate = useCallback(
    (id: string, updates: Partial<EducationItem>) => {
      updateMasterEducation(id, updates);
    },
    [updateMasterEducation]
  );

  const handleRemove = useCallback((id: string) => {
    setDeletingId(id);
  }, []);

  const handleDelete = () => {
    if (deletingId) {
      deleteMasterEducation(deletingId);
      toast.success("Education deleted from master data");
      setDeletingId(null);
    }
  };

  const getUsageCount = (itemId: string) => {
    return versions.filter((v) =>
      v.education.some((edu) => edu.masterId === itemId)
    ).length;
  };

  const deletingItem = masterEducation.find((edu) => edu.id === deletingId);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {masterEducation.length === 0
              ? "No education entries in master data yet"
              : `${masterEducation.length} ${
                  masterEducation.length === 1 ? "entry" : "entries"
                } in master pool`}
          </p>
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        </div>

        {masterEducation.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No education entries in your master data yet.
            </p>
            <Button onClick={handleCreate} variant="outline">
              <Plus className="h-4 w-4" />
              Add Your First Education
            </Button>
          </div>
        ) : (
          masterEducation.map((edu) => (
            <MasterEducationItemEditor
              key={edu.id}
              item={edu}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              usageCount={getUsageCount(edu.id)}
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
            <AlertDialogTitle>Delete Education</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingItem?.school}" from your
              master data? This will not affect existing items in your resume
              versions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

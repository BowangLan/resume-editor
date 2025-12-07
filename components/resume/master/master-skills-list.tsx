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
import { Plus, Check, Trash2, Code } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import type { SkillCategory } from "@/lib/types/resume";
import { BulletListEditor } from "../bullet-list-editor";
import { FormField } from "../form-field";
import { SectionItemContainer } from "../sections/section-item-container";
import { toast } from "sonner";

const MasterSkillCategoryEditor = ({
  item,
  onUpdate,
  onRemove,
  usageCount,
}: {
  item: SkillCategory;
  onUpdate: (id: string, updates: Partial<SkillCategory>) => void;
  onRemove: (id: string) => void;
  usageCount: number;
}) => {
  const [open, setOpen] = useState(false);

  const handleChange = useCallback(
    (field: keyof SkillCategory, value: unknown) => {
      onUpdate(item.id, { [field]: value });
    },
    [item.id, onUpdate]
  );

  const subtitle = `${item.skills.length} ${item.skills.length === 1 ? "skill" : "skills"}`;

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={item.name}
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
        <FormField
          label="Category Name"
          value={item.name}
          onChange={(value) => handleChange("name", value)}
          placeholder="e.g., Languages, Frameworks, Tools"
          required
        />

        <BulletListEditor
          bullets={item.skills}
          onChange={(value) => handleChange("skills", value)}
          label="Skills"
          placeholder="Add a skill..."
        />
      </div>
    </SectionItemContainer>
  );
};

export const MasterSkillsList = memo(function MasterSkillsList() {
  const masterSkills = useResumeStore((state) => state.masterData.skillCategories);
  const addMasterSkillCategory = useResumeStore((state) => state.addMasterSkillCategory);
  const updateMasterSkillCategory = useResumeStore((state) => state.updateMasterSkillCategory);
  const deleteMasterSkillCategory = useResumeStore((state) => state.deleteMasterSkillCategory);
  const versions = useResumeStore((state) => state.versions);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    const newItem: SkillCategory = {
      id: crypto.randomUUID(),
      name: "New Category",
      skills: [""],
    };
    addMasterSkillCategory(newItem);
    toast.success("Skill category added to master data");
  };

  const handleUpdate = useCallback(
    (id: string, updates: Partial<SkillCategory>) => {
      // Filter out empty skills before updating
      if (updates.skills) {
        updates.skills = updates.skills.filter((s) => s.trim().length > 0);
      }
      updateMasterSkillCategory(id, updates);
    },
    [updateMasterSkillCategory]
  );

  const handleRemove = useCallback(
    (id: string) => {
      setDeletingId(id);
    },
    []
  );

  const handleDelete = () => {
    if (deletingId) {
      deleteMasterSkillCategory(deletingId);
      toast.success("Skill category deleted from master data");
      setDeletingId(null);
    }
  };

  const getUsageCount = (itemId: string) => {
    return versions.filter((v) =>
      v.skillCategories.some((cat) => cat.masterId === itemId)
    ).length;
  };

  const deletingItem = masterSkills.find((cat) => cat.id === deletingId);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {masterSkills.length === 0
              ? "No skill categories in master data yet"
              : `${masterSkills.length} ${
                  masterSkills.length === 1 ? "category" : "categories"
                } in master pool`}
          </p>
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {masterSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <Code className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No skill categories in your master data yet.
            </p>
            <Button onClick={handleCreate} variant="outline">
              <Plus className="h-4 w-4" />
              Add Your First Category
            </Button>
          </div>
        ) : (
          masterSkills.map((cat) => (
            <MasterSkillCategoryEditor
              key={cat.id}
              item={cat}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              usageCount={getUsageCount(cat.id)}
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
            <AlertDialogTitle>Delete Skill Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingItem?.name}" from your master
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

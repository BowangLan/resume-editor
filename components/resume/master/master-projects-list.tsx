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
import { Plus, Check, Trash2, FolderKanban } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import type { ProjectItem } from "@/lib/types/resume";
import { BulletListEditor } from "../bullet-list-editor";
import { FormField } from "../form-field";
import { SectionItemContainer } from "../sections/section-item-container";
import { toast } from "sonner";

const MasterProjectItemEditor = ({
  item,
  onUpdate,
  onRemove,
  usageCount,
}: {
  item: ProjectItem;
  onUpdate: (id: string, updates: Partial<ProjectItem>) => void;
  onRemove: (id: string) => void;
  usageCount: number;
}) => {
  const [open, setOpen] = useState(false);

  const handleChange = useCallback(
    (field: keyof ProjectItem, value: unknown) => {
      onUpdate(item.id, { [field]: value });
    },
    [item.id, onUpdate]
  );

  const subtitle = item.dates || "";

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
          label="Project Name"
          value={item.name}
          onChange={(value) => handleChange("name", value)}
          placeholder="My Awesome Project"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Dates"
            value={item.dates}
            onChange={(value) => handleChange("dates", value)}
            placeholder="Jan 2023 -- Mar 2023"
          />
          <FormField
            label="Link (optional)"
            value={item.link || ""}
            onChange={(value) => handleChange("link", value)}
            placeholder="https://github.com/user/project"
          />
        </div>

        <BulletListEditor
          bullets={item.bullets}
          onChange={(value) => handleChange("bullets", value)}
          label="Description & Achievements"
        />
      </div>
    </SectionItemContainer>
  );
};

export const MasterProjectsList = memo(function MasterProjectsList() {
  const masterProjects = useResumeStore((state) => state.masterData.projects);
  const addMasterProject = useResumeStore((state) => state.addMasterProject);
  const updateMasterProject = useResumeStore((state) => state.updateMasterProject);
  const deleteMasterProject = useResumeStore((state) => state.deleteMasterProject);
  const versions = useResumeStore((state) => state.versions);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      name: "New Project",
      dates: "",
      bullets: [""],
      link: "",
    };
    addMasterProject(newItem);
    toast.success("Project added to master data");
  };

  const handleUpdate = useCallback(
    (id: string, updates: Partial<ProjectItem>) => {
      updateMasterProject(id, updates);
    },
    [updateMasterProject]
  );

  const handleRemove = useCallback(
    (id: string) => {
      setDeletingId(id);
    },
    []
  );

  const handleDelete = () => {
    if (deletingId) {
      deleteMasterProject(deletingId);
      toast.success("Project deleted from master data");
      setDeletingId(null);
    }
  };

  const getUsageCount = (itemId: string) => {
    return versions.filter((v) =>
      v.projects.some((proj) => proj.masterId === itemId)
    ).length;
  };

  const deletingItem = masterProjects.find((proj) => proj.id === deletingId);

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {masterProjects.length === 0
              ? "No projects in master data yet"
              : `${masterProjects.length} ${
                  masterProjects.length === 1 ? "project" : "projects"
                } in master pool`}
          </p>
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>

        {masterProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No projects in your master data yet.
            </p>
            <Button onClick={handleCreate} variant="outline">
              <Plus className="h-4 w-4" />
              Add Your First Project
            </Button>
          </div>
        ) : (
          masterProjects.map((proj) => (
            <MasterProjectItemEditor
              key={proj.id}
              item={proj}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              usageCount={getUsageCount(proj.id)}
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
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
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

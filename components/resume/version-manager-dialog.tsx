"use client";

import { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Copy, Trash2, Calendar } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface EditVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versionId: string;
  initialName: string;
  initialDescription?: string;
}

function EditVersionDialog({
  open,
  onOpenChange,
  versionId,
  initialName,
  initialDescription = "",
}: EditVersionDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const renameVersion = useResumeStore((state) => state.renameVersion);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter a version name");
      return;
    }

    renameVersion(versionId, name.trim(), description.trim() || undefined);
    toast.success("Version updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Version</DialogTitle>
          <DialogDescription>
            Update the name and description for this resume version.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-version-name">Version Name *</Label>
            <Input
              id="edit-version-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-version-description">Description</Label>
            <Textarea
              id="edit-version-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const VersionManagerDialog = memo(function VersionManagerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const versions = useResumeStore((state) => state.versions);
  const currentVersionId = useResumeStore((state) => state.currentVersionId);
  const duplicateVersion = useResumeStore((state) => state.duplicateVersion);
  const deleteVersion = useResumeStore((state) => state.deleteVersion);
  const switchVersion = useResumeStore((state) => state.switchVersion);

  const [editingVersion, setEditingVersion] = useState<{
    id: string;
    name: string;
    description?: string;
  } | null>(null);
  const [deletingVersionId, setDeletingVersionId] = useState<string | null>(null);

  const handleDuplicate = (versionId: string, currentName: string) => {
    const newName = `${currentName} (Copy)`;
    const newVersionId = duplicateVersion(versionId, newName);
    switchVersion(newVersionId);
    toast.success(`Duplicated version as "${newName}"`);
  };

  const handleDelete = (versionId: string, versionName: string) => {
    if (versions.length === 1) {
      toast.error("Cannot delete the last version");
      return;
    }

    deleteVersion(versionId);
    toast.success(`Deleted version "${versionName}"`);
    setDeletingVersionId(null);
  };

  const deletingVersion = versions.find((v) => v.id === deletingVersionId);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Resume Versions</DialogTitle>
            <DialogDescription>
              Rename, duplicate, or delete your resume versions. Each version can contain
              different experiences and projects from your master data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {versions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">
                    No versions yet. Create one to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              versions.map((version) => {
                const isActive = version.id === currentVersionId;
                const itemCount =
                  version.education.length +
                  version.experience.length +
                  version.projects.length +
                  version.skillCategories.length;

                return (
                  <Card
                    key={version.id}
                    className={isActive ? "ring-2 ring-primary" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">
                              {version.name}
                            </h3>
                            {isActive && (
                              <Badge variant="default" className="shrink-0">
                                Active
                              </Badge>
                            )}
                          </div>
                          {version.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {version.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Modified{" "}
                              {formatDistanceToNow(new Date(version.lastModified), {
                                addSuffix: true,
                              })}
                            </span>
                            <span>
                              {itemCount} {itemCount === 1 ? "item" : "items"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {!isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                switchVersion(version.id);
                                toast.success(`Switched to "${version.name}"`);
                              }}
                            >
                              Switch
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              setEditingVersion({
                                id: version.id,
                                name: version.name,
                                description: version.description,
                              })
                            }
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDuplicate(version.id, version.name)}
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeletingVersionId(version.id)}
                            disabled={versions.length === 1}
                            title={
                              versions.length === 1
                                ? "Cannot delete the last version"
                                : "Delete"
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {editingVersion && (
        <EditVersionDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingVersion(null);
          }}
          versionId={editingVersion.id}
          initialName={editingVersion.name}
          initialDescription={editingVersion.description}
        />
      )}

      <AlertDialog
        open={deletingVersionId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingVersionId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingVersion?.name}"? This action
              cannot be undone. Your master data will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingVersionId && deletingVersion) {
                  handleDelete(deletingVersionId, deletingVersion.name);
                }
              }}
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

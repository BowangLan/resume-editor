"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Settings } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import { toast } from "sonner";

interface CreateVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onManageClick: () => void;
}

function CreateVersionDialog({
  open,
  onOpenChange,
  onManageClick,
}: CreateVersionDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createVersion = useResumeStore((state) => state.createVersion);

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter a version name");
      return;
    }

    createVersion(name.trim(), description.trim() || undefined);
    toast.success(`Created version "${name}"`);
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Resume Version</DialogTitle>
          <DialogDescription>
            Create a new version to tailor your resume for different job applications.
            You can add items from your master data to each version.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="version-name">Version Name *</Label>
            <Input
              id="version-name"
              placeholder="e.g., Software Engineer, Data Science, Frontend Developer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreate();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version-description">Description (optional)</Label>
            <Textarea
              id="version-description"
              placeholder="Brief description of this version..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onManageClick();
            }}
            className="w-full sm:w-auto"
          >
            <Settings className="h-4 w-4" />
            Manage Versions
          </Button>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            Create Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const VersionSwitcher = memo(function VersionSwitcher({
  onManageClick,
}: {
  onManageClick: () => void;
}) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const versions = useResumeStore((state) => state.versions);
  const currentVersionId = useResumeStore((state) => state.currentVersionId);
  const switchVersion = useResumeStore((state) => state.switchVersion);

  const currentVersion = versions.find((v) => v.id === currentVersionId);

  const handleVersionChange = (versionId: string) => {
    if (versionId === "__create__") {
      setCreateDialogOpen(true);
      return;
    }
    if (versionId === "__manage__") {
      onManageClick();
      return;
    }
    switchVersion(versionId);
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      toast.success(`Switched to "${version.name}"`);
    }
  };

  // If no versions exist, show create button
  if (versions.length === 0) {
    return (
      <>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          Create Version
        </Button>
        <CreateVersionDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onManageClick={onManageClick}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={currentVersionId || undefined} onValueChange={handleVersionChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select version">
              {currentVersion?.name || "Select version"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {versions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{version.name}</span>
                  {version.description && (
                    <span className="text-xs text-muted-foreground">
                      {version.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
            <SelectItem value="__create__">
              <div className="flex items-center gap-2 text-primary">
                <Plus className="h-4 w-4" />
                <span>Create New Version</span>
              </div>
            </SelectItem>
            <SelectItem value="__manage__">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Settings className="h-4 w-4" />
                <span>Manage Versions</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CreateVersionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onManageClick={onManageClick}
      />
    </>
  );
});

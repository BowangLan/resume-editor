"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/hooks/use-resume";
import { toast } from "sonner";

export function ResumeSidebarGroup() {
  const router = useRouter();
  const pathname = usePathname();

  const versions = useResumeStore((state) => state.versions);
  const currentVersionId = useResumeStore((state) => state.currentVersionId);
  const createVersion = useResumeStore((state) => state.createVersion);
  const renameVersion = useResumeStore((state) => state.renameVersion);
  const deleteVersion = useResumeStore((state) => state.deleteVersion);

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [createName, setCreateName] = React.useState("");
  const [createDescription, setCreateDescription] = React.useState("");

  const [renamingVersionId, setRenamingVersionId] = React.useState<
    string | null
  >(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [renameOriginal, setRenameOriginal] = React.useState("");
  const renameInputRef = React.useRef<HTMLInputElement | null>(null);
  const pendingOpenVersionIdRef = React.useRef<string | null>(null);
  const ignoreCloseUntilRef = React.useRef<{
    id: string;
    until: number;
  } | null>(null);

  const commitRename = React.useCallback(
    (versionId: string) => {
      const nextName = renameValue.trim();
      if (nextName.length === 0) return;
      if (nextName === renameOriginal) return;
      renameVersion(versionId, nextName);
      toast.success("Resume renamed successfully");
    },
    [renameOriginal, renameValue, renameVersion]
  );

  React.useEffect(() => {
    if (!renamingVersionId) return;
    // Let the popover mount before focusing.
    const t = window.setTimeout(() => renameInputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [renamingVersionId]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resumes</SidebarGroupLabel>
      <SidebarGroupAction
        aria-label="Create new resume"
        title="Create new resume"
        onClick={() => setCreateDialogOpen(true)}
      >
        <Plus />
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {versions.length === 0 ? (
            <div className="px-3 py-6 text-sm text-muted-foreground text-center space-y-3">
              <div>No resumes yet. Create one to get started.</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCreateDialogOpen(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                New resume
              </Button>
            </div>
          ) : (
            versions.map((version) => {
              const isActive = pathname === `/resumes/${version.id}`;
              const itemCount =
                version.education.length +
                version.experience.length +
                version.projects.length +
                version.skillCategories.length;

              return (
                <SidebarMenuItem key={version.id}>
                  <Popover
                    open={renamingVersionId === version.id}
                    onOpenChange={(open) => {
                      // We control opening manually (no PopoverTrigger). Only handle
                      // close events here.
                      if (open) return;

                      const ignore = ignoreCloseUntilRef.current;
                      if (
                        ignore?.id === version.id &&
                        performance.now() < ignore.until
                      ) {
                        // Ignore the spurious immediate dismiss that can happen right
                        // after opening (e.g., from DropdownMenu close focus/pointer
                        // sequence). Keep it open.
                        return;
                      }
                      if (renamingVersionId === version.id) {
                        commitRename(version.id);
                      }
                      setRenamingVersionId(null);
                    }}
                  >
                    <PopoverAnchor asChild>
                      <div>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={`/resumes/${version.id}`}>
                            <FileText />
                            <span className="truncate">{version.name}</span>
                          </Link>
                        </SidebarMenuButton>

                        {itemCount > 0 && (
                          <SidebarMenuBadge className="right-7">
                            {itemCount}
                          </SidebarMenuBadge>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction
                              showOnHover
                              aria-label={`Actions for ${version.name}`}
                            >
                              <MoreHorizontal />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side="right"
                            align="start"
                            className="w-48"
                            // Prevent DropdownMenu from stealing focus back to the trigger
                            // when it closes (this can immediately dismiss the popover).
                            onCloseAutoFocus={(e) => {
                              if (
                                pendingOpenVersionIdRef.current === version.id
                              ) {
                                e.preventDefault();
                              }
                              pendingOpenVersionIdRef.current = null;
                            }}
                          >
                            <DropdownMenuItem
                              onSelect={() => {
                                // Let the menu close first; also prevent its close
                                // from re-focusing the trigger (which would dismiss
                                // the popover).
                                setRenameOriginal(version.name);
                                setRenameValue(version.name);
                                pendingOpenVersionIdRef.current = version.id;
                                window.requestAnimationFrame(() => {
                                  window.requestAnimationFrame(() => {
                                    ignoreCloseUntilRef.current = {
                                      id: version.id,
                                      until: performance.now() + 350,
                                    };
                                    setRenamingVersionId(version.id);
                                  });
                                });
                              }}
                            >
                              <Pencil />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={(e) => {
                                e.preventDefault();

                                const remaining = versions.filter(
                                  (v) => v.id !== version.id
                                );
                                const nextId =
                                  currentVersionId === version.id
                                    ? remaining[0]?.id ?? null
                                    : currentVersionId;

                                deleteVersion(version.id);

                                toast.success("Resume deleted successfully");

                                if (isActive) {
                                  router.push(
                                    nextId ? `/resumes/${nextId}` : "/"
                                  );
                                }
                              }}
                            >
                              <Trash2 />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </PopoverAnchor>

                    <PopoverContent
                      side="right"
                      align="start"
                      className="w-64 p-2"
                    >
                      <Input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        placeholder="Resume name"
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            e.preventDefault();
                            setRenamingVersionId(null);
                            return;
                          }

                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitRename(version.id);
                            setRenamingVersionId(null);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </SidebarMenuItem>
              );
            })
          )}
        </SidebarMenu>
      </SidebarGroupContent>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Create a new resume version. You can then add items from your master data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-resume-name">Name *</Label>
              <Input
                id="create-resume-name"
                placeholder="e.g., Software Engineer"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const nextName = createName.trim();
                    if (!nextName) {
                      toast.error("Please enter a resume name");
                      return;
                    }
                    const id = createVersion(
                      nextName,
                      createDescription.trim() || undefined
                    );
                    toast.success(`Created "${nextName}"`);
                    setCreateName("");
                    setCreateDescription("");
                    setCreateDialogOpen(false);
                    router.push(`/resumes/${id}`);
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-resume-description">Description (optional)</Label>
              <Textarea
                id="create-resume-description"
                placeholder="Brief description of this resume..."
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                const nextName = createName.trim();
                if (!nextName) {
                  toast.error("Please enter a resume name");
                  return;
                }
                const id = createVersion(
                  nextName,
                  createDescription.trim() || undefined
                );
                toast.success(`Created "${nextName}"`);
                setCreateName("");
                setCreateDescription("");
                setCreateDialogOpen(false);
                router.push(`/resumes/${id}`);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  SidebarGroup,
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
import { useResumeStore } from "@/hooks/use-resume";
import { toast } from "sonner";

export function ResumeSidebarGroup() {
  const router = useRouter();
  const pathname = usePathname();

  const versions = useResumeStore((state) => state.versions);
  const currentVersionId = useResumeStore((state) => state.currentVersionId);
  const renameVersion = useResumeStore((state) => state.renameVersion);
  const deleteVersion = useResumeStore((state) => state.deleteVersion);

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
      <SidebarGroupContent>
        <SidebarMenu>
          {versions.length === 0 ? (
            <div className="px-3 py-6 text-sm text-muted-foreground text-center">
              No resumes yet. Create one to get started.
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
                              onSelect={(e) => {
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
    </SidebarGroup>
  );
}

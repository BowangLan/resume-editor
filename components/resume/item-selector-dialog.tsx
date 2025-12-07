"use client";

import { memo, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillCategory,
} from "@/lib/types/resume";
import { toast } from "sonner";

type ItemType = "education" | "experience" | "projects" | "skills";

interface ItemSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ItemType;
}

export const ItemSelectorDialog = memo(function ItemSelectorDialog({
  open,
  onOpenChange,
  type,
}: ItemSelectorDialogProps) {
  const masterData = useResumeStore((state) => state.masterData);
  const currentVersion = useResumeStore((state) => {
    const versionId = state.currentVersionId;
    return state.versions.find((v) => v.id === versionId);
  });
  const addItemToCurrentVersion = useResumeStore(
    (state) => state.addItemToCurrentVersion
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Get master items based on type
  const masterItems = useMemo(() => {
    switch (type) {
      case "education":
        return masterData.education;
      case "experience":
        return masterData.experience;
      case "projects":
        return masterData.projects;
      case "skills":
        return masterData.skillCategories;
      default:
        return [];
    }
  }, [type, masterData]);

  // Get already added item master IDs
  const addedMasterIds = useMemo(() => {
    if (!currentVersion) return new Set<string>();

    const items = currentVersion[type] as Array<{ masterId?: string }>;
    return new Set(items?.map((item) => item.masterId).filter(Boolean) ?? []);
  }, [currentVersion, type]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return masterItems;

    const query = searchQuery.toLowerCase();
    const filtered = masterItems.filter((item: any) => {
      if (type === "education") {
        return (
          item.school.toLowerCase().includes(query) ||
          item.degree.toLowerCase().includes(query)
        );
      } else if (type === "experience") {
        return (
          item.title.toLowerCase().includes(query) ||
          item.company.toLowerCase().includes(query)
        );
      } else if (type === "projects") {
        return item.name.toLowerCase().includes(query);
      } else if (type === "skills") {
        return (
          item.name.toLowerCase().includes(query) ||
          item.skills.some((s: string) => s.toLowerCase().includes(query))
        );
      }
      return false;
    });

    switch (type) {
      case "education":
        setSelectedIds(new Set(filtered.map((item) => item.id)));
        break;
      case "experience":
        setSelectedIds(new Set(filtered.map((item) => item.id)));
        break;
      case "projects":
        setSelectedIds(new Set(filtered.map((item) => item.id)));
        break;
      case "skills":
        // setSelectedIds(new Set(filtered.map((item) => item.id)));
        break;
    }

    return filtered;
  }, [masterItems, searchQuery, type]);

  const handleToggleItem = (itemId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedIds(newSelected);
  };

  const handleAddSelected = () => {
    // Filter out items that are already added
    const itemsToAdd = Array.from(selectedIds).filter(
      (masterId) => !addedMasterIds.has(masterId)
    );

    // Add only new items
    itemsToAdd.forEach((masterId) => {
      addItemToCurrentVersion(type, masterId);
    });

    const count = itemsToAdd.length;
    const skipped = selectedIds.size - count;

    if (count > 0) {
      toast.success(
        `Added ${count} ${
          type === "skills" ? "skill category" : type.slice(0, -1)
        }${count !== 1 ? (type === "skills" ? "ies" : "s") : ""} to version`
      );
    }

    if (skipped > 0) {
      toast.info(
        `Skipped ${skipped} item${skipped !== 1 ? "s" : ""} already in version`
      );
    }

    setSelectedIds(new Set());
    setSearchQuery("");
    onOpenChange(false);
  };

  const typeLabels = {
    education: {
      title: "Add Education from Master Data",
      description: "Select education entries to add to this resume version",
      empty: "No education entries in master data",
    },
    experience: {
      title: "Add Experience from Master Data",
      description: "Select experiences to add to this resume version",
      empty: "No experiences in master data",
    },
    projects: {
      title: "Add Projects from Master Data",
      description: "Select projects to add to this resume version",
      empty: "No projects in master data",
    },
    skills: {
      title: "Add Skill Categories from Master Data",
      description: "Select skill categories to add to this resume version",
      empty: "No skill categories in master data",
    },
  };

  const renderItem = (item: any) => {
    const isAdded = addedMasterIds.has(item.id);
    const isSelected = selectedIds.has(item.id);

    if (type === "education") {
      const edu = item as EducationItem;
      return (
        <Card
          key={edu.id}
          className={`p-4 cursor-pointer ${isAdded ? "opacity-50" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isAdded) {
              handleToggleItem(edu.id);
            }
          }}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isAdded ? true : isSelected}
              disabled={isAdded}
              onCheckedChange={() => handleToggleItem(edu.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold truncate">{edu.school}</h4>
                {isAdded && <Badge variant="secondary">Already added</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{edu.degree}</p>
              {edu.dates && (
                <p className="text-xs text-muted-foreground mt-1">
                  {edu.dates}
                </p>
              )}
            </div>
          </div>
        </Card>
      );
    } else if (type === "experience") {
      const exp = item as ExperienceItem;
      return (
        <Card
          key={exp.id}
          className={`p-4 cursor-pointer ${isAdded ? "opacity-50" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isAdded) {
              handleToggleItem(exp.id);
            }
          }}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isAdded ? true : isSelected}
              disabled={isAdded}
              onCheckedChange={() => handleToggleItem(exp.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold truncate">{exp.title}</h4>
                {isAdded && <Badge variant="secondary">Already added</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                {exp.company}
                {exp.dates && ` • ${exp.dates}`}
              </p>
            </div>
          </div>
        </Card>
      );
    } else if (type === "projects") {
      const proj = item as ProjectItem;
      return (
        <Card
          key={proj.id}
          className={`p-4 ${isAdded ? "opacity-50" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isAdded) {
              handleToggleItem(proj.id);
            }
          }}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isAdded ? true : isSelected}
              disabled={isAdded}
              onCheckedChange={() => handleToggleItem(proj.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold truncate">{proj.name}</h4>
                {isAdded && <Badge variant="secondary">Already added</Badge>}
              </div>
              {proj.dates && (
                <p className="text-sm text-muted-foreground">{proj.dates}</p>
              )}
            </div>
          </div>
        </Card>
      );
    } else if (type === "skills") {
      const cat = item as SkillCategory;
      return (
        <Card
          key={cat.id}
          className={`p-4 cursor-pointer ${isAdded ? "opacity-50" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isAdded) {
              handleToggleItem(cat.id);
            }
          }}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isAdded ? true : isSelected}
              disabled={isAdded}
              onCheckedChange={() => handleToggleItem(cat.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold truncate">{cat.name}</h4>
                {isAdded && <Badge variant="secondary">Already added</Badge>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.slice(0, 5).map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {cat.skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{cat.skills.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      );
    }
  };

  const availableCount = masterItems.length - addedMasterIds.size;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{typeLabels[type].title}</DialogTitle>
          <DialogDescription>
            {typeLabels[type].description}
            {availableCount > 0 && (
              <span className="block mt-1">
                {availableCount} {availableCount === 1 ? "item" : "items"}{" "}
                available to add
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {masterItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {typeLabels[type].empty}. Add items to master data first.
            </p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-2">
              {filteredItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No items match your search
                </p>
              ) : (
                filteredItems.map((item) => renderItem(item))
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddSelected}
                disabled={selectedIds.size === 0}
              >
                Add Selected ({selectedIds.size})
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});

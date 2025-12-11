import { RichButton } from "@/components/ui/rich-button";
import { useResumeStore } from "@/hooks/use-resume";
import { useCallback, useState, useMemo } from "react";
import { Trash2, X, Plus, ChevronDown, Upload, RotateCcw } from "lucide-react";
import { SectionItemContainer } from "./section-item-container";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isSkillCategoryDifferentFromMaster } from "@/lib/utils/item-comparison";
import type { SkillCategory } from "@/lib/types/resume";

export const SkillCategoryEditor = ({ category }: { category: SkillCategory }) => {
  const skillCategories = useResumeStore((state) => {
    const version = state.versions.find((v) => v.id === state.currentVersionId);
    return version?.skillCategories ?? [];
  });
  const updateCurrentVersionSkills = useResumeStore(
    (state) => state.updateCurrentVersionSkills
  );
  const syncItemFromMaster = useResumeStore((state) => state.syncItemFromMaster);
  const promoteToMaster = useResumeStore((state) => state.promoteToMaster);
  const masterData = useResumeStore((state) => state.masterData);
  const [open, setOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const categoryItem = useMemo(() => {
    return skillCategories.find((cat) => cat.id === category.id) || null;
  }, [skillCategories, category.id]);

  // Check if this item is different from master
  const masterItem = useMemo(() => {
    if (!categoryItem?.masterId) return undefined;
    return masterData.skillCategories.find((m) => m.id === categoryItem.masterId);
  }, [categoryItem?.masterId, masterData.skillCategories]);

  const isDifferent = useMemo(() => {
    if (!categoryItem || !masterItem) return false;
    return isSkillCategoryDifferentFromMaster(categoryItem, masterItem);
  }, [categoryItem, masterItem]);

  const handleRemoveCategory = useCallback(() => {
    if (!categoryItem) return;
    updateCurrentVersionSkills(
      skillCategories.filter((cat) => cat.id !== categoryItem.id)
    );
  }, [categoryItem, skillCategories, updateCurrentVersionSkills]);

  const handleAddSkill = useCallback(() => {
    const skill = newSkill.trim();
    if (!categoryItem || !skill) return;

    const updatedSkills = [...categoryItem.skills, skill];
    const updatedCategories = skillCategories.map((cat) =>
      cat.id === categoryItem.id
        ? { ...cat, skills: updatedSkills }
        : cat
    );
    updateCurrentVersionSkills(updatedCategories);

    setNewSkill("");
  }, [
    categoryItem,
    newSkill,
    skillCategories,
    updateCurrentVersionSkills,
  ]);

  const handleRemoveSkill = useCallback(
    (skillIndex: number) => {
      if (!categoryItem) return;

      const updatedSkills = categoryItem.skills.filter((_, idx) => idx !== skillIndex);
      const updatedCategories = skillCategories.map((cat) =>
        cat.id === categoryItem.id
          ? {
              ...cat,
              skills: updatedSkills,
            }
          : cat
      );
      updateCurrentVersionSkills(updatedCategories);
    },
    [
      categoryItem,
      skillCategories,
      updateCurrentVersionSkills,
    ]
  );

  const handlePromoteToMaster = useCallback(() => {
    if (!categoryItem) return;
    promoteToMaster('skills', categoryItem.id);
  }, [promoteToMaster, categoryItem]);

  const handleRevertToMaster = useCallback(() => {
    if (!categoryItem) return;
    syncItemFromMaster('skills', categoryItem.id);
  }, [syncItemFromMaster, categoryItem]);

  if (!categoryItem) return null;

  const skills = categoryItem.skills;
  const subtitle = `${skills.length} skill${skills.length !== 1 ? "s" : ""}`;

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center gap-2">
          <span>{categoryItem.name}</span>
          {isDifferent && masterItem && (
            <Badge variant="secondary" className="text-xs">
              Modified
            </Badge>
          )}
        </div>
      }
      subtitle={subtitle}
      right={
        <>
          {isDifferent && masterItem && (
            <>
              <RichButton
                onClick={handleRevertToMaster}
                size="sm"
                variant="ghost"
                className="group-hover:opacity-100 opacity-0 trans"
                title="Revert to master data"
              >
                <RotateCcw className="h-4 w-4" />
              </RichButton>
              <RichButton
                onClick={handlePromoteToMaster}
                size="sm"
                variant="ghost"
                className="group-hover:opacity-100 opacity-0 trans"
                title="Promote to master data"
              >
                <Upload className="h-4 w-4" />
              </RichButton>
            </>
          )}
          <RichButton
            onClick={handleRemoveCategory}
            size="icon-sm"
            variant="ghost"
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </RichButton>
          <RichButton
            onClick={() => setOpen(false)}
            size="icon-sm"
            variant="ghost"
            className="text-primary"
          >
            <ChevronDown className={cn("h-4 w-4", open ? "rotate-180" : "")} />
          </RichButton>
        </>
      }
    >
      <div className="space-y-4 px-3 py-4">
        {/* Skills in this category */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="pr-1">
              {skill}
              <button
                onClick={() => handleRemoveSkill(index)}
                className="ml-1.5 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No skills in this category yet.
            </p>
          )}
        </div>

        {/* Add skill input */}
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Add a skill..."
            className="text-sm"
          />
          <RichButton
            onClick={handleAddSkill}
            size="icon"
            variant="outline"
            tooltip="Add a new skill"
          >
            <Plus />
          </RichButton>
        </div>
      </div>
    </SectionItemContainer>
  );
};

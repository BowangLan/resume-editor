"use client";

import { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Database } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import type { SkillCategory } from "@/lib/types/resume";
import { SectionContainer } from "./section-container";
import { SkillCategoryEditor } from "./skill-category-editor";
import { ItemSelectorDialog } from "../item-selector-dialog";
import { RichButton } from "@/components/ui/rich-button";

export const SkillsSection = memo(function SkillsSection() {
  const skillCategories = useResumeStore((state) => {
    const version = state.versions.find((v) => v.id === state.currentVersionId);
    return version?.skillCategories ?? [];
  });
  const addMasterSkillCategory = useResumeStore(
    (state) => state.addMasterSkillCategory
  );
  const updateCurrentVersionSkills = useResumeStore(
    (state) => state.updateCurrentVersionSkills
  );
  const [newCategory, setNewCategory] = useState("");
  const [selectorOpen, setSelectorOpen] = useState(false);

  const handleAddCategory = useCallback(() => {
    const name = newCategory.trim();
    if (!name) return;

    const masterId = crypto.randomUUID();
    const masterCategory: SkillCategory = {
      id: masterId,
      name,
      skills: [],
      autoSync: true,
    };

    addMasterSkillCategory(masterCategory);

    const versionCategory: SkillCategory = {
      ...masterCategory,
      id: crypto.randomUUID(),
      masterId,
    };

    updateCurrentVersionSkills([...skillCategories, versionCategory]);
    setNewCategory("");
  }, [
    addMasterSkillCategory,
    newCategory,
    skillCategories,
    updateCurrentVersionSkills,
  ]);

  return (
    <>
      <SectionContainer
        title="Skills"
        right={
          <RichButton
            onClick={() => setSelectorOpen(true)}
            size="sm"
            variant="outline"
            tooltip="Add skills from master data"
          >
            <Database className="h-4 w-4" />
          </RichButton>
        }
      >
        {skillCategories.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-muted-foreground">
              No skill categories in this version yet.
            </p>
            <Button
              onClick={() => setSelectorOpen(true)}
              variant="outline"
              size="sm"
            >
              <Database className="h-4 w-4" />
              Add from Master Data
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-2">
            {skillCategories.map((category) => (
              <SkillCategoryEditor key={category.id} category={category} />
            ))}
          </div>
        )}

        {/* Add New Category */}
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold text-sm">Add New Category</h3>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              placeholder="e.g., Languages, Frameworks, Tools..."
              className="text-sm"
            />
            <Button onClick={handleAddCategory} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SectionContainer>

      <ItemSelectorDialog
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        type="skills"
      />
    </>
  );
});

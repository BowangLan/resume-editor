"use client";

import { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import type { Skills } from "@/lib/types/resume";
import { SectionContainer } from "./section-container";
import { SkillCategoryEditor } from "./skill-category-editor";

export const SkillsSection = memo(function SkillsSection() {
  const { resume, updateSkills } = useResumeStore();
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = useCallback(() => {
    if (!resume || !newCategory.trim()) return;

    const updatedSkills: Skills = {
      ...resume.skills,
      [newCategory.trim()]: [],
    };
    updateSkills(updatedSkills);
    setNewCategory("");
  }, [resume, newCategory, updateSkills]);

  if (!resume) return null;

  const categories = Object.keys(resume.skills);

  return (
    <SectionContainer title="Skills">
      {categories.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No skill categories. Add one below to get started.
        </p>
      ) : (
        <div className="w-full space-y-2">
          {categories.map((category) => (
            <SkillCategoryEditor key={category} category={category} />
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
  );
});

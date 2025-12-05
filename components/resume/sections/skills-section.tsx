"use client";

import { memo, useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, X } from 'lucide-react';
import { useResumeStore } from '@/hooks/use-resume';
import type { Skills } from '@/lib/types/resume';

export const SkillsSection = memo(function SkillsSection() {
  const { resume, updateSkills } = useResumeStore();
  const [newCategory, setNewCategory] = useState('');
  const [newSkills, setNewSkills] = useState<Record<string, string>>({});

  const handleAddCategory = useCallback(() => {
    if (!resume || !newCategory.trim()) return;

    const updatedSkills: Skills = {
      ...resume.skills,
      [newCategory.trim()]: [],
    };
    updateSkills(updatedSkills);
    setNewCategory('');
  }, [resume, newCategory, updateSkills]);

  const handleRemoveCategory = useCallback(
    (category: string) => {
      if (!resume) return;

      const { [category]: _, ...rest } = resume.skills;
      updateSkills(rest);
    },
    [resume, updateSkills]
  );

  const handleAddSkill = useCallback(
    (category: string) => {
      if (!resume || !newSkills[category]?.trim()) return;

      const updatedSkills: Skills = {
        ...resume.skills,
        [category]: [...(resume.skills[category] || []), newSkills[category].trim()],
      };
      updateSkills(updatedSkills);
      setNewSkills({ ...newSkills, [category]: '' });
    },
    [resume, newSkills, updateSkills]
  );

  const handleRemoveSkill = useCallback(
    (category: string, skillIndex: number) => {
      if (!resume) return;

      const updatedSkills: Skills = {
        ...resume.skills,
        [category]: resume.skills[category].filter((_, idx) => idx !== skillIndex),
      };
      updateSkills(updatedSkills);
    },
    [resume, updateSkills]
  );

  if (!resume) return null;

  const categories = Object.keys(resume.skills);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Categories */}
        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{category}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCategory(category)}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Skills in this category */}
            <div className="flex flex-wrap gap-2">
              {resume.skills[category].map((skill, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(category, index)}
                    className="ml-1.5 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {/* Add skill input */}
            <div className="flex gap-2">
              <Input
                value={newSkills[category] || ''}
                onChange={(e) => setNewSkills({ ...newSkills, [category]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(category);
                  }
                }}
                placeholder="Add a skill..."
                className="text-sm"
              />
              <Button
                onClick={() => handleAddSkill(category)}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Category */}
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold text-sm">Add New Category</h3>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              placeholder="e.g., Languages, Frontend, Backend..."
              className="text-sm"
            />
            <Button onClick={handleAddCategory} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

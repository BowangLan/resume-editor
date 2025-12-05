"use client";

import { memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { FormField } from '../form-field';
import { BulletListEditor } from '../bullet-list-editor';
import { useResumeStore } from '@/hooks/use-resume';
import type { ProjectItem } from '@/lib/types/resume';
import { Separator } from '@/components/ui/separator';

export const ProjectsSection = memo(function ProjectsSection() {
  const { resume, updateProjects } = useResumeStore();

  const handleAdd = useCallback(() => {
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      name: '',
      dates: '',
      bullets: [''],
      link: '',
    };
    updateProjects([...(resume?.projects || []), newItem]);
  }, [resume?.projects, updateProjects]);

  const handleRemove = useCallback(
    (id: string) => {
      updateProjects((resume?.projects || []).filter((item) => item.id !== id));
    },
    [resume?.projects, updateProjects]
  );

  const handleChange = useCallback(
    (id: string, field: keyof ProjectItem, value: unknown) => {
      const items = resume?.projects || [];
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return;

      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateProjects(newItems);
    },
    [resume?.projects, updateProjects]
  );

  if (!resume) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>
        <Button onClick={handleAdd} size="sm" variant="outline">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {resume.projects.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No project entries. Click "Add Project" to get started.
          </p>
        ) : (
          resume.projects.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-semibold">Project {index + 1}</h4>
                  </div>
                  <Button
                    onClick={() => handleRemove(item.id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Project Name"
                    value={item.name}
                    onChange={(value) => handleChange(item.id, 'name', value)}
                    placeholder="Awesome Project"
                    required
                  />
                  <FormField
                    label="Dates"
                    value={item.dates}
                    onChange={(value) => handleChange(item.id, 'dates', value)}
                    placeholder="Jan 2023 -- Mar 2023"
                  />
                </div>

                <FormField
                  label="Link (optional)"
                  value={item.link || ''}
                  onChange={(value) => handleChange(item.id, 'link', value)}
                  placeholder="https://project.com"
                />

                <BulletListEditor
                  bullets={item.bullets}
                  onChange={(value) => handleChange(item.id, 'bullets', value)}
                  label="Project Details"
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
});

"use client";

import { memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { FormField } from '../form-field';
import { BulletListEditor } from '../bullet-list-editor';
import { useResumeStore } from '@/hooks/use-resume';
import type { ExperienceItem } from '@/lib/types/resume';
import { Separator } from '@/components/ui/separator';

export const ExperienceSection = memo(function ExperienceSection() {
  const { resume, updateExperience } = useResumeStore();

  const handleAdd = useCallback(() => {
    const newItem: ExperienceItem = {
      id: crypto.randomUUID(),
      title: '',
      company: '',
      location: '',
      dates: '',
      bullets: [''],
      link: '',
    };
    updateExperience([...(resume?.experience || []), newItem]);
  }, [resume?.experience, updateExperience]);

  const handleRemove = useCallback(
    (id: string) => {
      updateExperience((resume?.experience || []).filter((item) => item.id !== id));
    },
    [resume?.experience, updateExperience]
  );

  const handleChange = useCallback(
    (id: string, field: keyof ExperienceItem, value: unknown) => {
      const items = resume?.experience || [];
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return;

      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateExperience(newItems);
    },
    [resume?.experience, updateExperience]
  );

  if (!resume) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>
        <Button onClick={handleAdd} size="sm" variant="outline">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {resume.experience.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No experience entries. Click "Add Experience" to get started.
          </p>
        ) : (
          resume.experience.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-semibold">Experience Entry {index + 1}</h4>
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
                    label="Job Title"
                    value={item.title}
                    onChange={(value) => handleChange(item.id, 'title', value)}
                    placeholder="Software Engineer"
                    required
                  />
                  <FormField
                    label="Dates"
                    value={item.dates}
                    onChange={(value) => handleChange(item.id, 'dates', value)}
                    placeholder="Jan 2023 -- Present"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Company"
                    value={item.company}
                    onChange={(value) => handleChange(item.id, 'company', value)}
                    placeholder="Tech Corp"
                    required
                  />
                  <FormField
                    label="Location"
                    value={item.location}
                    onChange={(value) => handleChange(item.id, 'location', value)}
                    placeholder="City, State"
                  />
                </div>

                <FormField
                  label="Link (optional)"
                  value={item.link || ''}
                  onChange={(value) => handleChange(item.id, 'link', value)}
                  placeholder="https://company.com"
                />

                <BulletListEditor
                  bullets={item.bullets}
                  onChange={(value) => handleChange(item.id, 'bullets', value)}
                  label="Achievements & Responsibilities"
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
});

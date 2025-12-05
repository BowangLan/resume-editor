"use client";

import { memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { FormField } from '../form-field';
import { TagInput } from '../tag-input';
import { useResumeStore } from '@/hooks/use-resume';
import type { EducationItem } from '@/lib/types/resume';
import { Separator } from '@/components/ui/separator';

export const EducationSection = memo(function EducationSection() {
  const { resume, updateEducation } = useResumeStore();

  const handleAdd = useCallback(() => {
    const newItem: EducationItem = {
      id: crypto.randomUUID(),
      school: '',
      location: '',
      degree: '',
      dates: '',
      coursework: [],
    };
    updateEducation([...(resume?.education || []), newItem]);
  }, [resume?.education, updateEducation]);

  const handleRemove = useCallback(
    (id: string) => {
      updateEducation((resume?.education || []).filter((item) => item.id !== id));
    },
    [resume?.education, updateEducation]
  );

  const handleChange = useCallback(
    (id: string, field: keyof EducationItem, value: unknown) => {
      const items = resume?.education || [];
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return;

      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateEducation(newItems);
    },
    [resume?.education, updateEducation]
  );

  if (!resume) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>
        <Button onClick={handleAdd} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {resume.education.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No education entries. Click "Add Education" to get started.
          </p>
        ) : (
          resume.education.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-semibold">Education Entry {index + 1}</h4>
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
                    label="School"
                    value={item.school}
                    onChange={(value) => handleChange(item.id, 'school', value)}
                    placeholder="University of Example"
                    required
                  />
                  <FormField
                    label="Location"
                    value={item.location}
                    onChange={(value) => handleChange(item.id, 'location', value)}
                    placeholder="City, State"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Degree"
                    value={item.degree}
                    onChange={(value) => handleChange(item.id, 'degree', value)}
                    placeholder="Bachelor of Science in Computer Science"
                    required
                  />
                  <FormField
                    label="Dates"
                    value={item.dates}
                    onChange={(value) => handleChange(item.id, 'dates', value)}
                    placeholder="Sep 2020 -- Aug 2024"
                  />
                </div>

                <TagInput
                  tags={item.coursework}
                  onChange={(value) => handleChange(item.id, 'coursework', value)}
                  label="Relevant Coursework"
                  placeholder="Type course name and press Enter..."
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
});

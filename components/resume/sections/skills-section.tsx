"use client";

import { memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '../form-field';
import { useResumeStore } from '@/hooks/use-resume';
import type { Skills } from '@/lib/types/resume';

export const SkillsSection = memo(function SkillsSection() {
  const { resume, updateSkills } = useResumeStore();

  const handleChange = useCallback(
    (field: keyof Skills, value: string) => {
      updateSkills({ [field]: value });
    },
    [updateSkills]
  );

  if (!resume) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          label="Languages"
          value={resume.skills.languages}
          onChange={(value) => handleChange('languages', value)}
          placeholder="JavaScript, TypeScript, Python, Java"
        />
        <FormField
          label="Frameworks"
          value={resume.skills.frameworks}
          onChange={(value) => handleChange('frameworks', value)}
          placeholder="React, Next.js, Node.js, Express"
        />
        <FormField
          label="Database"
          value={resume.skills.database}
          onChange={(value) => handleChange('database', value)}
          placeholder="PostgreSQL, MongoDB, Redis"
        />
        <FormField
          label="Developer Tools"
          value={resume.skills.developerTools}
          onChange={(value) => handleChange('developerTools', value)}
          placeholder="Git, Docker, AWS, Vercel"
        />
      </CardContent>
    </Card>
  );
});

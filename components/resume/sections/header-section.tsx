"use client";

import { memo, useCallback } from "react";
import { FormField } from "../form-field";
import { useResumeStore } from "@/hooks/use-resume";
import type { ResumeHeader } from "@/lib/types/resume";
import { SectionContainer } from "./section-container";

export const HeaderSection = memo(function HeaderSection() {
  const { resume, updateHeader } = useResumeStore();

  const handleChange = useCallback(
    (field: keyof ResumeHeader, value: string) => {
      updateHeader({ [field]: value });
    },
    [updateHeader]
  );

  if (!resume) return null;

  return (
    <SectionContainer title="Contact Information">
      <div className="space-y-4">
        <FormField
          label="Full Name"
          value={resume.header.name}
          onChange={(value) => handleChange("name", value)}
          placeholder="John Doe"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Phone"
            value={resume.header.phone}
            onChange={(value) => handleChange("phone", value)}
            placeholder="(123) 456-7890"
          />
          <FormField
            label="Email"
            value={resume.header.email}
            onChange={(value) => handleChange("email", value)}
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Website"
            value={resume.header.website}
            onChange={(value) => handleChange("website", value)}
            placeholder="yourwebsite.com"
          />
          <FormField
            label="LinkedIn Username"
            value={resume.header.linkedin}
            onChange={(value) => handleChange("linkedin", value)}
            placeholder="your-profile"
          />
          <FormField
            label="GitHub Username"
            value={resume.header.github}
            onChange={(value) => handleChange("github", value)}
            placeholder="yourusername"
          />
        </div>
      </div>
    </SectionContainer>
  );
});

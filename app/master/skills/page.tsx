"use client";

import { MasterSkillsList } from "@/components/resume/master/master-skills-list";
import { PageLayout, PageHeader, PageContent } from "@/components/layout";
import { Code } from "lucide-react";

export default function MasterSkillsPage() {
  return (
    <PageLayout
      header={{
        icon: Code,
        title: "Master Skills Data",
      }}
      contentClassName="overflow-auto"
    >
      <PageContent maxWidth="4xl">
        <p className="text-muted-foreground mb-6">
          Manage your skill categories. Add all your technical skills,
          frameworks, languages, and tools here. You can then select which
          categories to include in each resume version.
        </p>
        <MasterSkillsList />
      </PageContent>
    </PageLayout>
  );
}

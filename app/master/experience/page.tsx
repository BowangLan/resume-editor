"use client";

import { MasterExperienceList } from "@/components/resume/master/master-experience-list";
import { PageLayout, PageHeader, PageContent } from "@/components/layout";
import { Briefcase } from "lucide-react";

export default function MasterExperiencePage() {
  return (
    <PageLayout
      header={{
        icon: Briefcase,
        title: "Master Experience Data",
      }}
      contentClassName="overflow-auto"
    >
      <PageContent maxWidth="4xl">
        <p className="text-muted-foreground mb-6">
          Manage your work experience items. Add all your jobs, internships,
          and relevant work history here. You can then select which ones to
          include in each resume version.
        </p>
        <MasterExperienceList />
      </PageContent>
    </PageLayout>
  );
}

"use client";

import { MasterEducationList } from "@/components/resume/master/master-education-list";
import { PageLayout, PageHeader, PageContent } from "@/components/layout";
import { GraduationCap } from "lucide-react";

export default function MasterEducationPage() {
  return (
    <PageLayout
      header={{
        icon: GraduationCap,
        title: "Master Education Data",
      }}
      contentClassName="overflow-auto"
    >
      <PageContent maxWidth="4xl">
        <p className="text-muted-foreground mb-6">
          Manage your education items. Add all your degrees, certifications,
          and courses here. You can then select which ones to include in each
          resume version.
        </p>
        <MasterEducationList />
      </PageContent>
    </PageLayout>
  );
}

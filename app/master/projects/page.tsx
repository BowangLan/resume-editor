"use client";

import { MasterProjectsList } from "@/components/resume/master/master-projects-list";
import { PageLayout, PageHeader, PageContent } from "@/components/layout";
import { FolderKanban } from "lucide-react";

export default function MasterProjectsPage() {
  return (
    <PageLayout
      header={{
        icon: FolderKanban,
        title: "Master Projects Data",
      }}
      contentClassName="overflow-auto"
    >
      <PageContent maxWidth="4xl">
        <p className="text-muted-foreground mb-6">
          Manage your project items. Add all your personal projects, academic
          projects, and side work here. You can then select which ones to
          include in each resume version.
        </p>
        <MasterProjectsList />
      </PageContent>
    </PageLayout>
  );
}

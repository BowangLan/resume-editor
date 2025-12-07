"use client";

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { MasterExperienceList } from "@/components/resume/master/master-experience-list";
import { Briefcase } from "lucide-react";

export default function MasterExperiencePage() {
  return (
    <SidebarInset className="h-screen flex flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Master Experience Data</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground mb-6">
            Manage your work experience items. Add all your jobs, internships,
            and relevant work history here. You can then select which ones to
            include in each resume version.
          </p>
          <MasterExperienceList />
        </div>
      </main>
    </SidebarInset>
  );
}

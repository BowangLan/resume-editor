"use client";

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { MasterSkillsList } from "@/components/resume/master/master-skills-list";
import { Code } from "lucide-react";

export default function MasterSkillsPage() {
  return (
    <SidebarInset className="h-screen flex flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Master Skills Data</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground mb-6">
            Manage your skill categories. Add all your technical skills,
            frameworks, languages, and tools here. You can then select which
            categories to include in each resume version.
          </p>
          <MasterSkillsList />
        </div>
      </main>
    </SidebarInset>
  );
}

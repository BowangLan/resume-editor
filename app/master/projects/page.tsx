"use client";

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { MasterProjectsList } from "@/components/resume/master/master-projects-list";
import { FolderKanban } from "lucide-react";

export default function MasterProjectsPage() {
  return (
    <SidebarInset className="h-screen flex flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Master Projects Data</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground mb-6">
            Manage your project items. Add all your personal projects, academic
            projects, and side work here. You can then select which ones to
            include in each resume version.
          </p>
          <MasterProjectsList />
        </div>
      </main>
    </SidebarInset>
  );
}

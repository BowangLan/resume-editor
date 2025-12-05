"use client";

import { ActionBar } from "@/components/resume/action-bar";
import { SplitView } from "@/components/resume/split-view";
import { EmptyState } from "@/components/resume/empty-state";
import { useResumeStore } from "@/hooks/use-resume";
import { Toaster } from "sonner";

export default function Home() {
  const { resume } = useResumeStore();

  return (
    <>
      <div className="h-screen flex flex-col bg-background">
        <ActionBar />
        <main className="flex-1 overflow-hidden">
          {resume ? (
            <div className="container max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
              <SplitView />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState />
            </div>
          )}
        </main>
      </div>
      <Toaster />
    </>
  );
}

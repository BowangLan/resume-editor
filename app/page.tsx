"use client";

import { ActionBar } from "@/components/resume/action-bar";
import { SplitView } from "@/components/resume/split-view";
import { EmptyState } from "@/components/resume/empty-state";
import { DropZoneOverlay } from "@/components/resume/drop-zone-overlay";
import { useResumeStore } from "@/hooks/use-resume";
import { useFileHandler } from "@/hooks/use-file-handler";
import { useDropZone } from "@/hooks/use-drop-zone";
import { Toaster, toast } from "sonner";
import { useCallback } from "react";

export default function Home() {
  const { resume, setResume } = useResumeStore();
  const { handleUpload } = useFileHandler();

  const handleFileDrop = useCallback(
    async (file: File) => {
      try {
        toast.loading("Parsing resume...", { id: "upload" });
        const parsedResume = await handleUpload(file);
        setResume(parsedResume);
        toast.success("Resume uploaded successfully!", { id: "upload" });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload resume",
          { id: "upload" }
        );
        console.error(error);
      }
    },
    [handleUpload, setResume]
  );

  const { isDragging } = useDropZone({
    onDrop: handleFileDrop,
    accept: ".pdf",
  });

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
      <DropZoneOverlay isDragging={isDragging} />
      <Toaster />
    </>
  );
}

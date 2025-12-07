"use client";

import { ActionBar } from "@/components/resume/action-bar";
import { SplitView } from "@/components/resume/split-view";
import { EmptyState } from "@/components/resume/empty-state";
import { DropZoneOverlay } from "@/components/resume/drop-zone-overlay";
import { PageLayout, PageHeader, PageContent } from "@/components/layout";
import { useResumeStore, useCurrentResume } from "@/hooks/use-resume";
import { useFileHandler } from "@/hooks/use-file-handler";
import { useDropZone } from "@/hooks/use-drop-zone";
import { toast } from "sonner";
import { useCallback } from "react";

export default function Home() {
  const resume = useCurrentResume();
  const setResume = useResumeStore((state) => state.setResume);
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
      <PageLayout
        header={{
          actions: <ActionBar />,
        }}
      >
        {resume ? (
          <PageContent maxWidth="custom" customMaxWidth="max-w-[1800px]">
            <SplitView />
          </PageContent>
        ) : (
          <div className="h-full flex items-center justify-center">
            <EmptyState />
          </div>
        )}
      </PageLayout>
      <DropZoneOverlay isDragging={isDragging} />
    </>
  );
}

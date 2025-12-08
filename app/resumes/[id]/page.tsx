"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SplitView } from "@/components/resume/split-view";
import { EmptyState } from "@/components/resume/empty-state";
import { DropZoneOverlay } from "@/components/resume/drop-zone-overlay";
import { ActionBar } from "@/components/resume/action-bar";
import { PageLayout, PageHeader, PageContent } from "@/components/layout";
import { useResumeStore, useCurrentResume } from "@/hooks/use-resume";
import { useFileHandler } from "@/hooks/use-file-handler";
import { useDropZone } from "@/hooks/use-drop-zone";
import { toast } from "sonner";
import { useCallback } from "react";
import { FileText } from "lucide-react";

export default function ResumePage() {
  const params = useParams();
  const router = useRouter();
  const versionId = params.id as string;

  const versions = useResumeStore((state) => state.versions);
  const currentVersionId = useResumeStore((state) => state.currentVersionId);
  const switchVersion = useResumeStore((state) => state.switchVersion);
  const resume = useCurrentResume();
  const setResume = useResumeStore((state) => state.setResume);
  const { handleUpload } = useFileHandler();

  // Find the version
  const version = versions.find((v) => v.id === versionId);

  // Switch to this version if not already active
  useEffect(() => {
    if (versionId && versionId !== currentVersionId) {
      switchVersion(versionId);
    }
  }, [versionId, currentVersionId, switchVersion]);

  // Redirect if version doesn't exist
  useEffect(() => {
    if (!version && versions.length > 0) {
      toast.error("Resume version not found");
      router.push("/");
    }
  }, [version, versions, router]);

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

  if (!version) {
    return null;
  }

  return (
    <>
      <PageLayout
        header={{
          icon: FileText,
          title: version.name,
          description: version.description,
          actions: <ActionBar />,
        }}
      >
        <PageContent maxWidth="custom">
          {resume ? (
            <SplitView />
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState />
            </div>
          )}
        </PageContent>
      </PageLayout>
      <DropZoneOverlay isDragging={isDragging} />
    </>
  );
}

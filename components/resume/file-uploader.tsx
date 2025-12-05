"use client";

import { memo, useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useFileHandler } from "@/hooks/use-file-handler";
import { useResumeStore } from "@/hooks/use-resume";
import { toast } from "sonner";
import { RichButton } from "../ui/rich-button";

export const FileUploader = memo(function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleUpload } = useFileHandler();
  const { setResume } = useResumeStore();
  const [isLoading, setIsLoading] = useState(false);

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.includes("pdf")) {
        toast.error("Please upload a PDF file");
        return;
      }

      try {
        setIsLoading(true);
        toast.loading("Parsing resume with AI...");
        const resume = await handleUpload(file);
        setResume(resume);
        toast.dismiss();
        toast.success("Resume parsed successfully!");
      } catch (error) {
        toast.dismiss();
        toast.error(
          error instanceof Error ? error.message : "Failed to parse resume"
        );
        console.error(error);
      } finally {
        setIsLoading(false);
        // Reset input
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [handleUpload, setResume]
  );

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={onFileChange}
        className="hidden"
        disabled={isLoading}
      />
      <RichButton
        onClick={() => inputRef.current?.click()}
        tooltip="Upload a new PDF resume"
        variant="outline"
        size="sm"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Parsing...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload PDF Resume
          </>
        )}
      </RichButton>
    </>
  );
});

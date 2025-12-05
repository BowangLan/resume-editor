"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import { ImprovementDialog } from "./improvement-dialog";
import { ProgressEvent } from "@/lib/types/streaming";
import { toast } from "sonner";

export function ImproveResumeButton() {
  const { resume } = useResumeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImprove = async () => {
    if (!resume) {
      toast.error("No resume loaded. Please upload or create a resume first.");
      return;
    }

    // Check if resume has content
    const hasExperience = resume.experience && resume.experience.length > 0;
    const hasProjects = resume.projects && resume.projects.length > 0;

    if (!hasExperience && !hasProjects) {
      toast.error("Please add at least one experience or project entry first.");
      return;
    }

    setIsLoading(true);
    setProgressEvents([]);
    setDialogOpen(true);

    try {
      const response = await fetch("/api/improve-resume/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to improve resume");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              setIsLoading(false);
              continue;
            }

            try {
              const event: ProgressEvent = JSON.parse(data);
              setProgressEvents((prev) => {
                // Update or add the event
                const existingIndex = prev.findIndex((e) => {
                  if (e.type === "skills") return e.type === event.type;
                  return e.type === event.type && "id" in e && "id" in event && e.id === event.id;
                });

                if (existingIndex >= 0) {
                  const updated = [...prev];
                  updated[existingIndex] = event;
                  return updated;
                }
                return [...prev, event];
              });
            } catch (e) {
              console.error("Failed to parse event:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error improving resume:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to improve resume. Please try again."
      );
      setDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleImprove}
        disabled={!resume || isLoading}
        variant="default"
        size="sm"
      >
        <Sparkles className="h-4 w-4" />
        {isLoading ? "Improving..." : "Improve Resume"}
      </Button>

      <ImprovementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        progressEvents={progressEvents}
        isLoading={isLoading}
      />
    </>
  );
}

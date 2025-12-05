"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Check, X, Clock } from "lucide-react";
import { ImprovementComparison } from "./improvement-comparison";
import { useResumeStore } from "@/hooks/use-resume";
import { ProgressEvent, ItemStatus } from "@/lib/types/streaming";
import { ImprovedResume } from "@/lib/types/improvements";
import { toast } from "sonner";
import { useMemo } from "react";

interface ImprovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progressEvents: ProgressEvent[];
  isLoading: boolean;
}

const StatusIcon = ({ status }: { status: ItemStatus }) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    case "processing":
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    case "completed":
      return <Check className="h-4 w-4 text-green-500" />;
    case "error":
      return <X className="h-4 w-4 text-red-500" />;
  }
};

const StatusBadge = ({ status }: { status: ItemStatus }) => {
  const variants: Record<ItemStatus, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-gray-500" },
    processing: { label: "Processing", className: "bg-blue-500" },
    completed: { label: "Completed", className: "bg-green-500" },
    error: { label: "Error", className: "bg-red-500" },
  };

  const { label, className } = variants[status];

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
};

export function ImprovementDialog({
  open,
  onOpenChange,
  progressEvents,
  isLoading,
}: ImprovementDialogProps) {
  const { resume, applyImprovements } = useResumeStore();

  // Build improvements object from progress events
  const improvements: ImprovedResume | null = useMemo(() => {
    const experienceEvents = progressEvents.filter((e) => e.type === "experience" && e.status === "completed");
    const projectEvents = progressEvents.filter((e) => e.type === "project" && e.status === "completed");
    const skillsEvent = progressEvents.find((e) => e.type === "skills" && e.status === "completed");

    if (experienceEvents.length === 0 && projectEvents.length === 0 && !skillsEvent) {
      return null;
    }

    return {
      experience: experienceEvents.map((e) => ({
        id: "id" in e ? e.id : "",
        bullets: e.bullets || [],
      })),
      projects: projectEvents.map((e) => ({
        id: "id" in e ? e.id : "",
        bullets: e.bullets || [],
      })),
      skills: skillsEvent && "improved" in skillsEvent && skillsEvent.improved
        ? {
            original: skillsEvent.original || {},
            improved: skillsEvent.improved,
            reason: skillsEvent.reason || "",
          }
        : { original: {}, improved: {}, reason: "" },
    };
  }, [progressEvents]);

  // Calculate progress
  const progress = useMemo(() => {
    const total = progressEvents.length;
    const completed = progressEvents.filter((e) => e.status === "completed").length;
    const processing = progressEvents.filter((e) => e.status === "processing").length;
    const pending = progressEvents.filter((e) => e.status === "pending").length;
    const failed = progressEvents.filter((e) => e.status === "error").length;

    return {
      total,
      completed,
      processing,
      pending,
      failed,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [progressEvents]);

  const handleAccept = () => {
    if (!improvements) {
      toast.error("No improvements available to apply.");
      return;
    }
    applyImprovements(improvements);
    toast.success("Resume improvements applied successfully!");
    onOpenChange(false);
  };

  const handleReject = () => {
    onOpenChange(false);
  };

  if (!resume) return null;

  const experienceEvents = progressEvents.filter((e) => e.type === "experience");
  const projectEvents = progressEvents.filter((e) => e.type === "project");
  const skillsEvents = progressEvents.filter((e) => e.type === "skills");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>✨ Resume Improvements</DialogTitle>
          <DialogDescription>
            {isLoading
              ? "AI is analyzing and improving your resume..."
              : "Review the AI-suggested improvements with explanations for each change."}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        {progressEvents.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progress: {progress.completed} / {progress.total} completed
              </span>
              <span className="font-medium">{Math.round(progress.percentage)}%</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {progress.pending} pending
              </span>
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3" /> {progress.processing} processing
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" /> {progress.completed} completed
              </span>
              {progress.failed > 0 && (
                <span className="flex items-center gap-1 text-red-500">
                  <X className="h-3 w-3" /> {progress.failed} failed
                </span>
              )}
            </div>
          </div>
        )}

        <Tabs defaultValue="experience" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="experience">
              Experience ({experienceEvents.length})
            </TabsTrigger>
            <TabsTrigger value="projects">
              Projects ({projectEvents.length})
            </TabsTrigger>
            <TabsTrigger value="skills">
              Skills ({skillsEvents.length})
            </TabsTrigger>
          </TabsList>

          {/* Experience Tab */}
          <TabsContent value="experience" className="flex-1 mt-4">
            <ScrollArea className="h-[50vh] pr-4">
              <div className="space-y-6">
                {experienceEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No experience items to improve
                  </p>
                ) : (
                  experienceEvents.map((event) => {
                    if (!("id" in event)) return null;
                    const experience = resume.experience.find((exp) => exp.id === event.id);
                    if (!experience) return null;

                    return (
                      <div key={event.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-sm">
                              {event.title} at {event.company}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {experience.dates}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusIcon status={event.status} />
                            <StatusBadge status={event.status} />
                          </div>
                        </div>

                        {event.status === "completed" && event.bullets && (
                          <div className="space-y-3 mt-4">
                            {event.bullets.map((bullet, index) => (
                              <ImprovementComparison
                                key={index}
                                original={bullet.original}
                                improved={bullet.improved}
                                reason={bullet.reason}
                              />
                            ))}
                          </div>
                        )}

                        {event.status === "processing" && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing improvements...</span>
                          </div>
                        )}

                        {event.status === "error" && (
                          <div className="text-sm text-red-500 py-2">
                            Error: {event.error || "Unknown error occurred"}
                          </div>
                        )}

                        <Separator className="my-4" />
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="flex-1 mt-4">
            <ScrollArea className="h-[50vh] pr-4">
              <div className="space-y-6">
                {projectEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No project items to improve
                  </p>
                ) : (
                  projectEvents.map((event) => {
                    if (!("id" in event)) return null;
                    const project = resume.projects.find((proj) => proj.id === event.id);
                    if (!project) return null;

                    return (
                      <div key={event.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-sm">{event.name}</h3>
                            <p className="text-xs text-muted-foreground">{project.dates}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusIcon status={event.status} />
                            <StatusBadge status={event.status} />
                          </div>
                        </div>

                        {event.status === "completed" && event.bullets && (
                          <div className="space-y-3 mt-4">
                            {event.bullets.map((bullet, index) => (
                              <ImprovementComparison
                                key={index}
                                original={bullet.original}
                                improved={bullet.improved}
                                reason={bullet.reason}
                              />
                            ))}
                          </div>
                        )}

                        {event.status === "processing" && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing improvements...</span>
                          </div>
                        )}

                        {event.status === "error" && (
                          <div className="text-sm text-red-500 py-2">
                            Error: {event.error || "Unknown error occurred"}
                          </div>
                        )}

                        <Separator className="my-4" />
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="flex-1 mt-4">
            <ScrollArea className="h-[50vh] pr-4">
              <div className="space-y-6">
                {skillsEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No skills section to improve
                  </p>
                ) : (
                  skillsEvents.map((event, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Skills Organization</h3>
                        <div className="flex items-center gap-2">
                          <StatusIcon status={event.status} />
                          <StatusBadge status={event.status} />
                        </div>
                      </div>

                      {event.status === "completed" &&
                        event.original &&
                        event.improved &&
                        event.reason && (
                          <ImprovementComparison
                            original={Object.entries(event.original)
                              .map(([category, skills]) => `${category}: ${skills.join(", ")}`)
                              .join("\n")}
                            improved={Object.entries(event.improved)
                              .map(([category, skills]) => `${category}: ${skills.join(", ")}`)
                              .join("\n")}
                            reason={event.reason}
                          />
                        )}

                      {event.status === "processing" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing improvements...</span>
                        </div>
                      )}

                      {event.status === "error" && (
                        <div className="text-sm text-red-500 py-2">
                          Error: {event.error || "Unknown error occurred"}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleReject}>
            {isLoading ? "Cancel" : "Reject Changes"}
          </Button>
          <Button onClick={handleAccept} disabled={!improvements || isLoading}>
            Accept All Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

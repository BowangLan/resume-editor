"use client";

import { memo, useState } from "react";
import { FileText, Upload, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "./file-uploader";
import { useResumeStore } from "@/hooks/use-resume";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const EmptyState = memo(function EmptyState() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createVersion = useResumeStore((state) => state.createVersion);

  const handleCreateVersion = () => {
    if (!name.trim()) {
      toast.error("Please enter a version name");
      return;
    }

    createVersion(name.trim(), description.trim() || undefined);
    toast.success(`Created version "${name}"`);
    setName("");
    setDescription("");
    setCreateDialogOpen(false);
  };

  return (
    <>
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>

            <h2 className="text-2xl font-bold mb-2">No Resume Loaded</h2>
            <p className="text-muted-foreground mb-8">
              Upload a PDF resume or create a new version from scratch.
            </p>

            <div className="w-full space-y-4">
              <FileUploader />
            </div>

            <div className="mt-8 pt-8 border-t w-full">
              <h3 className="text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" />
                How It Works
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload a PDF resume for AI-powered parsing, or create a new
                version to manually add items from your master data pool.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Resume Version</DialogTitle>
            <DialogDescription>
              Create a new version to tailor your resume for different job
              applications. You can add items from your master data to each
              version.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="version-name">Version Name *</Label>
              <Input
                id="version-name"
                placeholder="e.g., Software Engineer, Data Science, Frontend Developer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateVersion();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version-description">
                Description (optional)
              </Label>
              <Textarea
                id="version-description"
                placeholder="Brief description of this version..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateVersion}>Create Version</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

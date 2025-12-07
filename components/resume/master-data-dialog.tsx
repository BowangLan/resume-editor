"use client";

import { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import { MasterEducationList } from "./master/master-education-list";
import { MasterExperienceList } from "./master/master-experience-list";
import { MasterProjectsList } from "./master/master-projects-list";
import { MasterSkillsList } from "./master/master-skills-list";

export const MasterDataDialog = memo(function MasterDataDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const masterData = useResumeStore((state) => state.masterData);
  const [activeTab, setActiveTab] = useState("experience");

  const counts = {
    education: masterData.education.length,
    experience: masterData.experience.length,
    projects: masterData.projects.length,
    skills: masterData.skillCategories.length,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Master Resume Data
          </DialogTitle>
          <DialogDescription>
            Manage your master pool of experiences, projects, education, and skills.
            Add items here, then select which ones to include in each resume version.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="experience" className="relative">
              Experience
              {counts.experience > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">
                  {counts.experience}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="projects" className="relative">
              Projects
              {counts.projects > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">
                  {counts.projects}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="education" className="relative">
              Education
              {counts.education > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">
                  {counts.education}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="skills" className="relative">
              Skills
              {counts.skills > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">
                  {counts.skills}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="experience" className="mt-0">
              <MasterExperienceList />
            </TabsContent>
            <TabsContent value="projects" className="mt-0">
              <MasterProjectsList />
            </TabsContent>
            <TabsContent value="education" className="mt-0">
              <MasterEducationList />
            </TabsContent>
            <TabsContent value="skills" className="mt-0">
              <MasterSkillsList />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});

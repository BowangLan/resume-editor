"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  FolderKanban,
  Code,
  FileText,
  Database,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useResumeStore } from "@/hooks/use-resume";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const pathname = usePathname();
  const versions = useResumeStore((state) => state.versions);
  const masterData = useResumeStore((state) => state.masterData);

  const masterDataItems = [
    {
      title: "Education",
      url: "/master/education",
      icon: GraduationCap,
      count: masterData.education.length,
    },
    {
      title: "Experience",
      url: "/master/experience",
      icon: Briefcase,
      count: masterData.experience.length,
    },
    {
      title: "Projects",
      url: "/master/projects",
      icon: FolderKanban,
      count: masterData.projects.length,
    },
    {
      title: "Skills",
      url: "/master/skills",
      icon: Code,
      count: masterData.skillCategories.length,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border h-12">
        <div className="flex items-center gap-2 my-auto px-2">
          <Database className="h-4 w-4" />
          <span className="text-sm font-medium">Resume Editor</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* My Data Group */}
        <SidebarGroup>
          <SidebarGroupLabel>My Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {masterDataItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        {item.count > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-auto h-5 min-w-5 px-1"
                          >
                            {item.count}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Resumes Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Resumes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {versions.length === 0 ? (
                <div className="px-3 py-6 text-sm text-muted-foreground text-center">
                  No resumes yet. Create one to get started.
                </div>
              ) : (
                versions.map((version) => {
                  const isActive = pathname === `/resumes/${version.id}`;
                  const itemCount =
                    version.education.length +
                    version.experience.length +
                    version.projects.length +
                    version.skillCategories.length;

                  return (
                    <SidebarMenuItem key={version.id}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={`/resumes/${version.id}`}>
                          <FileText />
                          <span className="truncate">{version.name}</span>
                          {itemCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-auto h-5 min-w-5 px-1"
                            >
                              {itemCount}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

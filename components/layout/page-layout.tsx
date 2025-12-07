"use client";

import { ReactNode } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { PageHeader, PageHeaderProps } from "./page-header";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  header?: PageHeaderProps;
  className?: string;
  contentClassName?: string;
}

export function PageLayout({
  children,
  header,
  className,
  contentClassName,
}: PageLayoutProps) {
  return (
    <SidebarInset className={cn("h-screen flex flex-col", className)}>
      {header && <PageHeader {...header} />}
      <main className={cn("flex-1 overflow-hidden", contentClassName)}>
        {children}
      </main>
    </SidebarInset>
  );
}


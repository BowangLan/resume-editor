"use client";

import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";

export interface PageHeaderProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center border-b px-2 gap-2 border-sidebar-border supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />
      {/* <Separator orientation="vertical" className="h-6" /> */}
      {children || (
        <>
          {/* {Icon && <Icon className="h-4.5 w-4.5 shrink-0" />} */}
          {(title || description) && (
            <div className="flex flex-col min-w-0 flex-1">
              {title && (
                <h1 className="text-sm font-medium leading-tight truncate">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-xs font-normal text-muted-foreground leading-tight truncate">
                  {description}
                </p>
              )}
            </div>
          )}
          {actions && (
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          )}
        </>
      )}
    </header>
  );
}

"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContentProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "full" | "custom";
  customMaxWidth?: string;
  padding?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "4xl": "max-w-4xl",
  full: "max-w-full",
  custom: "",
};

export function PageContent({
  children,
  className,
  maxWidth = "full",
  customMaxWidth,
  padding = true,
}: PageContentProps) {
  const maxWidthClass =
    maxWidth === "custom" && customMaxWidth
      ? customMaxWidth
      : maxWidthClasses[maxWidth];

  return (
    <div
      className={cn(
        "h-full w-full",
        padding && "px-4 sm:px-6 lg:px-6 py-4 sm:py-8",
        maxWidthClass && maxWidth !== "full" && "mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}


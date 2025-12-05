"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

interface ImprovementComparisonProps {
  original: string;
  improved: string;
  reason: string;
}

export function ImprovementComparison({
  original,
  improved,
  reason,
}: ImprovementComparisonProps) {
  // Check if there's actually a change
  const hasChange = original.trim() !== improved.trim();

  return (
    <Card className="p-4 space-y-3">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Before */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Before
            </Badge>
            {!hasChange && (
              <Badge variant="outline" className="text-xs">
                Already strong
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {original}
          </p>
        </div>

        {/* After */}
        <div className="space-y-2">
          <Badge variant="default" className="text-xs">
            After
          </Badge>
          <p className="text-sm leading-relaxed font-medium">
            {improved}
          </p>
        </div>
      </div>

      {/* Reason */}
      {hasChange && (
        <div className="flex gap-2 items-start bg-muted/50 rounded-lg p-3">
          <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {reason}
          </p>
        </div>
      )}
    </Card>
  );
}

"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, List, AlignLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

interface BulletListEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  label?: string;
}

export const BulletListEditor = memo(function BulletListEditor({
  bullets,
  onChange,
  label = "Bullet Points",
}: BulletListEditorProps) {
  const [isBatchMode, setIsBatchMode] = useState(false);

  const handleAdd = useCallback(() => {
    onChange([...bullets, ""]);
  }, [bullets, onChange]);

  const handleRemove = useCallback(
    (index: number) => {
      onChange(bullets.filter((_, i) => i !== index));
    },
    [bullets, onChange]
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      const newBullets = [...bullets];
      newBullets[index] = value;
      onChange(newBullets);
    },
    [bullets, onChange]
  );

  // Batch mode handlers
  const textValue = useMemo(() => bullets.join("\n"), [bullets]);

  const handleBatchChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const lines = e.target.value.split("\n");
      onChange(lines);
    },
    [onChange]
  );

  const handleBatchBlur = useCallback(() => {
    const nonEmptyBullets = bullets.filter(
      (bullet) => bullet.replaceAll("•", "").replaceAll("•", "").trim() !== ""
    );
    if (
      nonEmptyBullets.length !== bullets.length ||
      nonEmptyBullets.some((bullet, i) => bullet !== bullets[i])
    ) {
      onChange(nonEmptyBullets.length > 0 ? nonEmptyBullets : [""]);
    }
  }, [bullets, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            // When switching from batch to list, parse and trim bullets
            if (isBatchMode) {
              const cleanedBullets = bullets
                .map((bullet) =>
                  bullet.replaceAll("•", "").replaceAll("•", "").trim()
                )
                .filter((bullet) => bullet !== "");
              onChange(cleanedBullets.length > 0 ? cleanedBullets : [""]);
            }
            setIsBatchMode(!isBatchMode);
          }}
          className="gap-2 h-8"
        >
          {isBatchMode ? (
            <>
              <List className="h-4 w-4" />
              List
            </>
          ) : (
            <>
              <AlignLeft className="h-4 w-4" />
              Batch Edit
            </>
          )}
        </Button>
      </div>

      {isBatchMode ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            One bullet point per line
          </p>
          <Textarea
            value={textValue}
            onChange={handleBatchChange}
            onBlur={handleBatchBlur}
            placeholder="Enter bullet points, one per line..."
            rows={Math.max(6, bullets.length + 2)}
            className="font-mono text-sm"
          />
        </div>
      ) : (
        <>
          {bullets.map((bullet, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={bullet}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="Enter bullet point..."
                rows={2}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAdd}
            className="w-full"
          >
            <Plus />
          </Button>
        </>
      )}
    </div>
  );
});

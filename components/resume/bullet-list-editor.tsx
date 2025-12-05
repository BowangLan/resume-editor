"use client";

import { memo, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface BulletListEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  label?: string;
}

export const BulletListEditor = memo(function BulletListEditor({
  bullets,
  onChange,
  label = 'Bullet Points',
}: BulletListEditorProps) {
  const handleAdd = useCallback(() => {
    onChange([...bullets, '']);
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

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
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
        size="sm"
        onClick={handleAdd}
        className="w-full"
      >
        <Plus className="h-4 w-4" />
        Add Bullet Point
      </Button>
    </div>
  );
});

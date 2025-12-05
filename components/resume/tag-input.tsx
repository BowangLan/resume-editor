"use client";

import { memo, useCallback, useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
}

export const TagInput = memo(function TagInput({
  tags,
  onChange,
  label = 'Tags',
  placeholder = 'Type and press Enter...',
}: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && input.trim()) {
        e.preventDefault();
        if (!tags.includes(input.trim())) {
          onChange([...tags, input.trim()]);
        }
        setInput('');
      } else if (e.key === 'Backspace' && !input && tags.length > 0) {
        onChange(tags.slice(0, -1));
      }
    },
    [input, tags, onChange]
  );

  const handleRemove = useCallback(
    (tagToRemove: string) => {
      onChange(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags, onChange]
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemove(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
});

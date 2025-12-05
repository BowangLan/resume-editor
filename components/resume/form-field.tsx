"use client";

import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}

export const FormField = memo(function FormField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  required = false,
}: FormFieldProps) {
  const Component = multiline ? Textarea : Input;

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Component
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? rows : undefined}
        className="w-full"
      />
    </div>
  );
});

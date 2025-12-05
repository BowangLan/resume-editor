"use client";

import { memo } from 'react';
import { FileText, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FileUploader } from './file-uploader';

export const EmptyState = memo(function EmptyState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="rounded-full bg-primary/10 p-6 mb-6">
            <FileText className="h-12 w-12 text-primary" />
          </div>

          <h2 className="text-2xl font-bold mb-2">No Resume Loaded</h2>
          <p className="text-muted-foreground mb-8">
            Upload a PDF resume to get started. Our AI will parse it into an editable format.
          </p>

          <FileUploader />

          <div className="mt-8 pt-8 border-t w-full">
            <h3 className="text-sm font-semibold mb-3 flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" />
              How It Works
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload any PDF resume and our AI will automatically extract and structure
              your information into editable sections. You can then edit and download as LaTeX.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

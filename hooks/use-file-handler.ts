"use client";

import { useCallback } from 'react';
import { generateLatex } from '@/lib/generator/latex-generator';
import type { Resume } from '@/lib/types/resume';

export function useFileHandler() {
  const handleUpload = useCallback(
    async (file: File): Promise<Resume> => {
      if (!file.type.includes('pdf')) {
        throw new Error('Please upload a PDF file');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to parse resume');
      }

      const data = await response.json();
      return data.resume;
    },
    []
  );

  const handleDownload = useCallback((resume: Resume, filename: string = 'resume.lex') => {
    const latex = generateLatex(resume);
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadPDF = useCallback(async (resume: Resume, filename: string = 'resume.pdf') => {
    const latex = generateLatex(resume);

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latex }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate PDF');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return {
    handleUpload,
    handleDownload,
    handleDownloadPDF,
  };
}

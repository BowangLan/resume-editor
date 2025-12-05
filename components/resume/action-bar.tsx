"use client";

import { memo, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileDown } from 'lucide-react';
import { useFileHandler } from '@/hooks/use-file-handler';
import { useResumeStore } from '@/hooks/use-resume';
import { FileUploader } from './file-uploader';
import { ImproveResumeButton } from './improve-resume-button';
import { toast } from 'sonner';

export const ActionBar = memo(function ActionBar() {
  const { resume } = useResumeStore();
  const { handleDownload, handleDownloadPDF } = useFileHandler();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const onDownload = useCallback(() => {
    if (!resume) {
      toast.error('No resume to download');
      return;
    }

    try {
      handleDownload(resume, `${resume.header.name.toLowerCase().replace(/\s+/g, '-')}-resume.lex`);
      toast.success('Resume downloaded!');
    } catch (error) {
      toast.error('Failed to download resume');
      console.error(error);
    }
  }, [resume, handleDownload]);

  const onDownloadPDF = useCallback(async () => {
    if (!resume) {
      toast.error('No resume to download');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await handleDownloadPDF(resume, `${resume.header.name.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`);
      toast.success('PDF generated and downloaded!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [resume, handleDownloadPDF]);

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-xl font-bold">Resume Editor</h1>
        </div>

        <div className="flex items-center gap-3">
          <FileUploader />
          {resume && (
            <>
              <ImproveResumeButton />
              <Button onClick={onDownload} size="sm" variant="outline">
                <Download className="h-4 w-4" />
                Download LaTeX
              </Button>
              <Button onClick={onDownloadPDF} size="sm" disabled={isGeneratingPDF}>
                <FileDown className="h-4 w-4" />
                {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

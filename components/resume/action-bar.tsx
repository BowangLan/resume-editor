"use client";

import { memo, useCallback } from "react";
import { RichButton } from "@/components/ui/rich-button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Copy } from "lucide-react";
import { useCurrentResume } from "@/hooks/use-resume";
import { FileUploader } from "./file-uploader";
import { ImproveResumeButton } from "./improve-resume-button";
import { LatexCodeDialog } from "./latex-code-dialog";
import { generateLatex } from "@/lib/generator/latex-generator";
import { toast } from "sonner";

export const ActionBar = memo(function ActionBar() {
  const resume = useCurrentResume();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3 ml-auto">
        <FileUploader />
        {resume && (
          <>
            {/* <ImproveResumeButton /> */}
            {/* <Button onClick={onDownload} size="sm" variant="outline">
              <Download className="h-4 w-4" />
              Download LaTeX
            </Button> */}
            {/* <Button
              onClick={onDownloadPDF}
              size="sm"
              disabled={isGeneratingPDF}
            >
              <FileDown className="h-4 w-4" />
              {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
            </Button> */}
          </>
        )}
      </div>
    </TooltipProvider>
  );
});

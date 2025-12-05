"use client";

import { memo, useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, FileCode } from "lucide-react";
import { useResumeStore } from "@/hooks/use-resume";
import { generateLatex } from "@/lib/generator/latex-generator";
import { toast } from "sonner";
import { RichButton } from "../ui/rich-button";

interface LatexCodeDialogProps {
  children?: React.ReactNode;
}

export const LatexCodeDialog = memo(function LatexCodeDialog({
  children,
}: LatexCodeDialogProps) {
  const { resume } = useResumeStore();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const latexCode = useMemo(() => {
    if (!resume) return "";
    return generateLatex(resume);
  }, [resume]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      toast.success("LaTeX code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (!resume) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <RichButton
            size="icon-sm"
            variant="outline"
            tooltip="View LaTeX Code"
          >
            <FileCode className="h-4 w-4" />
          </RichButton>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl sm:max-w-7xl h-[80vh] sm:h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>LaTeX Code</span>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Code
                </>
              )}
            </Button>
          </DialogTitle>
          <DialogDescription>
            Copy the generated LaTeX code below to use in your own LaTeX editor
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto rounded-lg border">
          <SyntaxHighlighter
            language="latex"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              height: "100%",
            }}
            showLineNumbers
          >
            {latexCode}
          </SyntaxHighlighter>
        </div>
      </DialogContent>
    </Dialog>
  );
});

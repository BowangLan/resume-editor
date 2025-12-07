"use client";

import { memo, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useCurrentResume } from '@/hooks/use-resume';
import { generateLatex } from '@/lib/generator/latex-generator';
import { useState } from 'react';
import { toast } from 'sonner';

export const LatexPreview = memo(function LatexPreview() {
  const resume = useCurrentResume();
  const [copied, setCopied] = useState(false);

  const latexCode = useMemo(() => {
    if (!resume) return '';
    return generateLatex(resume);
  }, [resume]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      toast.success('LaTeX code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (!resume) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>LaTeX Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No resume loaded. Upload a PDF to see the generated LaTeX code.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle>LaTeX Preview</CardTitle>
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
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <SyntaxHighlighter
          language="latex"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '0.875rem',
            height: '100%',
          }}
          showLineNumbers
        >
          {latexCode}
        </SyntaxHighlighter>
      </CardContent>
    </Card>
  );
});

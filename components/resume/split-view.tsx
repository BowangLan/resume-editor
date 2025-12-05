"use client";

import { memo, useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeEditor } from './resume-editor';
import { ResumeView } from './resume-view';
import { LatexPreview } from './latex-preview';
import { FileCode, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SplitView = memo(function SplitView() {
  const [activeTab, setActiveTab] = useState<'editor' | 'view' | 'latex'>('editor');
  const [leftMode, setLeftMode] = useState<'editor' | 'view'>('editor');

  return (
    <>
      {/* Desktop: Split View */}
      <div className="hidden lg:block h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4 pr-4">
                <Tabs value={leftMode} onValueChange={(v) => setLeftMode(v as 'editor' | 'view')} className="flex-1">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="editor" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Editor
                    </TabsTrigger>
                    <TabsTrigger value="view" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex-1 overflow-auto pr-4">
                {leftMode === 'editor' ? <ResumeEditor /> : <ResumeView />}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full pl-4">
              <LatexPreview />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile/Tablet: Tabbed View */}
      <div className="lg:hidden h-full">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'editor' | 'view' | 'latex')} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="editor" className="gap-2">
              <Eye className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="view" className="gap-2">
              <FileText className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="latex" className="gap-2">
              <FileCode className="h-4 w-4" />
              LaTeX
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 mt-0 overflow-auto">
            <ResumeEditor />
          </TabsContent>

          <TabsContent value="view" className="flex-1 mt-0 overflow-auto">
            <ResumeView />
          </TabsContent>

          <TabsContent value="latex" className="flex-1 mt-0 h-full">
            <LatexPreview />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
});

"use client";

import { memo, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeEditor } from "./resume-editor";
import { ResumeView } from "./resume-view";
import { Eye, FileText } from "lucide-react";

export const SplitView = memo(function SplitView() {
  const [activeTab, setActiveTab] = useState<"editor" | "view">("editor");

  return (
    <>
      {/* Desktop: Split View */}
      <div className="hidden lg:block h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-auto pr-3">
              <ResumeEditor />
            </div>
          </ResizablePanel>

          <ResizableHandle className="opacity-0" />

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-auto pl-3">
              <ResumeView />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile/Tablet: Tabbed View */}
      <div className="lg:hidden h-full">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "editor" | "view")}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="editor" className="gap-2">
              <Eye className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="view" className="gap-2">
              <FileText className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 mt-0 overflow-auto">
            <ResumeEditor />
          </TabsContent>

          <TabsContent value="view" className="flex-1 mt-0 overflow-auto">
            <ResumeView />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
});

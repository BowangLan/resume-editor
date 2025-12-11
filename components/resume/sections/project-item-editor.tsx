import { useResumeStore, useCurrentResume } from "@/hooks/use-resume";
import type { ProjectItem } from "@/lib/types/resume";
import { useCallback, useState, useMemo, useEffect } from "react";
import { FormField } from "../form-field";
import { BulletListEditor } from "../bullet-list-editor";
import { SectionItemContainer } from "./section-item-container";
import { isProjectDifferentFromMaster } from "@/lib/utils/item-comparison";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ItemEditorActions } from "./item-editor-actions";

export const ProjectItemEditor = ({
  item,
  index,
}: {
  item: ProjectItem;
  index: number;
}) => {
  const resume = useCurrentResume();
  const updateProjects = useResumeStore((state) => state.updateProjects);
  const syncItemFromMaster = useResumeStore(
    (state) => state.syncItemFromMaster
  );
  const promoteToMaster = useResumeStore((state) => state.promoteToMaster);
  const masterData = useResumeStore((state) => state.masterData);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(item);

  useEffect(() => {
    setDraft(item);
  }, [item]);

  // Check if this item is different from master
  const masterItem = useMemo(() => {
    if (!item.masterId) return undefined;
    return masterData.projects.find((m) => m.id === item.masterId);
  }, [item.masterId, masterData.projects]);

  const isDifferent = useMemo(() => {
    return isProjectDifferentFromMaster(item, masterItem);
  }, [item, masterItem]);

  const handleRemove = useCallback(
    (id: string) => {
      updateProjects((resume?.projects || []).filter((item) => item.id !== id));
    },
    [resume?.projects, updateProjects]
  );

  const handleChange = useCallback(
    (field: keyof ProjectItem, value: unknown) => {
      setDraft((prev) => ({ ...prev, [field]: value } as ProjectItem));
    },
    []
  );

  const handlePromoteToMaster = useCallback(() => {
    promoteToMaster("projects", item.id);
  }, [promoteToMaster, item.id]);

  const handleRevertToMaster = useCallback(() => {
    syncItemFromMaster("projects", item.id);
  }, [syncItemFromMaster, item.id]);

  const hasLocalChanges = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(item);
  }, [draft, item]);

  const handleSave = useCallback(() => {
    if (!resume) {
      setOpen(false);
      return;
    }

    if (!hasLocalChanges) {
      setOpen(false);
      return;
    }

    const items = resume.projects || [];
    const itemIndex = items.findIndex((existing) => existing.id === item.id);
    if (itemIndex === -1) {
      setOpen(false);
      return;
    }

    const newItems = [...items];
    newItems[itemIndex] = draft;
    updateProjects(newItems);

    toast.success("Project updated");
    setOpen(false);
  }, [
    resume,
    hasLocalChanges,
    item.id,
    draft,
    updateProjects,
    masterItem,
  ]);

  const handleDiscard = useCallback(() => {
    setDraft(item);
    setOpen(false);
  }, [item]);

  const subtitle = [item.dates, item.link].filter(Boolean).join(" · ");

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center gap-2">
          <span>{item.name}</span>
          {isDifferent && masterItem && (
            <Badge variant="secondary" className="text-xs">
              Modified
            </Badge>
          )}
        </div>
      }
      subtitle={subtitle}
      right={
        <ItemEditorActions
          open={open}
          setOpen={setOpen}
          hasLocalChanges={hasLocalChanges}
          onEdit={() => setOpen(true)}
          onSave={handleSave}
          onDiscard={handleDiscard}
          onRemove={() => handleRemove(item.id)}
          showMasterActions={Boolean(isDifferent && masterItem)}
          onRevertToMaster={handleRevertToMaster}
          onPromoteToMaster={handlePromoteToMaster}
        />
      }
    >
      <div className="space-y-4 px-3 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Project Name"
            value={draft.name}
            onChange={(value) => handleChange("name", value)}
            placeholder="Awesome Project"
            required
          />
          <FormField
            label="Dates"
            value={draft.dates}
            onChange={(value) => handleChange("dates", value)}
            placeholder="Jan 2023 -- Mar 2023"
          />
        </div>

        <FormField
          label="Link (optional)"
          value={draft.link || ""}
          onChange={(value) => handleChange("link", value)}
          placeholder="https://project.com"
        />

        <BulletListEditor
          bullets={draft.bullets}
          onChange={(value) => handleChange("bullets", value)}
          label="Project Details"
        />
      </div>
    </SectionItemContainer>
  );
};

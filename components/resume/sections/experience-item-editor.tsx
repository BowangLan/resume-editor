import { BulletListEditor } from "../bullet-list-editor";
import { useResumeStore, useCurrentResume } from "@/hooks/use-resume";
import { useCallback, useState, useMemo, useEffect } from "react";
import type { ExperienceItem } from "@/lib/types/resume";
import { FormField } from "../form-field";
import { SectionItemContainer } from "./section-item-container";
import { isExperienceDifferentFromMaster } from "@/lib/utils/item-comparison";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ItemEditorActions } from "./item-editor-actions";

export const ExperienceItemEditor = ({
  item,
  index,
  draggable = false,
  onDragStart,
}: {
  item: ExperienceItem;
  index: number;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, itemId: string) => void;
}) => {
  const resume = useCurrentResume();
  const updateExperience = useResumeStore((state) => state.updateExperience);
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
    return masterData.experience.find((m) => m.id === item.masterId);
  }, [item.masterId, masterData.experience]);

  const isDifferent = useMemo(() => {
    return isExperienceDifferentFromMaster(item, masterItem);
  }, [item, masterItem]);

  const handleRemove = useCallback(
    (id: string) => {
      updateExperience(
        (resume?.experience || []).filter((item) => item.id !== id)
      );
    },
    [resume?.experience, updateExperience]
  );

  const handleChange = useCallback(
    (field: keyof ExperienceItem, value: unknown) => {
      setDraft((prev) => ({ ...prev, [field]: value } as ExperienceItem));
    },
    []
  );

  const handlePromoteToMaster = useCallback(() => {
    promoteToMaster("experience", item.id);
  }, [promoteToMaster, item.id]);

  const handleRevertToMaster = useCallback(() => {
    syncItemFromMaster("experience", item.id);
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

    const items = resume.experience || [];
    const itemIndex = items.findIndex((existing) => existing.id === item.id);
    if (itemIndex === -1) {
      setOpen(false);
      return;
    }

    const newItems = [...items];
    newItems[itemIndex] = draft;
    updateExperience(newItems);

    toast.success("Experience updated");
    setOpen(false);
  }, [
    resume,
    hasLocalChanges,
    item.id,
    draft,
    updateExperience,
    masterItem,
  ]);

  const handleDiscard = useCallback(() => {
    setDraft(item);
    setOpen(false);
  }, [item]);

  const subtitle = [item.company, item.dates].filter(Boolean).join(" · ");

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center gap-2">
          <span>{item.title}</span>
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
      draggable={draggable}
      onDragStart={onDragStart}
      itemId={item.id}
    >
      <div className="space-y-4 px-3 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Job Title"
            value={draft.title}
            onChange={(value) => handleChange("title", value)}
            placeholder="Software Engineer"
            required
          />
          <FormField
            label="Dates"
            value={draft.dates}
            onChange={(value) => handleChange("dates", value)}
            placeholder="Jan 2023 -- Present"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Company"
            value={draft.company}
            onChange={(value) => handleChange("company", value)}
            placeholder="Tech Corp"
            required
          />
          <FormField
            label="Location"
            value={draft.location}
            onChange={(value) => handleChange("location", value)}
            placeholder="City, State"
          />
        </div>

        <FormField
          label="Link (optional)"
          value={draft.link || ""}
          onChange={(value) => handleChange("link", value)}
          placeholder="https://company.com"
        />

        <BulletListEditor
          bullets={draft.bullets}
          onChange={(value) => handleChange("bullets", value)}
          label="Achievements & Responsibilities"
        />
      </div>
    </SectionItemContainer>
  );
};

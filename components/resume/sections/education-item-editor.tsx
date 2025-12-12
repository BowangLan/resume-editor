import { TagInput } from "../tag-input";
import { useResumeStore, useCurrentResume } from "@/hooks/use-resume";
import { useCallback, useState, useMemo, useEffect } from "react";
import type { EducationItem } from "@/lib/types/resume";
import { FormField } from "../form-field";
import { SectionItemContainer } from "./section-item-container";
import { isEducationDifferentFromMaster } from "@/lib/utils/item-comparison";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ItemEditorActions } from "./item-editor-actions";

export const EducationItemEditor = ({
  item,
  index,
  draggable = false,
  onDragStart,
}: {
  item: EducationItem;
  index: number;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, itemId: string) => void;
}) => {
  const resume = useCurrentResume();
  const updateEducation = useResumeStore((state) => state.updateEducation);
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
    return masterData.education.find((m) => m.id === item.masterId);
  }, [item.masterId, masterData.education]);

  const isDifferent = useMemo(() => {
    return isEducationDifferentFromMaster(item, masterItem);
  }, [item, masterItem]);

  const handleRemove = useCallback(
    (id: string) => {
      updateEducation(
        (resume?.education || []).filter((item) => item.id !== id)
      );
    },
    [resume?.education, updateEducation]
  );

  const handleChange = useCallback(
    (field: keyof EducationItem, value: unknown) => {
      setDraft((prev) => ({ ...prev, [field]: value } as EducationItem));
    },
    []
  );

  const handlePromoteToMaster = useCallback(() => {
    promoteToMaster("education", item.id);
  }, [promoteToMaster, item.id]);

  const handleRevertToMaster = useCallback(() => {
    syncItemFromMaster("education", item.id);
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

    const items = resume.education || [];
    const itemIndex = items.findIndex((existing) => existing.id === item.id);
    if (itemIndex === -1) {
      setOpen(false);
      return;
    }

    const newItems = [...items];
    newItems[itemIndex] = draft;
    updateEducation(newItems);

    toast.success("Education updated");
    setOpen(false);
  }, [
    resume,
    hasLocalChanges,
    item.id,
    draft,
    updateEducation,
    masterItem,
  ]);

  const handleDiscard = useCallback(() => {
    setDraft(item);
    setOpen(false);
  }, [item]);

  const subtitle = [item.degree, item.location].filter(Boolean).join(" · ");

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={
        <div className="flex items-center gap-2">
          <span>{item.school}</span>
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
            label="School"
            value={draft.school}
            onChange={(value) => handleChange("school", value)}
            placeholder="University of Example"
            required
          />
          <FormField
            label="Location"
            value={draft.location}
            onChange={(value) => handleChange("location", value)}
            placeholder="City, State"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Degree"
            value={draft.degree}
            onChange={(value) => handleChange("degree", value)}
            placeholder="Bachelor of Science in Computer Science"
            required
          />
          <FormField
            label="Dates"
            value={draft.dates}
            onChange={(value) => handleChange("dates", value)}
            placeholder="Sep 2020 -- Aug 2024"
          />
        </div>

        <TagInput
          tags={draft.coursework}
          onChange={(value) => handleChange("coursework", value)}
          label="Relevant Coursework"
          placeholder="Type course name and press Enter..."
        />
      </div>
    </SectionItemContainer>
  );
};

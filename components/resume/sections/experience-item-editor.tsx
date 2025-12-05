import { RichButton } from "@/components/ui/rich-button";
import { Check, ChevronDown, Pencil, Trash2, X } from "lucide-react";
import { BulletListEditor } from "../bullet-list-editor";
import { useResumeStore } from "@/hooks/use-resume";
import { useCallback, useState } from "react";
import type { ExperienceItem } from "@/lib/types/resume";
import { FormField } from "../form-field";
import { SectionItemContainer } from "./section-item-container";
import { cn } from "@/lib/utils";

export const ExperienceItemEditor = ({
  item,
  index,
}: {
  item: ExperienceItem;
  index: number;
}) => {
  const resume = useResumeStore((state) => state.resume);
  const updateExperience = useResumeStore((state) => state.updateExperience);
  const [open, setOpen] = useState(false);

  const handleRemove = useCallback(
    (id: string) => {
      updateExperience(
        (resume?.experience || []).filter((item) => item.id !== id)
      );
    },
    [resume?.experience, updateExperience]
  );

  const handleChange = useCallback(
    (id: string, field: keyof ExperienceItem, value: unknown) => {
      const items = resume?.experience || [];
      const itemIndex = items.findIndex((item) => item.id === id);
      if (itemIndex === -1) return;

      const newItems = [...items];
      newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
      updateExperience(newItems);
    },
    [resume?.experience, updateExperience]
  );

  const subtitle = [item.company, item.dates].filter(Boolean).join(" · ");

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={item.title}
      subtitle={subtitle}
      right={
        <>
          <RichButton
            onClick={() => handleRemove(item.id)}
            size="sm"
            variant="ghost"
            className="text-destructive group-hover:opacity-100 opacity-0 trans"
          >
            <Trash2 className="h-4 w-4" />
          </RichButton>
          {open ? (
            <RichButton
              onClick={() => setOpen(false)}
              size="sm"
              variant="default"
            >
              <Check className="h-4 w-4" />
              Done
            </RichButton>
          ) : (
            <RichButton
              onClick={() => setOpen(true)}
              size="icon-sm"
              variant="ghost"
            >
              <Pencil className="h-4 w-4" />
            </RichButton>
          )}
        </>
      }
    >
      <div className="space-y-4 px-3 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Job Title"
            value={item.title}
            onChange={(value) => handleChange(item.id, "title", value)}
            placeholder="Software Engineer"
            required
          />
          <FormField
            label="Dates"
            value={item.dates}
            onChange={(value) => handleChange(item.id, "dates", value)}
            placeholder="Jan 2023 -- Present"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Company"
            value={item.company}
            onChange={(value) => handleChange(item.id, "company", value)}
            placeholder="Tech Corp"
            required
          />
          <FormField
            label="Location"
            value={item.location}
            onChange={(value) => handleChange(item.id, "location", value)}
            placeholder="City, State"
          />
        </div>

        <FormField
          label="Link (optional)"
          value={item.link || ""}
          onChange={(value) => handleChange(item.id, "link", value)}
          placeholder="https://company.com"
        />

        <BulletListEditor
          bullets={item.bullets}
          onChange={(value) => handleChange(item.id, "bullets", value)}
          label="Achievements & Responsibilities"
        />
      </div>
    </SectionItemContainer>
  );
};

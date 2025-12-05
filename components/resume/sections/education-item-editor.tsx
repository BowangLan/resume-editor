import { RichButton } from "@/components/ui/rich-button";
import { TagInput } from "../tag-input";
import { useResumeStore } from "@/hooks/use-resume";
import { useCallback, useState } from "react";
import type { EducationItem } from "@/lib/types/resume";
import { FormField } from "../form-field";
import { motion } from "motion/react";
import { Check, ChevronDown, Pencil, Trash2, X } from "lucide-react";
import { SectionItemContainer } from "./section-item-container";
import { cn } from "@/lib/utils";

export const EducationItemEditor = ({
  item,
  index,
}: {
  item: EducationItem;
  index: number;
}) => {
  const resume = useResumeStore((state) => state.resume);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const [open, setOpen] = useState(false);

  const handleRemove = useCallback(
    (id: string) => {
      updateEducation(
        (resume?.education || []).filter((item) => item.id !== id)
      );
    },
    [resume?.education, updateEducation]
  );

  const handleChange = useCallback(
    (id: string, field: keyof EducationItem, value: unknown) => {
      const items = resume?.education || [];
      const itemIndex = items.findIndex((item) => item.id === id);
      if (itemIndex === -1) return;

      const newItems = [...items];
      newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
      updateEducation(newItems);
    },
    [resume?.education, updateEducation]
  );

  const subtitle = [item.degree, item.location].filter(Boolean).join(" · ");

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={item.school}
      subtitle={subtitle}
      right={
        <>
          <RichButton
            onClick={() => handleRemove(item.id)}
            size="icon-sm"
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
            label="School"
            value={item.school}
            onChange={(value) => handleChange(item.id, "school", value)}
            placeholder="University of Example"
            required
          />
          <FormField
            label="Location"
            value={item.location}
            onChange={(value) => handleChange(item.id, "location", value)}
            placeholder="City, State"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Degree"
            value={item.degree}
            onChange={(value) => handleChange(item.id, "degree", value)}
            placeholder="Bachelor of Science in Computer Science"
            required
          />
          <FormField
            label="Dates"
            value={item.dates}
            onChange={(value) => handleChange(item.id, "dates", value)}
            placeholder="Sep 2020 -- Aug 2024"
          />
        </div>

        <TagInput
          tags={item.coursework}
          onChange={(value) => handleChange(item.id, "coursework", value)}
          label="Relevant Coursework"
          placeholder="Type course name and press Enter..."
        />
      </div>
    </SectionItemContainer>
  );
};

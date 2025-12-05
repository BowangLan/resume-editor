import { RichButton } from "@/components/ui/rich-button";
import { useResumeStore } from "@/hooks/use-resume";
import type { ProjectItem } from "@/lib/types/resume";
import { useCallback, useState } from "react";
import { FormField } from "../form-field";
import { BulletListEditor } from "../bullet-list-editor";
import { Check, ChevronDown, Pencil, Trash2, X } from "lucide-react";
import { SectionItemContainer } from "./section-item-container";
import { cn } from "@/lib/utils";

export const ProjectItemEditor = ({
  item,
  index,
}: {
  item: ProjectItem;
  index: number;
}) => {
  const resume = useResumeStore((state) => state.resume);
  const updateProjects = useResumeStore((state) => state.updateProjects);
  const [open, setOpen] = useState(false);

  const handleRemove = useCallback(
    (id: string) => {
      updateProjects((resume?.projects || []).filter((item) => item.id !== id));
    },
    [resume?.projects, updateProjects]
  );

  const handleChange = useCallback(
    (id: string, field: keyof ProjectItem, value: unknown) => {
      const items = resume?.projects || [];
      const itemIndex = items.findIndex((item) => item.id === id);
      if (itemIndex === -1) return;

      const newItems = [...items];
      newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
      updateProjects(newItems);
    },
    [resume?.projects, updateProjects]
  );

  const subtitle = [item.dates, item.link].filter(Boolean).join(" · ");

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={item.name}
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
            label="Project Name"
            value={item.name}
            onChange={(value) => handleChange(item.id, "name", value)}
            placeholder="Awesome Project"
            required
          />
          <FormField
            label="Dates"
            value={item.dates}
            onChange={(value) => handleChange(item.id, "dates", value)}
            placeholder="Jan 2023 -- Mar 2023"
          />
        </div>

        <FormField
          label="Link (optional)"
          value={item.link || ""}
          onChange={(value) => handleChange(item.id, "link", value)}
          placeholder="https://project.com"
        />

        <BulletListEditor
          bullets={item.bullets}
          onChange={(value) => handleChange(item.id, "bullets", value)}
          label="Project Details"
        />
      </div>
    </SectionItemContainer>
  );
};

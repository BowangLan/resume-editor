import { RichButton } from "@/components/ui/rich-button";
import { useResumeStore } from "@/hooks/use-resume";
import { useCallback, useState } from "react";
import { Trash2, X, Plus, ChevronDown } from "lucide-react";
import { SectionItemContainer } from "./section-item-container";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SkillCategoryEditor = ({ category }: { category: string }) => {
  const resume = useResumeStore((state) => state.resume);
  const updateSkills = useResumeStore((state) => state.updateSkills);
  const [open, setOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleRemoveCategory = useCallback(
    (category: string) => {
      if (!resume) return;
      const { [category]: _, ...rest } = resume.skills;
      updateSkills(rest);
    },
    [resume, updateSkills]
  );

  const handleAddSkill = useCallback(() => {
    if (!resume || !newSkill.trim()) return;

    const updatedSkills = {
      ...resume.skills,
      [category]: [...(resume.skills[category] || []), newSkill.trim()],
    };
    updateSkills(updatedSkills);
    setNewSkill("");
  }, [resume, category, newSkill, updateSkills]);

  const handleRemoveSkill = useCallback(
    (skillIndex: number) => {
      if (!resume) return;

      const updatedSkills = {
        ...resume.skills,
        [category]: resume.skills[category].filter(
          (_, idx) => idx !== skillIndex
        ),
      };
      updateSkills(updatedSkills);
    },
    [resume, category, updateSkills]
  );

  if (!resume) return null;

  const skills = resume.skills[category] || [];
  const subtitle = `${skills.length} skill${skills.length !== 1 ? "s" : ""}`;

  return (
    <SectionItemContainer
      open={open}
      setOpen={setOpen}
      title={category}
      subtitle={subtitle}
      right={
        <>
          <RichButton
            onClick={() => handleRemoveCategory(category)}
            size="icon-sm"
            variant="ghost"
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </RichButton>
          <RichButton
            onClick={() => setOpen(false)}
            size="icon-sm"
            variant="ghost"
            className="text-primary"
          >
            <ChevronDown className={cn("h-4 w-4", open ? "rotate-180" : "")} />
          </RichButton>
        </>
      }
    >
      <div className="space-y-4 px-3 py-4">
        {/* Skills in this category */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="pr-1">
              {skill}
              <button
                onClick={() => handleRemoveSkill(index)}
                className="ml-1.5 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No skills in this category yet.
            </p>
          )}
        </div>

        {/* Add skill input */}
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Add a skill..."
            className="text-sm"
          />
          <RichButton
            onClick={handleAddSkill}
            size="icon"
            variant="outline"
            tooltip="Add a new skill"
          >
            <Plus />
          </RichButton>
        </div>
      </div>
    </SectionItemContainer>
  );
};

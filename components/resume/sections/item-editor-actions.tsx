import { RichButton } from "@/components/ui/rich-button";
import { cn } from "@/lib/utils";
import { RotateCcw, Upload, Trash2, X, Check, Pencil } from "lucide-react";

interface ItemEditorActionsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  hasLocalChanges: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDiscard: () => void;
  onRemove: () => void;
  showMasterActions?: boolean;
  onRevertToMaster?: () => void;
  onPromoteToMaster?: () => void;
}

export function ItemEditorActions({
  open,
  setOpen,
  hasLocalChanges,
  onEdit,
  onSave,
  onDiscard,
  onRemove,
  showMasterActions,
  onRevertToMaster,
  onPromoteToMaster,
}: ItemEditorActionsProps) {
  return (
    <>
      {open && (
        <RichButton
          onClick={(event) => {
            event.stopPropagation();
            setOpen(false);
          }}
          size="icon-sm"
          variant="ghost"
          className={cn(
            "group-hover:opacity-100 opacity-0 trans",
            open && "opacity-100"
          )}
          title="Close"
          tooltip="Close editor"
        >
          <X className="h-4 w-4" />
        </RichButton>
      )}
      {showMasterActions && (
        <>
          {onRevertToMaster && (
            <RichButton
              onClick={(event) => {
                event.stopPropagation();
                onRevertToMaster();
              }}
              size="icon-sm"
              variant="ghost"
              className="group-hover:opacity-100 opacity-0 trans"
              title="Revert to master data"
              tooltip="Revert to master data"
            >
              <RotateCcw className="h-4 w-4" />
            </RichButton>
          )}
          {onPromoteToMaster && (
            <RichButton
              onClick={(event) => {
                event.stopPropagation();
                onPromoteToMaster();
              }}
              size="icon-sm"
              variant="ghost"
              className="group-hover:opacity-100 opacity-0 trans"
              title="Promote to master data"
              tooltip="Promote to master data"
            >
              <Upload className="h-4 w-4" />
            </RichButton>
          )}
        </>
      )}

      <RichButton
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        size="icon-sm"
        variant="ghost"
        className="text-destructive group-hover:opacity-100 opacity-0 trans"
      >
        <Trash2 className="h-4 w-4" />
      </RichButton>

      {open && hasLocalChanges && (
        <RichButton
          onClick={(event) => {
            event.stopPropagation();
            onDiscard();
          }}
          size="icon-sm"
          variant="ghost"
          className="group-hover:opacity-100 opacity-0 trans"
          title="Discard changes"
          tooltip="Discard changes"
          disabled={!hasLocalChanges}
        >
          <X className="h-4 w-4" />
        </RichButton>
      )}

      {open ? (
        <RichButton
          onClick={(event) => {
            event.stopPropagation();
            onSave();
          }}
          size="sm"
          variant="default"
          disabled={!hasLocalChanges}
          tooltip={hasLocalChanges ? "Save changes" : "No changes to save"}
        >
          <Check className="h-4 w-4" />
          Done
        </RichButton>
      ) : (
        <RichButton
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
          size="icon-sm"
          variant="ghost"
        >
          <Pencil className="h-4 w-4" />
        </RichButton>
      )}
    </>
  );
}

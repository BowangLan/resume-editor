import { AnimatePresence, cubicBezier, motion } from "motion/react";
import { GripVertical } from "lucide-react";
import { useState } from "react";

export const SectionItemContainer = ({
  children,
  open,
  setOpen,
  title,
  subtitle,
  right,
  draggable = false,
  onDragStart,
  itemId,
}: {
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, itemId: string) => void;
  itemId?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart && itemId) {
      setIsDragging(true);
      onDragStart(e, itemId);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`flex flex-col group rounded-md border border-border shadow-xs transition-opacity ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="flex flex-row py-3 px-3 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {draggable && (
          <div
            className="flex items-center pr-2 cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 group-hover:translate-x-1 trans">
          <motion.h4
            className="font-normal text-sm group-hover:font-medium trans"
            style={{
              // fontWeight: open ? "semibold" : undefined,
            }}
          >
            {!!title ? (
              title
            ) : (
              <span className="text-muted-foreground">Untitled</span>
            )}
          </motion.h4>

          {subtitle && (
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          )}
        </div>
        <div className="flex items-center gap-1">{right}</div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: cubicBezier(0.215, 0.61, 0.355, 1.0),
            }}
            className="border-t border-border"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

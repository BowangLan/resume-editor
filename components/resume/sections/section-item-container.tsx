import { AnimatePresence, motion } from "motion/react";

export const SectionItemContainer = ({
  children,
  open,
  setOpen,
  title,
  subtitle,
  right,
}: {
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col group rounded-md border border-border shadow-xs">
      <motion.div
        className="flex flex-row py-3 px-3 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <div className="flex-1 group-hover:translate-x-1 transition-transform">
          <motion.h4
            className="font-normal text-base group-hover:font-semibold transition-all"
            style={{
              fontWeight: open ? 600 : undefined,
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
        <div className="flex items-center gap-2">{right}</div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="border-t border-border"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

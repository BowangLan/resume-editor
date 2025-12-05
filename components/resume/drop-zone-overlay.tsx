"use client";

import { memo } from "react";
import { Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DropZoneOverlayProps {
  isDragging: boolean;
}

export const DropZoneOverlay = memo(function DropZoneOverlay({
  isDragging,
}: DropZoneOverlayProps) {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          {/* Drop indicator */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative z-10 flex flex-col items-center gap-4 p-12 rounded-2xl border-2 border-dashed border-primary bg-background/90 shadow-2xl"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Upload className="h-16 w-16 text-primary" />
            </motion.div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Drop PDF Resume Here</h3>
              <p className="text-muted-foreground text-lg">
                Release to upload and parse your resume
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

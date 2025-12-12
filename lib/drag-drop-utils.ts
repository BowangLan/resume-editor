/**
 * Drag and drop utilities for reordering resume items
 */

export type DragDropHandlers = {
  handleDragStart: (e: React.DragEvent, itemId: string) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
};

/**
 * Get all drop indicator elements for a specific section
 */
export const getIndicators = (sectionId: string): HTMLElement[] => {
  return Array.from(
    document.querySelectorAll(
      `[data-section="${sectionId}"]`
    ) as unknown as HTMLElement[]
  );
};

/**
 * Clear highlight from all drop indicators
 */
export const clearHighlights = (els?: HTMLElement[]) => {
  if (!els) return;
  els.forEach((i) => {
    i.style.opacity = "0";
  });
};

/**
 * Find the nearest drop indicator to the current drag position
 */
export const getNearestIndicator = (
  e: React.DragEvent,
  indicators: HTMLElement[]
) => {
  const DISTANCE_OFFSET = 50;

  const el = indicators.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = e.clientY - (box.top + DISTANCE_OFFSET);

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
      element: indicators[indicators.length - 1],
    }
  );

  return el;
};

/**
 * Highlight the nearest drop indicator
 */
export const highlightIndicator = (e: React.DragEvent, sectionId: string) => {
  const indicators = getIndicators(sectionId);
  clearHighlights(indicators);

  const el = getNearestIndicator(e, indicators);
  if (el.element) {
    el.element.style.opacity = "1";
  }
};

/**
 * Reorder items in an array based on drag and drop
 */
export const reorderItems = <T extends { id: string }>(
  items: T[],
  draggedId: string,
  beforeId: string | null
): T[] => {
  const copy = [...items];

  const draggedItem = copy.find((item) => item.id === draggedId);
  if (!draggedItem) return copy;

  // Remove dragged item
  const filtered = copy.filter((item) => item.id !== draggedId);

  // Add to new position
  if (beforeId === null || beforeId === "-1") {
    // Move to end
    filtered.push(draggedItem);
  } else {
    // Insert before the target item
    const insertAtIndex = filtered.findIndex((item) => item.id === beforeId);
    if (insertAtIndex === -1) return copy;
    filtered.splice(insertAtIndex, 0, draggedItem);
  }

  return filtered;
};

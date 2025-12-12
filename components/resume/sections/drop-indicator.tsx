/**
 * Visual indicator for drop zones during drag and drop
 */
export const DropIndicator = ({
  beforeId,
  sectionId,
}: {
  beforeId: string | null;
  sectionId: string;
}) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-section={sectionId}
      className="my-0.5 h-0.5 w-full bg-primary opacity-0 transition-opacity"
    />
  );
};

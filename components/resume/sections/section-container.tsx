export const SectionContainer = ({
  children,
  title,
  right,
}: {
  children: React.ReactNode;
  title: string;
  right?: React.ReactNode;
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
};

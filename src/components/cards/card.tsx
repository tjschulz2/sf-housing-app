export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 border-2 border-neutral-300 rounded-2xl flex flex-col gap-4">
      {children}
    </div>
  );
}

export function CardTop({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">{children}</div>
  );
}

export function CardBottom({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function CardListSection({
  children,
  sectionTitle,
  className,
}: {
  children: React.ReactNode;
  sectionTitle: string;
  className?: string;
}) {
  return (
    <div className={`${className ?? ""}`}>
      <span className="font-medium mr-1">{sectionTitle}</span>
      {children}
    </div>
  );
}

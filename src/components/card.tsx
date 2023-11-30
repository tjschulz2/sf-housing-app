export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 border-2 border-neutral-200 rounded-lg flex flex-col gap-4">
      {children}
    </div>
  );
}

export function CardTop({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between">{children}</div>;
}

export function CardBottom({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function CardListSection({
  children,
  sectionTitle,
}: {
  children: React.ReactNode;
  sectionTitle: string;
}) {
  return (
    <div>
      <h3 className="font-medium mb-1">{sectionTitle}</h3>
      {children}
    </div>
  );
}

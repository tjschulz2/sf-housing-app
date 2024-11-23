export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-4 md:p-6 bg-[#FFFDF3] rounded-2xl flex flex-col gap-4 ${className}`}
      style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
    >
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
  return <div className="flex flex-col grow gap-2">{children}</div>;
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

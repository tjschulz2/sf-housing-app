export default function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 mb-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}

export default function SpacePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex justify-center bg-neutral-100 min-h-dvh">
      <div className="max-w-md ">{children}</div>
    </div>
  );
}

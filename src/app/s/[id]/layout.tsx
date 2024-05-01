export default function SpacePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex justify-center items-center lg:justify-normal bg-neutral-100 min-h-dvh">
      <div className="max-w-md lg:max-w-full w-full">{children}</div>
    </div>
  );
}

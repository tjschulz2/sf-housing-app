export default function SpacePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-md ">{children}</div>
    </div>
  );
}

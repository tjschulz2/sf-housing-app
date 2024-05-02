// import { Cabin } from "next/font/google";
// const weights = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];

// const poppins = Cabin({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

export default function SpacePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`w-full flex justify-center items-center lg:justify-normal bg-grid-slate bg-fixed min-h-dvh`}
    >
      <div className="max-w-md lg:max-w-full w-full">{children}</div>
    </div>
  );
}

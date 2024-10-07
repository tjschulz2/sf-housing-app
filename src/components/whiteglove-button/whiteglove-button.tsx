import Link from "next/link";
import { Button } from "../ui/button";
import { Home, Laptop, BriefcaseBusiness } from "lucide-react";

export default function WhiteGloveButton() {
  return (
    <Button
      asChild
      variant="secondary"
      // className="rounded-3xl bg-[#1D462F] text-xs sm:text-base text-center"
      className="rounded-3xl bg-gray-200 text-xs sm:text-base text-center border-[#1D462F] border-2"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* <Link
        className="py-1 px-4"
        target="_blank"
        href="https://share.hsforms.com/1bNL2_LyWTvSYNhipfq5gygrh8kr"
      >
        <Home className="mr-1 sm:mr-2 size-4" />
        Help me find housing
      </Link> */}
      <Link
        className="py-1 px-4"
        target="_blank"
        href="https://forms.gle/Se8eRH5WvS3TX9oj6"
      >
        <BriefcaseBusiness className="mr-1 sm:mr-2 size-4" />
        Find an engineering role
      </Link>
    </Button>
  );
}

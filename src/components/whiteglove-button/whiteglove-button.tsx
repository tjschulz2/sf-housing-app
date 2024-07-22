import Link from "next/link";
import { Button } from "../ui/button";
import { Home } from "lucide-react";

export default function WhiteGloveButton() {
  return (
    <Button
      asChild
      className="rounded-3xl bg-[#1D462F] text-xs sm:text-base text-center"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Link
        className="py-1 px-4"
        target="_blank"
        href="https://share.hsforms.com/1bNL2_LyWTvSYNhipfq5gygrh8kr"
      >
        <Home className="mr-1 sm:mr-2 size-4" />
        Help me find housing
      </Link>
    </Button>
  );
}

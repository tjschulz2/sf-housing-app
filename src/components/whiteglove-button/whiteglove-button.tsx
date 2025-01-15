import Link from "next/link";
import { Button } from "../ui/button";
import { Home, Laptop, HandHeart } from "lucide-react";

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
      <Link className="py-1 px-4" target="_blank" href="/sponsor">
        <HandHeart className="mr-1 sm:mr-2 size-4" />
        Sponsor
      </Link>
    </Button>
  );
}

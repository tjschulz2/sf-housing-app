import Link from "next/link";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ReferralRequiredPage() {
  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen p-8">
      <div className="p-8 flex gap-8 bg-yellow-50 rounded-lg items-center">
        <AlertCircle className="size-6" />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-xl">Referral Required</h1>
          <p>
            DirectorySF is referral-only. If you don't have one, please{" "}
            <Link
              className="font-semibold underline"
              target="_blank"
              href="https://forms.gle/LT3UkjJ99e7VgCXN7"
            >
              apply
            </Link>
            .
          </p>
        </div>
      </div>
      <Button asChild variant="secondary">
        <div>
          <Undo2 />
          <Link href="/">Return home</Link>
        </div>
      </Button>
    </div>
  );
}

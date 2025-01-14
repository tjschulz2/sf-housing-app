import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

import { AlertCircle } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen p-8">
      <div className="p-8 flex gap-8 bg-yellow-50 rounded-lg items-center">
        <AlertCircle className="size-6" />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-xl">Authentication Error</h1>
          <p>
            Confirm you have an email associated with your Twitter account:{" "}
            <span className="italic">
              Settings &gt; Your account &gt; Account information
            </span>
            .
          </p>
          <p>
            If you&apos;re still having issues, please{" "}
            <Link
              className="font-bold underline"
              href="https://x.com/neallseth"
            >
              DM
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

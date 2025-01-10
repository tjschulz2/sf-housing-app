import Link from "next/link";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ErrorPage() {
  return (
    <div className="flex justify-center items-center h-screen p-8">
      <div className="p-8 flex gap-8 bg-yellow-50 rounded-lg items-center">
        <AlertCircle className="size-6" />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-xl">Authentication Error</h1>
          <p>
            Please confirm you have an email associated with your Twitter
            account. If you&apos;re still having issues signing in, please{" "}
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
    </div>
  );
}

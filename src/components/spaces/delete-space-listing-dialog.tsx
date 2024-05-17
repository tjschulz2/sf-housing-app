"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReactNode, useContext } from "react";
import { useState } from "react";
import { deleteSpaceListing } from "@/lib/utils/data";
import { useSpacesContext } from "@/contexts/spaces-context";
import { useAuthContext } from "@/contexts/auth-context";

export default function DeleteSpaceListingDialog({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { refreshSpaceListings, pullUserSpaceListing } = useSpacesContext();
  const { userSession } = useAuthContext();

  const { toast } = useToast();

  async function handleDeletion() {
    setSubmitted(true);
    if (!userSession) {
      return;
    }
    const result = await deleteSpaceListing(userSession.userID);
    if (result.success) {
      toast({
        title: "Successfully deleted space",
      });
      refreshSpaceListings();
      pullUserSpaceListing(userSession.userID);
    } else {
      toast({
        title: "Error: failed to delete profile",
      });
    }

    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <span>This will delete your space </span>
            <span className="mt-2 block">
              If you&apos;ve had success with DSF, please DM{" "}
              <a
                href="https://x.com/neallseth"
                className="text-neutral-700 font-semibold underline"
                target="_blank"
              >
                Neall
              </a>{" "}
              or{" "}
              <a
                href="https://x.com/thomasschulzz"
                className="text-neutral-700 font-semibold underline"
                target="_blank"
              >
                Tom
              </a>{" "}
              - we&apos;d love to hear about it! 🎉
              {/* <PartyPopper className="inline" size="16" /> */}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={submitted}
            onClick={handleDeletion}
            variant="destructive"
          >
            {submitted ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete my space
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

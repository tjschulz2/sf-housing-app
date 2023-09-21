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
import { ProfilesContext } from "@/app/directory/layout";
import { getUserSession } from "@/lib/utils/auth";
import { deleteUserHousingSearchProfile } from "@/lib/utils/data";

export default function DeleteSearcherProfileDialog({
  children,
  refreshProfileData,
}: {
  children: ReactNode;
  refreshProfileData: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const context = useContext(ProfilesContext);
  const refreshUserHousingSearchProfileData =
    context?.refreshUserHousingSearchProfileData;
  const { toast } = useToast();

  async function handleDeletion() {
    setSubmitted(true);
    const session = await getUserSession();
    if (!session) {
      return;
    }

    const result = await deleteUserHousingSearchProfile(session.userID);
    if (result.status === "success") {
      toast({
        title: "Successfully deleted profile data",
      });
      refreshProfileData();
      await refreshUserHousingSearchProfileData?.(session.userID);
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
            <span>This will delete your housing search profile. </span>
            <span className="mt-2 block">
              If you&apos;ve successfully found housing, please DM{" "}
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
          {/* <AlertDialogAction asChild>
            <Button variant="destructive">Delete my profile</Button>
          </AlertDialogAction> */}
          <Button
            disabled={submitted}
            onClick={handleDeletion}
            variant="destructive"
          >
            {submitted ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete my profile
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import SearcherProfileForm from "@/components/searcher-profile-form";
import { useState } from "react";
import { ProfilesContext } from "@/app/directory/layout";
import { getUserSession } from "@/lib/utils/auth";
import { useSpacesContext } from "@/contexts/spaces-context";
import SpaceListingForm from "./space-listing-form";

export default function EditSpaceListingDialog({
  children,
  newListing = false,
}: // refreshProfileData,
{
  children: ReactNode;
  // refreshProfileData: () => void;
  newListing?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  async function handleSuccessfulSubmission(success: boolean) {
    // const session = await getUserSession();
    // if (!session) {
    //   return;
    // }
    // toast({
    //   title: "Successfully updated profile data",
    // });

    // refreshProfileData();
    // await refreshUserHousingSearchProfileData?.(session.userID);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {newListing ? "Create listing" : "Edit listing"}
          </DialogTitle>
          <DialogDescription>
            {newListing
              ? "Make your space discoverable on DirectorySF"
              : "Make changes to your space here"}
          </DialogDescription>
        </DialogHeader>
        {/* <SearcherProfileForm handleSuccess={handleSuccessfulSubmission} /> */}
        <SpaceListingForm closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

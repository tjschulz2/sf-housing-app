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
import { ReactNode, useContext } from "react";
import SearcherProfileForm from "@/components/searcher-profile-form";
import { useState } from "react";
import { ProfilesContext } from "@/app/directory/layout";
import { getUserSession } from "@/lib/utils/auth";

export default function EditSearcherProfileDialog({
  children,
  refreshProfileData,
  newProfile = false,
}: {
  children: ReactNode;
  refreshProfileData: () => void;
  newProfile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const context = useContext(ProfilesContext);
  const refreshUserHousingSearchProfileData =
    context?.refreshUserHousingSearchProfileData;
  const { toast } = useToast();

  async function handleSuccessfulSubmission(success: boolean) {
    const session = await getUserSession();
    if (!session) {
      return;
    }
    toast({
      title: "Successfully updated profile data",
    });

    refreshProfileData();
    await refreshUserHousingSearchProfileData?.(session.userID);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {newProfile ? "Create profile" : "Edit profile"}
          </DialogTitle>
          <DialogDescription>
            {newProfile
              ? "Make yourself discoverable on DirectorySF"
              : "Make changes to your profile here"}
          </DialogDescription>
        </DialogHeader>
        <SearcherProfileForm handleSuccess={handleSuccessfulSubmission} />
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

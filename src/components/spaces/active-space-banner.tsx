import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Loader2 } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ActivityStatusDot from "@/components/activity-status-dot";
import { useToast } from "@/components/ui/use-toast";
import EditSpaceListingDialog from "@/components/spaces/edit-space-listing-dialog";
import DeleteSpaceListingDialog from "@/components/spaces/delete-space-listing-dialog";
import { dateDiff } from "@/lib/utils/general";
import { useAuthContext } from "@/contexts/auth-context";
import { useSpacesContext } from "@/contexts/spaces-context";
import { useState } from "react";
import { confirmSpaceListingActive } from "@/lib/utils/data";
import deriveActivityLevel from "@/lib/configMaps";

export default function ActiveSpaceBanner() {
  const [confirmationPending, setConfirmationPending] = useState(false);
  const { toast } = useToast();
  const { userSession } = useAuthContext();
  const { userSpaceListing, refreshSpaceListings, pullUserSpaceListing } =
    useSpacesContext();

  const daysSinceConfirmed = userSpaceListing?.last_updated_date
    ? dateDiff(userSpaceListing.last_updated_date).diffDays
    : null;
  const recentlyConfirmed =
    daysSinceConfirmed !== null ? daysSinceConfirmed < 1 : false;

  async function handleConfirm() {
    try {
      setConfirmationPending(true);
      if (!userSession?.userID) {
        return;
      }
      const { error } = await confirmSpaceListingActive(userSession.userID);
      setConfirmationPending(false);
      if (error) {
        throw new Error("Failed to confirm status");
      } else {
        await pullUserSpaceListing(userSession.userID);
        await refreshSpaceListings();

        toast({
          title: "Successfully confirmed search status",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to confirm status",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          You have an active listing{" "}
          <span className="ml-2 inline-flex">
            <ActivityStatusDot
              status={deriveActivityLevel(daysSinceConfirmed || 0)}
            />
          </span>
        </CardTitle>
        <CardDescription>You can manage your space here</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={recentlyConfirmed}
          className="rounded-3xl"
          onClick={handleConfirm}
        >
          {confirmationPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Confirm availability
        </Button>

        <p className="text-sm mt-2 text-neutral-500 dark:text-neutral-400">
          {recentlyConfirmed
            ? `You're all set! Maintain your active status by re-confirming periodically`
            : `You last confirmed ${daysSinceConfirmed} days ago`}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex">
          <EditSpaceListingDialog>
            <Button
              variant="secondary"
              className="rounded-3xl text-sm sm:text-md mr-4"
            >
              <Pencil size="16" className="mr-2" />
              Edit listing
            </Button>
          </EditSpaceListingDialog>
          <DeleteSpaceListingDialog>
            <Button className="rounded-3xl" variant="secondary">
              <Trash size="16" className="mr-2" />
              Delete listing
            </Button>
          </DeleteSpaceListingDialog>
        </div>
      </CardFooter>
    </Card>
  );
}

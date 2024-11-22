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
import EditSearcherProfileDialog from "@/components/edit-searcher-profile-dialog";
import DeleteSearcherProfileDialog from "@/components/delete-searcher-profile-dialog";
import { ProfilesContext, ProfilesContextType } from "@/app/(directory)/layout";
import { useContext, useState } from "react";
import ActivityStatusDot from "@/components/activity-status-dot";
import { dateDiff } from "@/lib/utils/general";
import { getUserSession } from "@/lib/utils/auth";
import { confirmHousingSearchProfileActive } from "@/lib/utils/data";
import { useToast } from "@/components/ui/use-toast";
import deriveActivityLevel from "@/lib/configMaps";

export default function ActiveProfileBanner({
  refreshProfileData,
}: {
  refreshProfileData: () => void;
}) {
  const [confirmationPending, setConfirmationPending] = useState(false);
  const { toast } = useToast();

  const { userHousingSearchProfile, refreshUserHousingSearchProfileData } =
    useContext(ProfilesContext) as ProfilesContextType;

  const daysSinceConfirmed = userHousingSearchProfile?.last_updated_date
    ? dateDiff(userHousingSearchProfile.last_updated_date).diffDays
    : null;
  const recentlyConfirmed =
    daysSinceConfirmed !== null ? daysSinceConfirmed < 1 : false;

  async function handleConfirm() {
    setConfirmationPending(true);
    const session = await getUserSession();
    if (!session?.userID) {
      return;
    }
    const { data, error } = await confirmHousingSearchProfileActive(
      session.userID
    );
    setConfirmationPending(false);
    if (error) {
      toast({
        title: "Failed to confirm status",
      });
    } else {
      await refreshUserHousingSearchProfileData?.(session.userID);
      refreshProfileData();

      toast({
        title: "Successfully confirmed search status",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          You have an active profile{" "}
          <span className="ml-2 inline-flex">
            <ActivityStatusDot
              status={deriveActivityLevel(daysSinceConfirmed || 0)}
            />
          </span>
        </CardTitle>
        <CardDescription>You can manage your profile here</CardDescription>
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
          Confirm still looking{" "}
        </Button>

        <p className="text-sm mt-2 text-neutral-500 dark:text-neutral-400">
          {recentlyConfirmed
            ? `You're all set! Maintain your active status by re-confirming periodically`
            : `You last confirmed ${daysSinceConfirmed} days ago`}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex">
          <EditSearcherProfileDialog refreshProfileData={refreshProfileData}>
            <Button
              variant="secondary"
              className="rounded-3xl text-sm sm:text-md mr-4 bg-[#F6F5EB]"
            >
              <Pencil size="16" className="mr-2" />
              Edit profile
            </Button>
          </EditSearcherProfileDialog>
          <DeleteSearcherProfileDialog refreshProfileData={refreshProfileData}>
            <Button className="rounded-3xl bg-[#F6F5EB]" variant="secondary">
              <Trash size="16" className="mr-2" />
              Delete profile
            </Button>
          </DeleteSearcherProfileDialog>
        </div>
      </CardFooter>
    </Card>
  );
}

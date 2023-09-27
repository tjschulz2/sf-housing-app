import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
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
import { ProfilesContext, ProfilesContextType } from "@/app/directory/layout";
import { useContext } from "react";

export default function ActiveProfileBanner({
  refreshProfileData,
}: {
  refreshProfileData: () => void;
}) {
  const { userHousingSearchProfile } = useContext(
    ProfilesContext
  ) as ProfilesContextType;

  const exampleRecentlyConfirmed = true;
  return (
    <Card>
      <CardHeader>
        <CardTitle>You have an active profile</CardTitle>
        <CardDescription>You can manage your profile here</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={exampleRecentlyConfirmed ? true : false}
          className="rounded-3xl"
        >
          {exampleRecentlyConfirmed
            ? "You're all set!"
            : "Confirm still active"}
        </Button>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          You last confirmed yourself active 12 days ago
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex">
          <EditSearcherProfileDialog refreshProfileData={refreshProfileData}>
            <Button
              variant="secondary"
              className="rounded-3xl text-sm sm:text-md mr-4"
            >
              <Pencil size="16" className="mr-2" />
              Edit profile
            </Button>
          </EditSearcherProfileDialog>
          <DeleteSearcherProfileDialog refreshProfileData={refreshProfileData}>
            <Button className="rounded-3xl" variant="secondary">
              <Trash size="16" className="mr-2" />
              Delete profile
            </Button>
          </DeleteSearcherProfileDialog>
        </div>
      </CardFooter>

      {/* <div className="flex mb-4 items-center">
      <UserCircle2 className="mr-2" size="32" />
        <h2 className="text-xl font-bold">You have an active profile</h2>
      </div> */}
      {/* <AlertTitle>You have an active profile</AlertTitle>
      <AlertDescription>
        You can delete or edit your profile here
      </AlertDescription> */}

      {/* <span className="mb-4">You can delete or edit your profile here</span> */}
      {/* <div className="flex">
        <Link className="mr-4" href="/housemates-form">
          <Button variant="secondary" className="rounded-3xl">
            <Pencil size="16" className="mr-2" />
            Edit profile
          </Button>
        </Link>
        <Button className="rounded-3xl">
          <Trash size="16" className="mr-2" />
          Delete profile
        </Button>
      </div> */}
    </Card>
  );
}

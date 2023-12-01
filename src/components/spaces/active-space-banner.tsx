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
import ActivityStatusDot from "@/components/activity-status-dot";
import { useToast } from "@/components/ui/use-toast";

export default function ActiveSpaceBanner({}: //   refreshSpacesData,
{
  //   refreshSpacesData: () => void;
}) {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          You have an active listing{" "}
          <span className="ml-2 inline-flex">
            <ActivityStatusDot status="high" />
          </span>
        </CardTitle>
        <CardDescription>You can manage your space here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>spacey spacey</p>
      </CardContent>
      <CardFooter>
        <div className="flex">
          {/* <EditSearcherProfileDialog refreshProfileData={refreshProfileData}>
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
          </DeleteSearcherProfileDialog> */}
        </div>
      </CardFooter>
    </Card>
  );
}

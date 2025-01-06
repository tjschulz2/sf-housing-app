import UserProfileImage from "@/components/user-profile-image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/cards/card";
import TwitterLogo from "@/../public/images/twitter-logo.svg";
import Link from "next/link";
import { formatDateMonthYear } from "@/lib/utils/general";
import { CalendarDays } from "lucide-react";
import CardBioSection from "@/components/cards/card-bio-section";
import { Button } from "@/components/ui/button";

type JobCardProps = {
  jobData: Tables<"jobs">;
};

const LEVEL_TAGS = ["Intern", "Junior", "Mid-Level", "Senior", "Staff+"];
const LOCATION_TAGS = ["Remote", "Hybrid (SF)", "In-Person (SF)"];

export default function JobCard({ jobData }: JobCardProps) {
  return (
    <Card>
      <div className="flex justify-between gap-4">
        <UserProfileImage
          className="shrink-0"
          size="large"
          src={jobData.company_logo_link || ""}
        />
        <div className="flex flex-col text-end items-end gap-4 lg:gap-8">
          <div>
            {jobData.job_title ? (
              <h2 className="text-lg font-semibold text-gray-900">
                {jobData.job_title}
              </h2>
            ) : null}

            {jobData.company_name ? (
              <p className="text-md text-gray-600">@ {jobData.company_name}</p>
            ) : null}
          </div>

          <Button
            asChild
            className="p-3 w-fit bg-solarisgreen text-solarisgreen-light hover:bg-solarisgreen/80"
          >
            <Link
              href={`https://twitter.com/${jobData.job_contact_twitter}`}
              target="_blank"
            >
              Say hello
            </Link>
          </Button>
        </div>
      </div>
      <CardBioSection
        bio={jobData.job_description || ""}
        link={jobData.company_site}
        bioPreviewSize="medium"
        title={jobData.job_title || ""}
        description={jobData.company_name ? `@ ${jobData.company_name}` : ""}
      />
      {/* Middle Section: Job Description & Tags */}
      <div className="flex flex-wrap justify-between items-start w-full overflow-hidden gap-4">
        {/* Tags for Job Levels */}
        {jobData.job_levels && (
          <div className="flex gap-2 flex-wrap max-w-full overflow-hidden">
            {jobData.job_levels.map((level) => (
              <Badge
                key={level}
                variant="outline"
                className="truncate max-w-full"
              >
                {LEVEL_TAGS[level]}
              </Badge>
            ))}
          </div>
        )}

        {/* Tags for Job Location */}
        {jobData.job_location && (
          <div className="flex gap-2 flex-wrap max-w-full overflow-hidden">
            {jobData.job_location.map((location) => (
              <Badge
                key={location}
                variant="secondary"
                className="truncate max-w-full"
              >
                {LOCATION_TAGS[location]}
              </Badge>
            ))}
          </div>
        )}
      </div>{" "}
    </Card>
  );
}

import { getJobs } from "@/lib/utils/data";
import JobCard from "@/components/cards/job-card";
export const dynamic = "force-dynamic";
import CardGrid from "@/components/cards/card-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// export const revalidate = 60 * 10;

export default async function JobsPage() {
  const jobsPayload = await getJobs();
  if (!jobsPayload.success) {
    console.error(jobsPayload.error);
    return <div>Failed to load jobs</div>;
  }

  const jobs = jobsPayload.data;

  if (!jobs) {
    return <div>No jobs yet!</div>;
  }

  return (
    <div>
      <div className=" py-8 px-4 sm:px-8 rounded-lg flex justify-center items-center">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-lg font-semibold text-solarisgreen">
            <a
              href="https://x.com/neallseth"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block overflow-hidden group"
            >
              Hiring? DM
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-solarisgreen/30 transition-all duration-300 group-hover:bg-solarisgreen"></span>
            </a>
          </h2>
          {/* <Button
            asChild
            className="mt-4 px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            <Link href="https://forms.gle/Se8eRH5WvS3TX9oj6" target="_blank">
              Want to list your role? DM @neallseth
            </Link>
          </Button> */}
        </div>
      </div>
      <div className="mt-8">
        <CardGrid>
          {jobs.map((job) => (
            <JobCard key={job.id} jobData={job}></JobCard>
          ))}
        </CardGrid>
      </div>
    </div>
  );
}

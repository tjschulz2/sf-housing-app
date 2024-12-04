import { getJobs } from "@/lib/utils/data";
import JobCard from "@/components/cards/job-card";
export const dynamic = "force-dynamic";
import CardGrid from "@/components/cards/card-grid";

export default async function JobsPage() {
  const jobsPayload = await getJobs();
  console.log(jobsPayload);
  if (!jobsPayload.success) {
    console.error(jobsPayload.error);
    return <div>Failed to load jobs</div>;
  }

  const jobs = jobsPayload.data;

  if (!jobs) {
    return <div>No jobs yet!</div>;
  }

  return (
    <CardGrid>
      {jobs.map((job) => (
        <JobCard key={job.id} jobData={job}></JobCard>
      ))}
    </CardGrid>
  );
}

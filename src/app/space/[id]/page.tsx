import { getSpaceDetails } from "@/lib/utils/data";

export default async function Page({ params }: { params: { id: string } }) {
  const spaceDetails = await getSpaceDetails(Number(params.id));
  if (!spaceDetails) {
    return <p>{spaceDetails}</p>;
  }
  return <div>{JSON.stringify(spaceDetails)}</div>;
}

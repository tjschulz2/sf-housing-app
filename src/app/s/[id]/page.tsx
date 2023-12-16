import { getSpaceDetails } from "@/lib/utils/data";
import UserProfileImage from "@/components/user-profile-image";

export default async function Page({ params }: { params: { id: string } }) {
  const spaceDetails = await getSpaceDetails(Number(params.id));
  if (!spaceDetails) {
    return <p>{spaceDetails}</p>;
  }
  return (
    <div className="border-solid border-2 border-neutral-500 rounded-2xl p-8">
      {spaceDetails.image_url ? (
        <img className="rounded-full w-24" src={spaceDetails.image_url} />
      ) : null}
      <h1>{spaceDetails.name}</h1>
      <h3>{spaceDetails.description}</h3>
    </div>
  );
}

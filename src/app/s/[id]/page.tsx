import { getSpaceDetails, getUserData } from "@/lib/utils/data";
import UserProfileImage from "@/components/user-profile-image";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const spaceDetails = await getSpaceDetails(params.id);
  const userDetails = await getUserData(spaceDetails?.user_id);
  if (!spaceDetails) {
    return <p>{spaceDetails}</p>;
  }
  return (
    <div className=" p-8">
      {spaceDetails.image_url ? (
        <img className="rounded-xl w-72" src={spaceDetails.image_url} />
      ) : null}
      <h1 className="text-2xl font-bold">{spaceDetails.name}</h1>
      {userDetails?.twitter_avatar_url ? (
        <img
          className="w-32 rounded-xl"
          src={userDetails?.twitter_avatar_url}
        />
      ) : null}
      <p>{userDetails?.name}</p>
      <p>{userDetails?.twitter_handle}</p>
      <h3>{spaceDetails.description}</h3>
    </div>
  );
}

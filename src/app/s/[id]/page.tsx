export const dynamic = "force-dynamic";

import { getSpaceDetails, getUserData } from "@/lib/utils/data";
import UserProfileImage from "@/components/user-profile-image";
import { Suspense } from "react";
import Link from "next/link";
import TwitterLogo from "@/images/twitter-logo.svg";

export default async function Page({ params }: { params: { id: string } }) {
  const spaceDetails = await getSpaceDetails(params.id);
  const userDetails = await getUserData(spaceDetails?.user_id);
  if (!spaceDetails || !userDetails) {
    return <p>404</p>;
  }
  return (
    <div className="p-6 flex flex-col gap-8">
      <h1 className="text-2xl md:text-3xl font-bold">{spaceDetails.name}</h1>

      {spaceDetails.image_url ? (
        <img className="rounded-xl w-full" src={spaceDetails.image_url} />
      ) : null}
      <div className="flex">
        {userDetails?.twitter_avatar_url ? (
          <img
            className="w-32 rounded-xl"
            src={userDetails?.twitter_avatar_url}
          />
        ) : null}
        <div className="flex flex-col">
          <p className="text-xl font-semibold">{userDetails?.name}</p>
          <div className="w-fit ">
            <Link
              href={`https://x.com/${userDetails?.twitter_handle}`}
              className="flex items-center justify-center w-full"
              target="_blank"
            >
              <span className="text-blue-500 hover:text-blue-400 max-w-full truncate">
                @{userDetails?.twitter_handle}
              </span>
              <TwitterLogo className="ml-1 overflow-visible" fill="#3191e7" />
            </Link>
          </div>
        </div>
      </div>

      <h3>{spaceDetails.description}</h3>
    </div>
  );
}

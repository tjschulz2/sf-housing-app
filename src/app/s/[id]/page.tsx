export const dynamic = "force-dynamic";

import { getSpaceDetails, getUserData } from "@/lib/utils/data";
import UserProfileImage from "@/components/user-profile-image";
import { Suspense } from "react";
import Link from "next/link";
import TwitterLogo from "@/images/twitter-logo.svg";
import { housingMap } from "@/lib/configMaps";
import { ExternalLink, Mail } from "lucide-react";
import ContactMeButton from "@/components/contact-me-button";
import CardBioSection from "@/components/cards/card-bio-section";
import { CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Page({ params }: { params: { id: string } }) {
  const spaceDetails = await getSpaceDetails(params.id);
  const userDetails = await getUserData(spaceDetails?.user_id);
  if (!spaceDetails || !userDetails) {
    return <p>404</p>;
  }
  return (
    <div className="p-6 flex flex-col lg:flex-row gap-8 lg:items-start">
      {spaceDetails.image_url ? (
        <img
          className="rounded-xl w-full lg:max-w-md h-auto lg:sticky lg:top-6"
          src={spaceDetails.image_url}
        />
      ) : null}
      <div className="flex flex-col gap-8 grow">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-center">
          {spaceDetails.name}
        </h1>

        <div className="flex justify-evenly">
          {spaceDetails.location ? (
            <div className="flex gap-1 items-center">
              <img src="/location.svg" />
              <p id="location">{housingMap.location[spaceDetails.location]}</p>
            </div>
          ) : null}

          <div className="flex gap-1 items-center">
            <img src="/threepeople.svg" />
            <p>{spaceDetails.resident_count}</p>
          </div>

          {/* {spaceDetails.room_price_range ? (
            <p>
              {housingMap.roomPrice[spaceDetails.room_price_range]}
            </p>
          ) : null} */}
        </div>

        <div className="bg-neutral-200 p-4 rounded-xl flex flex-col gap-2 whitespace-pre-line">
          <p>{spaceDetails.description}</p>
          {spaceDetails.website_url ? (
            <a className="text-blue-400" href={spaceDetails.website_url}>
              {spaceDetails.website_url}
            </a>
          ) : null}
        </div>

        {/* <ContactMeButton
          phoneNum={spaceDetails.contact_phone}
          email={spaceDetails.contact_email}
          twitter={userDetails.twitter_handle}
        /> */}
        <div className="flex" id="host-section">
          <img
            className="w-32 h-32 rounded-xl"
            src={userDetails?.twitter_avatar_url || ""}
          />
          <div className="flex flex-col justify-center gap-2 items-center grow">
            <p className="text-xl font-semibold">{userDetails?.name}</p>
            <div>
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
            {spaceDetails.contact_email ? (
              <Link
                target="_blank"
                href={`mailto:${spaceDetails.contact_email}`}
              >
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
              </Link>
            ) : null}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

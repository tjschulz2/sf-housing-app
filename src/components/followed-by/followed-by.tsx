"use client";
import { useEffect, useState } from "react";
import { getFollowIntersectionWithCaching } from "../../lib/utils/data";
import styles from "./followed-by.module.css";
import { getUserSession } from "../../lib/utils/auth";

export function FollowedBy({
  profile,
}: {
  profile: HousingSearchProfile | OrganizerProfile | CommunityProfile;
}) {
  const [followIntersection, setFollowIntersection] = useState<number | null>();

  useEffect(() => {
    async function fetchIntersection() {
      try {
        const session = await getUserSession();
        const { user_id: userID2 } = profile;
        if (!session?.userID || !userID2) {
          throw "Failed to retrieve userID";
        }
        const { userID: userID1 } = session;
        const res = await getFollowIntersectionWithCaching(userID1, userID2);
        if (res?.status === "success") {
          setFollowIntersection(res.intersectionCount);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchIntersection();
  }, []);

  return (
    <sub className={styles.followedBy980} id="followed-by">
      {typeof followIntersection === "number"
        ? `Followed by ${followIntersection} people you follow`
        : "Loading followers..."}
    </sub>
  );
}

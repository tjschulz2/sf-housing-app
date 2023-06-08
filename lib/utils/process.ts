import { getCurrentUser } from "./auth";
import { createUser, getUserData } from "./data";

export async function handleSignIn() {
  // Process handles the full sign-in process for: existing users, new users, unadmitted users
  console.log("handle sign-in process");

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw "failed to find logged-in user";
    }

    let userData = await getUserData();
    // check if record exists for user in public.users, if not:
    // -- check referral code in localstorage (store this on initial page load), if exists, look up and "claim" + createUser()

    if (!userData) {
      // If userData undefined, user does not have an entry in public.users
      userData = await createUser({
        user_id: currentUser.userID,
        email: currentUser.twitterEmail,
        twitter_id: currentUser.twitterID,
        name: currentUser.twitterName,
        twitter_avatar_url: currentUser.twitterAvatarURL,
      });
    }

    await refreshTwitterFollowsIfNeeded(userData, 168, currentUser.accessToken);
  } catch (err) {
    console.error(err);
  }

  // display loading animation?
  // check if record exists for user in public.users, if not:
  // -- check referral code in localstorage (store this on initial page load), if exists, look up and "claim"
  // -- create user using signed in session data
  // -- pull follow/follower data from twitter, store in Redis
  // redirect user to /directory
  // on /directory load, for any visible users without intersection counts, compute and push to public.follow_intersections
}

async function refreshTwitterFollowsIfNeeded(
  userData: Database["public"]["Tables"]["users"]["Row"],
  minCacheHours: number,
  accessToken: string
) {
  if (userData.follows_last_refresh) {
    const lastRefresh = new Date(Date.parse(userData.follows_last_refresh));
    const now = new Date();
    const msSinceRefresh = now.getTime() - lastRefresh.getTime();
    const hoursSinceRefresh = msSinceRefresh / (1000 * 60 * 60);
    if (hoursSinceRefresh < minCacheHours) {
      // if insufficient time has elapsed since last refresh, return (do nothing)
      return;
    }
  }
  // if 'follows_last_refresh' is falsy (null), follow data has never been stored
  await fetch("/api/refresh-twitter-follows", {
    headers: {
      accessToken,
    },
  });
}

export async function handleSignOut() {
  console.log("trigger signout process");
}

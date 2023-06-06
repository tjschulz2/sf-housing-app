import { getCurrentUser } from "./auth";
import { createUser } from "./data";

export async function handleSignIn() {
  console.log("handle signin process");

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.error("failed to find logged-in user");
      return;
    }

    await createUser({
      user_id: currentUser.userID,
      email: currentUser.twitterEmail,
      twitter_id: currentUser.twitterID,
      name: currentUser.twitterName,
      twitter_avatar_url: currentUser.twitterAvatarURL,
    });
  } catch (err) {
    console.error(err);
  }

  // display loading animation?
  // check if record exists for user in public.users, if not:
  // -- create record using signed in session data
  // -- pull follow/follower data from twitter, store in Redis
  // redirect user to /directory
  // on /directory load, for any visible users without intersection counts, compute and push to public.follow_intersections
}

export async function handleSignOut() {
  console.log("trigger signout process");
}

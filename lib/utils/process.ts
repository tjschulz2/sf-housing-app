import { getCurrentUser, signout } from "./auth";
import { createUser } from "./data";
import { supabase } from "../supabaseClient";

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

export const getSessionData = async () => {
  const session = await getCurrentUser();
  console.log(session)
  if (session && session.twitterID) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('twitter_id', session.twitterID);

      if (userError) {
        console.error('Error fetching user data:', userError.message);
        return false;
      }

      if (userData && userData.length > 0) {
        // Existing user, redirect to the directory page
        await handleSignIn()
        return true;
        //router.push('/directory');
      } else {
        // New user, prompt to request an invitation
        // or show a message indicating they need an invitation
        signout()
        alert('You need to be referred');
        console.log('User needs an invitation');
        return false;
        // Display appropriate UI here
      }
  }
  return false;
};

import { supabase } from "../supabaseClient";

export async function getUserSession() {
  // Returns most pertinent data from active session
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error);
    throw error;
  } else if (data?.session?.user?.user_metadata) {
    const { user_metadata: meta } = data.session.user;

    const sessionData = {
      accessToken: data.session.access_token,
      userID: data.session.user.id,
      twitterAvatarURL: meta.avatar_url,
      twitterEmail: meta.email,
      twitterName: meta.full_name,
      twitterHandle: meta.preferred_username,
      twitterID: meta.provider_id,
    };
    return sessionData;
  }
}

export async function isValidUser() {
  // Confirms using session-provided ID whether user is valid (exists in public.users)
  const user = await getUserSession();
  if (!user) {
    return false;
  }

  const { userID } = user;
  const { data, error } = await supabase
    .from("users")
    .select("user_id")
    .eq("user_id", userID)
    .limit(1);

  if (data?.length) {
    return true;
  } else {
    console.error(error);
    return false;
  }
}

export async function updateUserContactEmail(
  newContactEmail: string
): Promise<void> {
  const session = await getUserSession();
  // If there's no session or user data, throw an error
  if (!session || !session.userID) {
    throw new Error("User is not authenticated");
  }
  const userID = session.userID;

  // Update the user's contact email
  const { error } = await supabase
    .from("users") // Select the 'users' table
    .update({ contact_email: newContactEmail }) // Update the 'contact_email' column
    .eq("user_id", userID); // Where the 'id' equals the user's ID

  if (error) {
    console.log("Error updating user contact email: ", error);
    throw new Error(error.message);
  }
}

export async function signout() {
  const { error } = await supabase.auth.signOut();
}

export async function signInWithTwitter() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitter",
  });
  if (error) {
    return { status: "error", message: "failed to authenticate user" };
  }
}

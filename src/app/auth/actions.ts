"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getIsFullUser() {
  const supabase = await createClient(); // Initialize Supabase client

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) {
    console.error("Error fetching session:", userError);
    return false;
  }

  const { data, error } = await supabase
    .from("users")
    .select("user_id") // Selecting only the primary key for efficiency
    .eq("user_id", userId)
    .limit(1) // Limit to one record since we only need to check existence
    .single(); // Fetch a single record

  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for no rows found
    console.error("Error querying users table:", error);
    return false;
  }

  return !!data; // Returns true if data exists, false otherwise
}

export async function getAuthUserRecord() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) {
    console.error("Error fetching user:", userError);
    return null;
  }
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data;
}

export async function signInWithTwitterAction(formData: FormData) {
  const referralCode = formData.get("referralCode") as string | null;
  const origin = (await headers()).get("origin");
  if (!origin) {
    console.error("Failed to sign in, no origin found");
    return;
  }

  let redirectTo = `${origin}/auth/callback`;
  if (referralCode) {
    redirectTo += `?referral-code=${referralCode}`;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitter",
    options: {
      redirectTo,
    },
  });

  if (!error) {
    return redirect(data.url);
  }
}

export async function handleSignIn(referralCode: string | null) {
  // Handle post-authentication flow
  const supabase = await createClient();
  // const userSession = (await supabase.auth.getSession()).data.session;
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No Twitter-authenticated user found");
    // TODO: display error message to user
    return;
  }
  let initialSignIn = false;

  try {
    // Checking if user exists in 'public.users' + gathering data
    let userData = await getAuthUserRecord();

    if (userData) {
      // User already exists in users table

      // if avatar, username, or handle have changed since last sign-in, update accordingly

      const twitterImageUrl = user.user_metadata.avatar_url;
      let higherResImageUrl = twitterImageUrl?.replace("_normal", "_400x400");

      if (
        userData.twitter_avatar_url !== higherResImageUrl ||
        userData.name !== user.user_metadata.full_name ||
        userData.twitter_handle !== user.user_metadata.preferred_username
      ) {
        const { error } = await supabase
          .from("users")
          .update({
            twitter_avatar_url: higherResImageUrl,
            name: user.user_metadata.full_name,
            twitter_handle: user.user_metadata.preferred_username,
          })
          .eq("user_id", user.id);

        if (error) {
          console.error(error);
        }
      }
      return { success: "true", message: null };
    }

    if (!userData && !referralCode) {
      // New user attempting to sign in without a referral code - display message to user
      // TODO: display error message to user
    }

    if (!userData && referralCode) {
      // This block only executes for new users (i.e. no public.users record exists)

      const referral = await getReferralDetails(referralCode);
      if (referral.status !== "unclaimed") {
        // TODO: display message to user: `This referral is ${referral.status}`

        console.error("This referral is");
        return {
          success: "false",
          message: `This referral is ${referral.status}`,
        };
      }

      const claimResult = await claimReferral(referralCode);
      if (claimResult?.status !== "success") {
        console.error("Failed to claim referral");
        return { success: "false", message: "failed to claim referral" };
        // TODO: display failed to claim referral message to user
      }

      // const twitterImageUrl = currentUser.twitterAvatarURL;
      const twitterImageUrl = user.user_metadata.avatar_url;
      let higherResImageUrl = twitterImageUrl?.replace("_normal", "_400x400");
      // At this point, we have successfully claimed a referral for a user. Add them to 'public.users'
      userData = await createUser({
        user_id: user.id,
        email: user.email,
        twitter_id: user.user_metadata.provider_id,
        name: user.user_metadata.full_name,
        twitter_avatar_url: higherResImageUrl,
        twitter_handle: user.user_metadata.preferred_username,
      });

      if (!userData) {
        throw "Failed to create new user";
      }

      // TODO: add metadata 'is_full_user'
      const { data, error } = await supabase.auth.updateUser({
        data: { ...user.user_metadata, is_full_user: true },
      });

      if (error) {
        console.error(error);
        throw "failed to update user metadata";
      }

      initialSignIn = true;
    }
  } catch (err) {
    return { success: false, message: err };
  }

  return {
    success: true,
    message: initialSignIn ? "initial sign in" : null,
  };
}

export async function claimReferral(referralID: string) {
  // Fetch the current referral record
  const supabase = await createClient();

  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) {
    console.error("No Twitter-authenticated user found");
    return;
  }

  const { data: referralData, error: referralError } = await supabase
    .from("referrals")
    .select("usage_count, usage_limit")
    .eq("referral_id", Number(referralID));

  // If there was an error fetching the referral record, return an error message
  if (referralError || !referralData || referralData.length === 0) {
    return {
      status: "error",
      message: "failed to claim referral: invalid referral code",
    };
  }

  const referral = referralData[0];

  // Check if the usage_count is less than the usage_limit
  if ((referral.usage_count ?? 0) < (referral.usage_limit ?? 0)) {
    // If it is less than usage_limit, then add 1 to the current usage count
    const { data, error: updateError } = await supabase
      .from("referrals")
      .update({ usage_count: (referral.usage_count ?? 0) + 1 })
      .eq("referral_id", Number(referralID))
      .select("*");

    // If there was an error updating the referral record or no rows were affected, return an error message
    if (updateError || !data || data.length === 0) {
      return { status: "error", message: "Failed to claim referral" };
    }

    // Add row to referral_recipients table
    const { data: insertData, error: insertError } = await supabase
      .from("referral_recipients")
      .insert([{ referral_id: Number(referralID), recipient_id: userId }])
      .select("*");

    // If there was an error inserting the record, log it and return an error message
    if (insertError) {
      console.error("Insert error:", insertError);
      return { status: "error", message: "failed to record the claim" };
    }

    // If no rows were affected, return an error message
    if (!insertData || insertData.length === 0) {
      return {
        status: "error",
        message: "failed to record the claim - no rows affected",
      };
    }

    return { status: "success" };
  } else {
    // If usage_count is === to usage_limit, then return status: error and message" failed to claim referral
    return {
      status: "error",
      message: "failed to claim referral: referral limit reached",
    };
  }
}

export async function getReferralDetails(referralCode: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("referrals")
    .select(
      `
  *,
  originator:originator_id(name)`
    )
    .eq("referral_id", referralCode)
    .maybeSingle();

  let status;

  if (!data) {
    status = "invalid";
  } else if (
    data.usage_count &&
    data.usage_limit &&
    data.usage_count >= data.usage_limit
  ) {
    status = "claimed";
  } else {
    status = "unclaimed";
  }

  return {
    referralCreatedAt: data?.created_at,
    originatorID: data?.originator_id,
    referralID: data?.referral_id,
    originatorName: data?.originator.name,
    status,
  };
}

export async function createUser(
  newUser: Database["public"]["Tables"]["users"]["Insert"]
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .upsert(newUser, { onConflict: "user_id" })
    .select();

  if (error) {
    console.error(error);
    throw "error";
  } else {
    console.log(data);
    return data[0];
  }
}

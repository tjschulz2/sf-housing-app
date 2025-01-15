"use server";
import { createClient } from "@/utils/supabase/server";
import { getAuthUserRecord, getIsFullUser } from "@/app/auth/actions";

export async function genReferralLink() {
  const referralBaseLink = "https://directorysf.com/?referralCode=";
  const supabase = await createClient();

  // const user = await getAuthUserRecord();
  // if (!user) {
  //   console.error("No user found");
  //   return;
  // }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found");
    return;
  }

  let newLink = "";

  // const { data, error } = await supabase
  //   .from("users")
  //   .select("*")
  //   .eq("user_id", userId);

  // if (error || !data?.length) {
  //   console.error("Error fetching user:", error);
  //   return;
  // }

  // const user = data[0];
  const referralCode = Math.floor(Math.random() * 1000000000000000);
  newLink = `${referralBaseLink}${referralCode}`;
  const { error: insertError } = await supabase.from("referrals").insert([
    {
      referral_id: referralCode,
      originator_id: user.id,
      usage_limit: 1,
      usage_count: 0,
    },
  ]);

  if (insertError) throw insertError;

  return newLink;
}

export async function getUserHousingSearchProfile() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;
  if (!userId) {
    console.error("No user ID found");
    return;
  }
  const { data, error } = await supabase
    .from("housing_search_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

export async function getHousingSearchProfiles(
  startIdx: number = 0,
  count: number = 25,
  filters: SearcherProfilesFilterType = {}
) {
  const { leaseLength, housemateCount, movingTime } = filters;
  const supabase = await createClient();
  // const { data: userData, error: userError } = await supabase.auth.getUser();
  // if (userError) {
  //   console.error(userError);
  //   return;
  // }
  let query = supabase
    .from("housing_search_profiles")
    .select(
      `
      *, user:users(name, twitter_handle, twitter_avatar_url)
    `
    )
    .range(startIdx, startIdx + count - 1)
    .order("last_updated_date", { ascending: false });

  if (leaseLength && leaseLength !== "any") {
    query = query.eq("pref_housing_type", leaseLength);
  }
  if (housemateCount && housemateCount !== "any") {
    query = query.eq("pref_housemate_count", housemateCount);
  }
  if (movingTime && movingTime !== "any") {
    query = query.eq("pref_move_in", movingTime);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

export async function getUserSpaceListing() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error(userError);
    return;
  }
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

export async function getCommunities(start: number = 0, count: number = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communities")
    .select(
      `
      *, user:users(name, twitter_handle, twitter_avatar_url, user_id, created_at)
    `
    )
    .order("last_updated_date", { ascending: false })
    .range(start, start + count - 1);

  if (error) {
    console.error(error);
  } else {
    return data;
  }
}

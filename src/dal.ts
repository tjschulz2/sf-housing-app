"use server";
import { createClient } from "@/utils/supabase/server";

export async function genReferralLink() {
  const referralBaseLink = "https://directorysf.com/?referralCode=";

  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;
  if (!userId) {
    console.error("No user ID found");
    return;
  }

  let newLink = "";

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);

  if (error || !data?.length) {
    console.error("Error fetching user:", error);
    return;
  }

  const user = data[0];
  const referralCode = Math.floor(Math.random() * 1000000000000000);
  newLink = `${referralBaseLink}${referralCode}`;
  const { error: insertError } = await supabase.from("referrals").insert([
    {
      referral_id: referralCode,
      originator_id: userId,
      usage_limit: 1,
      usage_count: 0,
    },
  ]);

  if (insertError) throw insertError;

  return newLink;
}

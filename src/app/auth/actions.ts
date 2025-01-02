"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithTwitterAction(formData: FormData) {
  const referralCode = formData.get("referralCode") as string | null;

  const origin = (await headers()).get("origin");
  if (!origin) {
    console.error("Failed to sign in, no origin found");
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

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { handleSignIn } from "../actions";
import { error } from "console";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  const referralCode = requestUrl.searchParams.get("referral-code");
  const errorDescription = requestUrl.searchParams.get("error_description");
  if (errorDescription) {
    if (errorDescription.includes("User is banned")) {
      return NextResponse.redirect("/");
    } else {
      return NextResponse.redirect(`/auth/error`);
    }
  }

  console.log({ referralCode });

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    if (data.session) {
      // if valid session, confirm presence in users table. if not, initialize as new user with 'referralCode' (update referrals tables + users table)
      // (middleware will confirm users table presence during each route)
      const signInResult = await handleSignIn(referralCode);
      console.log({ signInResult });
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  return NextResponse.redirect(`${origin}`);
}

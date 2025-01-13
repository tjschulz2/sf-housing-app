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
      console.log("CALLBACK IDENTIFIED BANNED USER");
      return NextResponse.redirect(`${origin}#`);
    } else {
      return NextResponse.redirect(`${origin}/auth/error?code=1`);
    }
  }

  console.log({ referralCode });

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    if (data.session) {
      const signInResult = await handleSignIn(referralCode);
      console.log({ signInResult });
      if (!signInResult.success) {
        if (signInResult?.message === "no-referral") {
          return NextResponse.redirect(`${origin}/auth/referral-required`);
        } else {
          return NextResponse.redirect(`${origin}/auth/error?code=2`);
        }
      }
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  return NextResponse.redirect(`${origin}`);
}

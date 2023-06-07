"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import HomePageComponent from "../../components/home-page-component";
import { supabase } from "../../lib/supabaseClient";
import { getCurrentUser } from "../../lib/utils/auth";
import { handleSignIn, handleSignOut } from "../../lib/utils/process";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function testPullTwitterData() {
  const user = await getCurrentUser();
  return await fetch("/api/store-twitter-follows", {
    method: "POST",
    body: user?.accessToken,
  });
}

const Home: NextPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`Auth event: ${event}`);

    if (event === "SIGNED_IN" && !authenticated) {
      setAuthenticated(true);
      console.log("SIGNIN REGISTERED");
      // await handleSignIn();
      // router.replace("/directory");
    }
    if (event === "SIGNED_OUT") {
      handleSignOut();
    }
  });

  const referralCode = useSearchParams().get("referralCode");
  const normalizedReferralCode = Array.isArray(referralCode)
    ? referralCode[0]
    : referralCode;

  return (
    <div className={styles.home}>
      <button onClick={testPullTwitterData}>test pull twitter data</button>
      <button onClick={getCurrentUser}>getCurrentUser</button>
      <HomePageComponent referralCode={normalizedReferralCode} />
    </div>
  );
};

export default Home;

"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import HomePageComponent from "../../components/home-page-component";
import { supabase } from "../../lib/supabaseClient";
import { getCurrentUser } from "../../lib/utils/auth";
import { handleSignIn, handleSignOut } from "../../lib/utils/process";
import { useRouter } from "next/navigation";

const Home: NextPage = () => {
  const router = useRouter();

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN") {
      console.log("Auth event: signed in");
      await handleSignIn();
      router.push("/directory");
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
      <HomePageComponent referralCode={normalizedReferralCode} />
    </div>
  );
};

export default Home;

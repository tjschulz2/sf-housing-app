"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useState } from 'react';
import { useSearchParams } from "next/navigation";
import HomePageComponent from "../../components/home-page-component";
import { supabase } from "../../lib/supabaseClient";
import { getCurrentUser, signInWithTwitter as signInWithTwitterAuth, signUpWithTwitter as signUpWithTwitterAuth } from "../../lib/utils/auth";
import { getSessionData, handleSignIn, handleSignOut } from "../../lib/utils/process";
import { useRouter } from "next/navigation";

const Home: NextPage = () => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  const signInWithTwitter = async () => {
    setIsSignUp(false);
    await signInWithTwitterAuth();
  };

  const signUpWithTwitter = async () => {
    setIsSignUp(true);
    await signUpWithTwitterAuth();
  };

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN") {
      console.log("Auth event: signed in");
      if (isSignUp) {
        await handleSignIn();
        router.push("/directory");
      } else {
        const signInSuccessful = await getSessionData();
        if (signInSuccessful) {
          router.push("/directory");
        }
      }
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
      <HomePageComponent 
        referralCode={normalizedReferralCode} 
        signInWithTwitter={signInWithTwitter}
        signUpWithTwitter={signUpWithTwitter}
      />
    </div>
  );
};

export default Home;

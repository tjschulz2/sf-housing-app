"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import HomePageComponent from "../../components/home-page-component";
import { supabase } from "../../lib/supabaseClient";
import { getCurrentUser, signInWithTwitter as signInWithTwitterAuth, signUpWithTwitter as signUpWithTwitterAuth } from "../../lib/utils/auth";
import { getSessionData, handleSignIn, handleSignOut } from "../../lib/utils/process";
import { useRouter } from "next/navigation";

const Home: NextPage = () => {
  const router = useRouter();

  const signInWithTwitter = async () => {
    await signInWithTwitterAuth();
  };

  const signUpWithTwitter = async () => {
    localStorage.setItem("isSignUp", "true");
    await signUpWithTwitterAuth();
  };

  useEffect(() => {
    const checkUser = async () => {
      const isSignUp = localStorage.getItem("isSignUp") === "true";
        if (isSignUp) {
          await handleSignIn();
          router.push("/directory");
        } else {
          const signInSuccessful = await getSessionData();
          if (signInSuccessful) {
            router.push("/directory");
          }
        }
        // Clear localStorage after authentication is complete
        localStorage.removeItem("isSignUp");
    };
    checkUser();
  }, []);

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

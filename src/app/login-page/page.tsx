"use client";
import styles from "./page.module.css";
import { NextPage } from "next";
import { supabase } from '../../../lib/supabaseClient'

const LoginPage: NextPage = () => {
    async function signInWithTwitter() {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'twitter',
        })
    }
    
    async function signout() {
        const { error } = await supabase.auth.signOut()
    }

  return (
    <div className={styles.home}>
      <button onClick={signInWithTwitter}>Sign in with Twitter</button>
    </div>
  );
};

export default LoginPage;

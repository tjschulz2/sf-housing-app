"use client";
import { getUserSession } from "@/lib/utils/auth";
import { getUserData } from "@/lib/utils/data";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type UserDataType = Database["public"]["Tables"]["users"]["Row"];
type UserSessionType = {
  accessToken: string;
  userID: string;
  twitterAvatarURL: any;
  twitterEmail: any;
  twitterName: any;
  twitterHandle: any;
  twitterID: any;
};
type AuthContextType = {
  authLoading: boolean;
  userData: UserDataType | null;
  userSession: UserSessionType | null;
  dataReady: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CLIENT as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [userSession, setUserSession] = useState<UserSessionType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  async function initializeUser() {
    const session = await getUserSession();
    if (session) {
      setUserSession(session);
      const userData = await getUserData(session.userID);
      if (userData) {
        setUserData(userData);
        console.log(`User session initialized for ${session.twitterHandle}`);
        console.log("userid", session.userID);

        // Check if the user's data exists in the `twitter_followers_added` table
        const { data, error } = await supabase
          .from('twitter_followers_added')
          .select('created_at')
          .eq('user_id', session.userID)
          .maybeSingle();

        if (error) {
          console.error('Error checking data status in Supabase:', error);
          throw new Error('Failed to check data status');
        }

        if (!data) {
          console.log("No existing data found in Supabase. Pulling new data.");
          const response = await fetch("/api/store-follow-redis", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              twitterID: session.twitterID,
              uuid: session.userID,
            }),
          });

          if (!response.ok) {
            console.error("Failed to pull data from Twitter API");
            throw new Error("Failed to pull data from Twitter API");
          }

          console.log("Data successfully pulled and stored in Supabase.");
        } else {
          console.log(
            "User data already exists in Supabase. No need to pull new data."
          );
        }
        setDataReady(true);
      }
    }
    setAuthLoading(false);
  }

  useEffect(() => {
    initializeUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userData, userSession, authLoading, dataReady }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth context must be consumed within its provider");
  }
  return context;
}

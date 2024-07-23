"use client";
import { getUserSession } from "@/lib/utils/auth";
import { getUserData, checkTwitterFollowersAdded } from "@/lib/utils/data";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { usePostHog } from "posthog-js/react";

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
};

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [userSession, setUserSession] = useState<UserSessionType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const posthog = usePostHog();

  async function initializeUser() {
    const session = await getUserSession();
    if (session) {
      setUserSession(session);
      const userData = await getUserData(session.userID);
      if (userData) {
        setUserData(userData);

        posthog?.identify(session.userID, {
          name: session.twitterName,
          handle: session.twitterHandle,
          email: session.twitterEmail,
        });

        // Check if the user is new or needs a refresh
        const twitterFollowersAdded = await checkTwitterFollowersAdded(
          session.userID
        );
        const needsRefresh = twitterFollowersAdded
          ? (new Date().getTime() -
              new Date(twitterFollowersAdded.updated_at).getTime()) /
              (1000 * 60 * 60 * 24) >
            30
          : true;

        if (needsRefresh) {
          // Make the request without awaiting it
          axios
            .post("/api/store-follow-redis", {
              twitterID: session.twitterID,
              uuid: session.userID,
            })
            .then(() => {
              console.log("Twitter followers data refreshed successfully");
            })
            .catch((error) => {
              console.error("Error refreshing Twitter followers data:", error);
            });
        }
      }
    }
    setAuthLoading(false);
  }

  useEffect(() => {
    initializeUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, userSession, authLoading }}>
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

"use client";
import { getUserSession } from "@/lib/utils/auth";
import { getUserData } from "@/lib/utils/data";
import { createContext, useContext, useEffect, useState } from "react";

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

        // Check if the user's data exists in Redis
        const checkResponse = await fetch('/api/check-user-in-redis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuid: session.userID }),
        });

        const checkResult = await checkResponse.json();

        // If data does not exist, call the API to store followers/following in Redis
        if (checkResponse.ok && checkResult.message.includes("No data found")) {
          console.log("No existing data found in Redis. Pulling new data.");
          await fetch('/api/store-follow-redis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ twitterID: session.twitterID, uuid: session.userID }),
          });
          console.log("Data successfully pulled and stored in Redis.");
        } else {
          console.log("User data already exists in Redis. No need to pull new data.");
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
    <AuthContext.Provider value={{ userData, userSession, authLoading, dataReady }}>
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

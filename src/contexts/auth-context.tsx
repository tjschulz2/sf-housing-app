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

  async function initializeUser() {
    const session = await getUserSession();
    if (session) {
      setUserSession(session);
      const userData = await getUserData(session.userID);
      if (userData) {
        setUserData(userData);
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

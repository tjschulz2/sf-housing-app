"use client";

import { getUserSpaceListing } from "@/lib/utils/data";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";

type SpaceListingType = Database["public"]["Tables"]["communities"]["Row"];
type SpacesContextType = {
  userSpaceListing: SpaceListingType | null;
  pullUserSpaceListing: (userID: string) => Promise<void>;
};

const SpacesContext = createContext<SpacesContextType | null>(null);

export default function SpacesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userSpaceListing, setUserSpaceListing] =
    useState<SpaceListingType | null>(null);

  const { authLoading, userData } = useAuthContext();

  async function pullUserSpaceListing(userID: string) {
    const spaceListing = await getUserSpaceListing(userID);
    if (spaceListing) {
      setUserSpaceListing(spaceListing);
    }
  }

  useEffect(() => {
    if (!authLoading && userData) {
      pullUserSpaceListing(userData.user_id);
    }
  }, [authLoading, userData]);

  return (
    <SpacesContext.Provider value={{ userSpaceListing, pullUserSpaceListing }}>
      {children}
    </SpacesContext.Provider>
  );
}

export function useSpacesContext() {
  const context = useContext(SpacesContext);
  if (!context) {
    throw new Error("Spaces context must be consumed within its provider");
  }
  return context;
}

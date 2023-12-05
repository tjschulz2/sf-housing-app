"use client";

import { getCommunities, getUserSpaceListing } from "@/lib/utils/data";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthContext } from "@/contexts/auth-context";

type SpacesContextType = {
  userSpaceListing: SpaceListingType | null;
  pullUserSpaceListing: (userID: string) => Promise<void>;
  spaceListings: SpaceListingWithUserData[] | null;
  pullSpaceListings: () => Promise<void>;
};

const SpacesContext = createContext<SpacesContextType | null>(null);

export default function SpacesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userSpaceListing, setUserSpaceListing] =
    useState<SpaceListingType | null>(null);
  const [spaceListings, setSpaceListings] = useState<
    SpaceListingWithUserData[] | null
  >(null);

  const { authLoading, userData } = useAuthContext();

  const pullUserSpaceListing = useCallback(
    async (userID: string) => {
      const spaceListing = await getUserSpaceListing(userID);
      setUserSpaceListing(spaceListing || null);
    },
    [setUserSpaceListing]
  );

  const pullSpaceListings = useCallback(async () => {
    const spaces = await getCommunities();
    if (spaces) {
      setSpaceListings(spaces);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && userData) {
      pullUserSpaceListing(userData.user_id);
    }
  }, [authLoading, pullUserSpaceListing, userData]);

  return (
    <SpacesContext.Provider
      value={{
        userSpaceListing,
        pullUserSpaceListing,
        spaceListings,
        pullSpaceListings,
      }}
    >
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

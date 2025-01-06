"use client";

// import { getCommunities } from "@/lib/utils/data";
import { getCommunities } from "@/dal";
import { getUserSpaceListing } from "@/dal";
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
  spaceListings: SpaceListingWithUserData[] | [];
  refreshSpaceListings: () => Promise<void>;
  pullNextSpaceListingBatch: () => Promise<void>;
  allSpaceListingsRetrieved: Boolean;
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
    SpaceListingWithUserData[] | []
  >([]);
  const [allSpaceListingsRetrieved, setAllSpaceListingsRetrieved] =
    useState(false);

  const { authLoading, userData } = useAuthContext();

  const pullUserSpaceListing = useCallback(async () => {
    const spaceListing = await getUserSpaceListing();
    setUserSpaceListing(spaceListing || null);
  }, [setUserSpaceListing]);

  const refreshSpaceListings = useCallback(async () => {
    const spaces = await getCommunities();
    if (spaces) {
      setSpaceListings(spaces);
    }
  }, []);

  const pullNextSpaceListingBatch = useCallback(
    async (batchSize: number = 10) => {
      const spaces = await getCommunities(spaceListings.length, batchSize);
      if (!spaces?.length) return;
      else {
        setSpaceListings((prevSpaces) => [...prevSpaces, ...spaces]);
        if (spaces.length < batchSize) {
          setAllSpaceListingsRetrieved(true);
        }
      }
    },
    [spaceListings.length]
  );

  useEffect(() => {
    if (!authLoading && userData) {
      pullUserSpaceListing();
    }
  }, [authLoading, pullUserSpaceListing, userData]);

  return (
    <SpacesContext.Provider
      value={{
        userSpaceListing,
        pullUserSpaceListing,
        spaceListings,
        refreshSpaceListings,
        pullNextSpaceListingBatch,
        allSpaceListingsRetrieved,
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

import { createContext, useEffect, useState } from "react";

type SpacesContextType = {};
type SpaceListingType = Database["public"]["Tables"]["communities"]["Row"];
const SpacesContext = createContext<SpacesContextType | null>(null);

export default function SpacesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userSpaceListing, setUserSpaceListing] =
    useState<SpaceListingType | null>(null);

  function pullUserSpaceListing() {}

  useEffect(() => {
    pullUserSpaceListing();
  }, []);

  //   function pullSpacesData() {}

  return (
    <SpacesContext.Provider value={userSpaceListing}>
      {children}
    </SpacesContext.Provider>
  );
}

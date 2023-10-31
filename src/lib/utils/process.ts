import { getUserSession, signout } from "./auth";
import {
  createUser,
  getUserData,
  getReferralDetails,
  claimReferral,
} from "./data";
import { getCurrentTimestamp } from "./general";
import { supabase } from "../supabaseClient";

export async function handleSignIn() {
  // Process handles the full sign-in process for: existing users, new users, unadmitted users

  let initialSignIn = false;

  try {
    const currentUser = await getUserSession();
    if (!currentUser) {
      // User doesn't have an active session, meaning they haven't authenticated with Twitter yet
      console.log("No session found");
      return;
    }

    // Checking if user exists in 'public.users' + gathering data
    let userData = await getUserData(currentUser.userID);

    if (!userData) {
      // This block only executes for new users (i.e. no public.users record exists)
      const referralID = localStorage.getItem("referral-code");
      if (!referralID) {
        // New user attempting to sign in without a referral code
        throw "Referral required";
      }

      const referral = await getReferralDetails(referralID);
      if (referral.status !== "unclaimed") {
        throw `This referral is ${referral.status}`;
      }

      const claimResult = await claimReferral(referralID, currentUser.userID);
      if (claimResult.status !== "success") {
        throw "Failed to claim referral";
      }

      const twitterImageUrl = currentUser.twitterAvatarURL;
      let higherResImageUrl = twitterImageUrl.replace("_normal", "_400x400");
      // At this point, we have successfully claimed a referral for a user. Add them to 'public.users'
      userData = await createUser({
        user_id: currentUser.userID,
        email: currentUser.twitterEmail,
        twitter_id: currentUser.twitterID,
        name: currentUser.twitterName,
        twitter_avatar_url: higherResImageUrl,
        twitter_handle: currentUser.twitterHandle,
      });
      if (!userData) {
        throw "Failed to create new user";
      }

      initialSignIn = true;
    } else {
      // if avatar or username has changed, since last sign-in, update accordingly

      let highResCurrentUserImageUrl = currentUser.twitterAvatarURL.replace(
        "_normal",
        "_400x400"
      );
      if (
        userData.twitter_avatar_url !== highResCurrentUserImageUrl ||
        userData.name !== currentUser.twitterName
      ) {
        const { error } = await supabase
          .from("users")
          .update({
            twitter_avatar_url: highResCurrentUserImageUrl,
            name: currentUser.twitterName,
          })
          .eq("user_id", currentUser.userID);

        if (error) {
          console.error(error);
        }
      }
    }

    // await refreshTwitterFollowsIfNeeded(
    //   userData,
    //   24 * 30,
    //   currentUser.accessToken
    // );
  } catch (err) {
    return { status: "error", message: err };
  }

  return {
    status: "success",
    message: initialSignIn ? "initial sign in" : null,
  };
}

async function refreshTwitterFollowsIfNeeded(
  userData: Database["public"]["Tables"]["users"]["Row"],
  minCacheHours: number,
  accessToken: string
) {
  if (userData.follows_last_refresh) {
    const lastRefresh = new Date(Date.parse(userData.follows_last_refresh));
    const now = new Date();
    const msSinceRefresh = now.getTime() - lastRefresh.getTime();
    const hoursSinceRefresh = Math.floor(msSinceRefresh / (1000 * 60 * 60));

    if (hoursSinceRefresh < minCacheHours) {
      // If insufficient time has elapsed since last refresh, return (do nothing)
      console.log(
        `skipping refresh -  ${hoursSinceRefresh}/${minCacheHours} hours elapsed`
      );
      return;
    }
  }
  // If 'follows_last_refresh' is falsy (null), follow data has never been stored. If hoursSinceRefresh >= minCacheHours, due for refresh
  const refreshResponse = await fetch("/api/refresh-twitter-follows", {
    headers: {
      accessToken,
    },
  });

  console.log("Refresh API response: ", refreshResponse);

  if (refreshResponse.status === 200) {
    console.log("refreshed twitter follows");

    // Update timestamp of last follow data refresh
    const { error: timestampRefreshError } = await supabase
      .from("users")
      .update({ follows_last_refresh: getCurrentTimestamp() })
      .eq("user_id", userData.user_id);

    if (timestampRefreshError) {
      console.error("Failed to update follow refresh timestamp");
    }

    // Delete any cached intersection data where user is user1 or user2
    const { error: cacheDeletionError } = await supabase
      .from("follow_intersections")
      .delete()
      .or(`user_1_id.eq.${userData.user_id},user_2_id.eq.${userData.user_id}`);

    if (cacheDeletionError) {
      console.error("Failed to delete cached intersection where user is user1");
    }
  } else {
    const responseBody = await refreshResponse.json();
    console.error(`Failed to refresh Twitter follows: ${responseBody.message}`);
  }
}

export async function handleSignOut() {
  console.log("trigger signout process");
}

export const getSessionData = async () => {
  const session = await getUserSession();
  console.log(session);
  if (session && session.twitterID) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("twitter_id", session.twitterID);

    if (userError) {
      console.error("Error fetching user data:", userError.message);
      return false;
    }

    if (userData && userData.length > 0) {
      // Existing user, redirect to the directory page
      await handleSignIn();
      return true;
      //router.push('/directory');
    } else {
      // New user, prompt to request an invitation
      // or show a message indicating they need an invitation
      signout();
      alert("You need to be referred");
      console.log("User needs an invitation");
      return false;
      // Display appropriate UI here
    }
  }
  return false;
};

export const addHousingData = async (
  description: string,
  housingType: string,
  moveIn: string,
  housemates: string,
  link: string,
  contactMethod: string,
  userID: string,
  twitterHandle: string | null,
  phone: string
) => {
  // Translate options into numbers
  const housingTypeOptions = ["lease", "short"];
  const moveInOptions = ["ASAP", "3months", "over3months"];
  const housematesOptions = ["1-2", "3-5", "6-12", "12+"];
  const contactMethodOptions = ["phone", "email", "twitter"];

  const housingTypeNum = housingTypeOptions.indexOf(housingType) + 1;
  const moveInNum = moveInOptions.indexOf(moveIn) + 1;
  const housematesNum = housematesOptions.indexOf(housemates) + 1;
  const contactMethodNum = contactMethodOptions.indexOf(contactMethod) + 1;

  // Get the actual contact method
  let actualContactMethod;
  if (contactMethodNum === 1) {
    actualContactMethod = phone;
  } else if (contactMethodNum === 3) {
    actualContactMethod = `https://twitter.com/${twitterHandle}`;
  } else {
    // Fetch email from Supabase
    let { data, error } = await supabase
      .from("users")
      .select("contact_email")
      .eq("user_id", userID);

    if (error) {
      throw new Error(`Failed to fetch email: ${error.message}`);
    }

    actualContactMethod = `${data?.[0]?.contact_email}`;
  }

  console.log({ actualContactMethod });
  // Generate a random 10-digit ID
  const profileId = Math.floor(Math.random() * 9000000000) + 1000000000;

  // Insert data into the database
  const { error: insertError } = await supabase
    .from("housing_search_profiles")
    .insert([
      {
        profile_id: profileId,
        pref_housemate_details: description,
        pref_housing_type: housingTypeNum,
        link: link,
        pref_move_in: moveInNum,
        pref_housemate_count: housematesNum,
        pref_contact_method: actualContactMethod,
        user_id: userID,
      },
    ]);

  if (insertError) {
    throw new Error(`Failed to insert data: ${insertError.message}`);
  }

  return true;
};

export const getDataFromDirectory = async (userID: string) => {
  const getOrganizerData = async () => {
    let { data, error } = await supabase
      .from("organizer_profiles")
      .select("*")
      .eq("user_id", userID);

    if (error) {
      console.error(error);
      throw error;
    } else if (data && data.length > 0) {
      return {
        link: data[0].link,
        prefContactMethod: data[0].pref_contact_method,
        prefHouseDetails: data[0].pref_house_details,
        prefHousemateCount: data[0].pref_housemate_count,
        prefHousingType: data[0].pref_housing_type,
        prefLeaseStart: data[0].pref_lease_start,
        directoryType: "organizer_profiles",
      };
    }
    return null;
  };

  const getHousingSearchData = async () => {
    let { data, error } = await supabase
      .from("housing_search_profiles")
      .select("*")
      .eq("user_id", userID);

    if (error) {
      console.error(error);
      throw error;
    } else if (data && data.length > 0) {
      return {
        link: data[0].link,
        prefContactMethod: data[0].pref_contact_method,
        prefHousemateDetails: data[0].pref_housemate_details,
        prefHousemateCount: data[0].pref_housemate_count,
        prefHousingType: data[0].pref_housing_type,
        prefMoveIn: data[0].pref_move_in,
        directoryType: "housing_search_profiles",
      };
    }
    return null;
  };

  const getCommunitiesData = async () => {
    let { data, error } = await supabase
      .from("communities")
      .select("*")
      .eq("user_id", userID);

    if (error) {
      console.error(error);
      throw error;
    } else if (data && data.length > 0) {
      return {
        websiteUrl: data[0].website_url,
        description: data[0].description,
        houseName: data[0].name,
        contactMethod: data[0].pref_contact_method,
        residentCount: data[0].resident_count,
        roomPriceRange: data[0].room_price_range,
        imageUrl: data[0].image_url,
        directoryType: "communities",
        location: data[0].location,
      };
    }
    return null;
  };

  const directoryTypeFunctions = [
    getOrganizerData,
    getHousingSearchData,
    getCommunitiesData,
  ];

  for (let func of directoryTypeFunctions) {
    let result = await func();
    if (result !== null) {
      return result;
    }
  }

  // If none of the functions returned data, return null or some default value
  return null;
};

export const addOrganizerData = async (
  description: string,
  housingType: string,
  moveIn: string,
  housemates: string,
  link: string,
  contactMethod: string,
  userID: string,
  twitterHandle: string | null,
  phone: string
) => {
  // Translate options into numbers
  const housingTypeOptions = ["lease", "short"];
  const moveInOptions = ["ASAP", "3months", "over3months"];
  const housematesOptions = ["1-2", "3-5", "6-12", "12+"];
  const contactMethodOptions = ["phone", "email", "twitter"];

  const housingTypeNum = housingTypeOptions.indexOf(housingType) + 1;
  const moveInNum = moveInOptions.indexOf(moveIn) + 1;
  const housematesNum = housematesOptions.indexOf(housemates) + 1;
  const contactMethodNum = contactMethodOptions.indexOf(contactMethod) + 1;

  // Get the actual contact method
  let actualContactMethod;
  if (contactMethodNum === 1) {
    actualContactMethod = phone;
  } else if (contactMethodNum === 3) {
    actualContactMethod = `https://twitter.com/${twitterHandle}`;
  } else {
    // Fetch email from Supabase
    let { data, error } = await supabase
      .from("users")
      .select("contact_email")
      .eq("user_id", userID);

    if (error) {
      throw new Error(`Failed to fetch email: ${error.message}`);
    }

    actualContactMethod = data?.[0]?.contact_email;
  }

  // Generate a random 10-digit ID
  const profileId = Math.floor(Math.random() * 9000000000) + 1000000000;

  // Insert data into the database
  const { error: insertError } = await supabase
    .from("organizer_profiles")
    .insert([
      {
        profile_id: profileId,
        pref_house_details: description,
        pref_housing_type: housingTypeNum,
        link: link,
        pref_lease_start: moveInNum,
        pref_housemate_count: housematesNum,
        pref_contact_method: actualContactMethod,
        user_id: userID,
      },
    ]);

  if (insertError) {
    throw new Error(`Failed to insert data: ${insertError.message}`);
  }

  return true;
};

export const addCommunityData = async (
  communityName: string,
  description: string,
  roomPrice: string,
  housemates: string,
  link: string,
  imageLink: string,
  contactMethod: string,
  userID: string | undefined,
  twitterHandle: string | null,
  phone: string,
  location: string
) => {
  // Translate options into numbers
  const roomPriceOptions = [
    "less1000",
    "1000to1500",
    "1500to2000",
    "2000to2500",
    "2500to3000",
    "3000plus",
  ];
  const housematesOptions = ["1-2", "3-5", "6-12", "12+"];
  const contactMethodOptions = ["phone", "email", "twitter", "website"];
  const locationOptions = [
    "San Francisco",
    "Berkeley",
    "Oakland",
    "Hillsborough",
  ];

  const roomPriceNum = roomPriceOptions.indexOf(roomPrice) + 1;
  const housematesNum = housematesOptions.indexOf(housemates) + 1;
  const locationNum = locationOptions.indexOf(location) + 1;
  const contactMethodNum = contactMethodOptions.indexOf(contactMethod) + 1;

  // Get the actual contact method
  let actualContactMethod;
  if (contactMethodNum === 1) {
    actualContactMethod = phone;
  } else if (contactMethodNum === 3) {
    actualContactMethod = `https://twitter.com/${twitterHandle}`;
  } else if (contactMethodNum === 4) {
    actualContactMethod = link;
  } else {
    // Fetch email from Supabase
    let { data, error } = await supabase
      .from("users")
      .select("contact_email")
      .eq("user_id", userID);

    if (error) {
      throw new Error(`Failed to fetch email: ${error.message}`);
    }

    actualContactMethod = data?.[0]?.contact_email;
  }

  // Generate a random 10-digit ID
  const profileId = Math.floor(Math.random() * 9000000000) + 1000000000;

  // Insert data into the database
  const { error: insertError } = await supabase.from("communities").insert([
    {
      profile_id: profileId,
      name: communityName,
      description: description,
      room_price_range: roomPriceNum,
      resident_count: housematesNum,
      website_url: link,
      image_url: imageLink,
      pref_contact_method: actualContactMethod,
      user_id: userID,
      location: locationNum,
    },
  ]);

  if (insertError) {
    throw new Error(`Failed to insert data: ${insertError.message}`);
  }

  return true;
};

export const uploadImageLink = async (selectedImage: File, userID: string) => {
  // Upload an image
  const { error: uploadError } = await supabase.storage
    .from("community_profile_pictures")
    .upload(`community-pic-${userID}.png`, selectedImage, { upsert: true });

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    return Error();
  } else {
    console.log("File uploaded successfully");
  }
};

export const getImageLink = async (userID: string): Promise<string | Error> => {
  const { data, error } = await supabase.storage
    .from("community_profile_pictures")
    .list();

  if (error) {
    console.error("Error listing images:", error);
    return "Error";
  }

  const userImage = data.find((file) =>
    file.name.startsWith(`community-pic-${userID}`)
  );

  if (userImage) {
    const response = supabase.storage
      .from("community_profile_pictures")
      .getPublicUrl(userImage.name);

    if (response.data && response.data.publicUrl) {
      const cacheImage = `${response.data.publicUrl}?timestamp=${Date.now()}`;
      return cacheImage;
    } else {
      console.error("Public URL is not available");
      return Error();
    }
  }

  console.error("User image not found");
  return Error();
};

export const isInDirectoryAlready = async (
  userID: string
): Promise<boolean> => {
  const { data: communityData, error: communityError } = await supabase
    .from("communities")
    .select("user_id")
    .eq("user_id", userID)
    .limit(1);

  if (communityError) {
    console.error("Error querying communities:", communityError);
  }
  if (communityData && communityData.length > 0) {
    return true;
  }

  const { data: organizerProfilesData, error: organizerProfilesError } =
    await supabase
      .from("organizer_profiles")
      .select("user_id")
      .eq("user_id", userID)
      .limit(1);

  if (organizerProfilesError) {
    console.error("Error querying organizer_profiles:", organizerProfilesError);
  }
  if (organizerProfilesData && organizerProfilesData.length > 0) {
    return true;
  }

  const { data: housingSearchProfilesData, error: housingSearchProfilesError } =
    await supabase
      .from("housing_search_profiles")
      .select("user_id")
      .eq("user_id", userID)
      .limit(1);

  if (housingSearchProfilesError) {
    console.error(
      "Error querying housing_search_profiles:",
      housingSearchProfilesError
    );
  }
  if (housingSearchProfilesData && housingSearchProfilesData.length > 0) {
    return true;
  }

  return false;
};

export const deleteDataFromDirectory = async (userID: string) => {
  try {
    // Delete from communities table
    const { error: deleteCommunityError } = await supabase
      .from("communities")
      .delete()
      .eq("user_id", userID);

    if (deleteCommunityError) throw deleteCommunityError;

    // Delete from organizer_profiles table
    const { error: deleteOrganizerProfileError } = await supabase
      .from("organizer_profiles")
      .delete()
      .eq("user_id", userID);

    if (deleteOrganizerProfileError) throw deleteOrganizerProfileError;

    // Delete from housing_search_profiles table
    const { error: deleteHousingSearchProfileError } = await supabase
      .from("housing_search_profiles")
      .delete()
      .eq("user_id", userID);

    if (deleteHousingSearchProfileError) throw deleteHousingSearchProfileError;

    // Delete profile picture from community_profile_pictures bucket
    const { error: deleteImageError } = await supabase.storage
      .from("community_profile_pictures")
      .remove([`community-pic-${userID}.png`]);

    if (deleteImageError) throw deleteImageError;

    return true;
  } catch (error) {
    console.error("Error deleting data from directory:", error);
    return false;
  }
};

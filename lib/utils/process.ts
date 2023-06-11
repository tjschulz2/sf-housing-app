import { getCurrentUser, signout } from "./auth";
import { createUser, getUserData } from "./data";
import { getCurrentTimestamp } from "./general";
import { supabase } from "../supabaseClient";

export async function handleSignIn() {
  const signInStart = Date.now();
  // Process handles the full sign-in process for: existing users, new users, unadmitted users
  console.log("handle sign-in process");

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw "failed to find logged-in user";
    }

    let userData = await getUserData();
    // check if record exists for user in public.users, if not:
    // -- check referral code in localstorage (store this on initial page load), if exists, look up and "claim" + createUser()

    if (!userData) {
      // If userData undefined, user does not have an entry in public.users
      userData = await createUser({
        user_id: currentUser.userID,
        email: currentUser.twitterEmail,
        twitter_id: currentUser.twitterID,
        name: currentUser.twitterName,
        twitter_avatar_url: currentUser.twitterAvatarURL,
        twitter_handle: currentUser.twitterHandle,
      });
    }

    await refreshTwitterFollowsIfNeeded(
      userData,
      24 * 30,
      currentUser.accessToken
    );
  } catch (err) {
    console.error(err);
  }

  const signInComplete = Date.now();
  console.log("sign-in process took: ", signInComplete - signInStart, "ms");

  // display loading animation?
  // check if record exists for user in public.users, if not:
  // -- check referral code in localstorage (store this on initial page load), if exists, look up and "claim"
  // -- create user using signed in session data
  // -- pull follow/follower data from twitter, store in Redis
  // redirect user to /directory
  // on /directory load, for any visible users without intersection counts, compute and push to public.follow_intersections
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
    const hoursSinceRefresh = msSinceRefresh / (1000 * 60 * 60);
    if (hoursSinceRefresh < minCacheHours) {
      // If insufficient time has elapsed since last refresh, return (do nothing)
      console.log("skipping refresh");
      return;
    }
  }
  // If 'follows_last_refresh' is falsy (null), follow data has never been stored. If hoursSinceRefresh >= minCacheHours, due for refresh
  const refreshResponse = await fetch("/api/refresh-twitter-follows", {
    headers: {
      accessToken,
    },
  });

  if (refreshResponse.status === 200) {
    console.log("refreshed twitter follows");
    const { error } = await supabase
      .from("users")
      .update({ follows_last_refresh: getCurrentTimestamp() })
      .eq("user_id", userData.user_id);

    if (error) {
      throw "failed to update follow refresh timestamp";
    }
  }
}

export async function handleSignOut() {
  console.log("trigger signout process");
}

export const getSessionData = async () => {
  const session = await getCurrentUser();
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
  userID: string | undefined, 
  twitterHandle: string | null, 
  phone: string  
) => {
  // Translate options into numbers
  const housingTypeOptions = ['lease', 'short']
  const moveInOptions = ['ASAP', '3months', 'over3months']
  const housematesOptions = ['1-2', '3-5', '6-12', '12+']
  const contactMethodOptions = ['phone', 'email', 'twitter']

  const housingTypeNum = housingTypeOptions.indexOf(housingType) + 1
  const moveInNum = moveInOptions.indexOf(moveIn) + 1
  const housematesNum = housematesOptions.indexOf(housemates) + 1
  const contactMethodNum = contactMethodOptions.indexOf(contactMethod) + 1

  // Get the actual contact method
  let actualContactMethod
  if(contactMethodNum === 1) {
    actualContactMethod = phone
  } else if(contactMethodNum === 3) {
    actualContactMethod = twitterHandle
  } else {
    // Fetch email from Supabase
    let { data, error } = await supabase
      .from('users')
      .select('contact_email')
      .eq('user_id', userID)
      
    if(error) {
      throw new Error(`Failed to fetch email: ${error.message}`)
    }

    actualContactMethod = data?.[0]?.contact_email
  }

  // Generate a random 10-digit ID
  const profileId = Math.floor(Math.random() * 9000000000) + 1000000000

  // Insert data into the database
  const { error: insertError } = await supabase
    .from('housing_search_profiles')
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
    ])

  if(insertError) {
    throw new Error(`Failed to insert data: ${insertError.message}`)
  }

  return true
}

export const addOrganizerData = async (
  description: string, 
  housingType: string, 
  moveIn: string, 
  housemates: string, 
  link: string, 
  contactMethod: string, 
  userID: string | undefined, 
  twitterHandle: string | null, 
  phone: string  
) => {
  // Translate options into numbers
  const housingTypeOptions = ['lease', 'short']
  const moveInOptions = ['ASAP', '3months', 'over3months']
  const housematesOptions = ['1-2', '3-5', '6-12', '12+']
  const contactMethodOptions = ['phone', 'email', 'twitter']

  const housingTypeNum = housingTypeOptions.indexOf(housingType) + 1
  const moveInNum = moveInOptions.indexOf(moveIn) + 1
  const housematesNum = housematesOptions.indexOf(housemates) + 1
  const contactMethodNum = contactMethodOptions.indexOf(contactMethod) + 1

  // Get the actual contact method
  let actualContactMethod
  if(contactMethodNum === 1) {
    actualContactMethod = phone
  } else if(contactMethodNum === 3) {
    actualContactMethod = twitterHandle
  } else {
    // Fetch email from Supabase
    let { data, error } = await supabase
      .from('users')
      .select('contact_email')
      .eq('user_id', userID)
      
    if(error) {
      throw new Error(`Failed to fetch email: ${error.message}`)
    }

    actualContactMethod = data?.[0]?.contact_email
  }

  // Generate a random 10-digit ID
  const profileId = Math.floor(Math.random() * 9000000000) + 1000000000

  // Insert data into the database
  const { error: insertError } = await supabase
    .from('organizer_profiles')
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
    ])

  if(insertError) {
    throw new Error(`Failed to insert data: ${insertError.message}`)
  }

  return true
}

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
  phone: string  
) => {
  // Translate options into numbers
  const roomPriceOptions = ['less1000', '1000to1500', '1500to2000', '2000to2500', '2500to3000', '3000plus']
  const housematesOptions = ['1-2', '3-5', '6-12', '12+']
  const contactMethodOptions = ['phone', 'email', 'twitter', 'website']

  const roomPriceNum = roomPriceOptions.indexOf(roomPrice) + 1
  const housematesNum = housematesOptions.indexOf(housemates) + 1
  const contactMethodNum = contactMethodOptions.indexOf(contactMethod) + 1

  // Get the actual contact method
  let actualContactMethod
  if(contactMethodNum === 1) {
    actualContactMethod = phone
  } else if(contactMethodNum === 3) {
    actualContactMethod = twitterHandle
  } else if (contactMethodNum === 4) {
    actualContactMethod = link
  } else {
    // Fetch email from Supabase
    let { data, error } = await supabase
      .from('users')
      .select('contact_email')
      .eq('user_id', userID)
      
    if(error) {
      throw new Error(`Failed to fetch email: ${error.message}`)
    }

    actualContactMethod = data?.[0]?.contact_email
  }

  // Generate a random 10-digit ID
  const profileId = Math.floor(Math.random() * 9000000000) + 1000000000

  // Insert data into the database
  const { error: insertError } = await supabase
    .from('communities')
    .insert([
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
      },
    ])

  if(insertError) {
    throw new Error(`Failed to insert data: ${insertError.message}`)
  }

  return true
}

export const uploadImageLink = async (selectedImage: File, userID: string)  => {
  // Upload an image
  const { error: uploadError } = await supabase
  .storage
  .from('community_profile_pictures')
  .upload(`community-pic-${userID}.png`, selectedImage, { upsert: true })

  if (uploadError) {
  console.error('Error uploading file:', uploadError)
    return Error();
  } else {
  console.log('File uploaded successfully')
  }
}

export const getImageLink = async (userID: string): Promise<string | Error> => {
  try {
    // Get the URL of the image
    const { data } = supabase
    .storage
    .from('community_profile_pictures')
    .getPublicUrl(`community-pic-${userID}.png`)
    
    return data.publicUrl

  } catch (error) {
    console.error('Error getting URL:', error)
    return Error();
  }
}

export const isInDirectoryAlready = async (userID: string): Promise<boolean> => {
  const { data: communityData, error: communityError } = await supabase
      .from('communities')
      .select('user_id')
      .eq('user_id', userID)
      .limit(1);
  
  if (communityError) {
      console.error('Error querying communities:', communityError);
  }
  if (communityData && communityData.length > 0) {
      return true;
  }
  
  const { data: organizerProfilesData, error: organizerProfilesError } = await supabase
      .from('organizer_profiles')
      .select('user_id')
      .eq('user_id', userID)
      .limit(1);

  if (organizerProfilesError) {
      console.error('Error querying organizer_profiles:', organizerProfilesError);
  }
  if (organizerProfilesData && organizerProfilesData.length > 0) {
      return true;
  }

  const { data: housingSearchProfilesData, error: housingSearchProfilesError } = await supabase
      .from('housing_search_profiles')
      .select('user_id')
      .eq('user_id', userID)
      .limit(1);

  if (housingSearchProfilesError) {
      console.error('Error querying housing_search_profiles:', housingSearchProfilesError);
  }
  if (housingSearchProfilesData && housingSearchProfilesData.length > 0) {
      return true;
  }

  return false;
}

export const deleteDataFromDirectory = async (userID: string) => {
  try {
    // Delete from communities table
    const { error: deleteCommunityError } = await supabase
      .from('communities')
      .delete()
      .eq('user_id', userID);
    
    if (deleteCommunityError) throw deleteCommunityError;
    
    // Delete from organizer_profiles table
    const { error: deleteOrganizerProfileError } = await supabase
      .from('organizer_profiles')
      .delete()
      .eq('user_id', userID);
    
    if (deleteOrganizerProfileError) throw deleteOrganizerProfileError;
    
    // Delete from housing_search_profiles table
    const { error: deleteHousingSearchProfileError } = await supabase
      .from('housing_search_profiles')
      .delete()
      .eq('user_id', userID);
    
    if (deleteHousingSearchProfileError) throw deleteHousingSearchProfileError;

    // Delete profile picture from community_profile_pictures bucket
    const { error: deleteImageError } = await supabase
      .storage
      .from('community_profile_pictures')
      .remove([`community-pic-${userID}.png`]);

    if (deleteImageError) throw deleteImageError;
    
    return true;
  } catch (error) {
    console.error('Error deleting data from directory:', error);
    return false;
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
const API_URL = "http://localhost:3000/api/store-follow-redis";

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllUsers() {
  const { data, error } = await supabase.from('users').select('user_id, twitter_id');
  if (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
  return data;
}

async function storeFollowersAndFollowing(user: { user_id: string; twitter_id: string }) {
  const payload = {
    twitterID: user.twitter_id,
    uuid: user.user_id,
  };
  
  try {
    const response = await axios.post(API_URL, payload);
    if (response.status === 200) {
      console.log(`Successfully stored data for user: ${user.user_id}`);
    } else {
      console.log(`Failed to store data for user: ${user.user_id}. Status Code: ${response.status}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error storing data for user: ${user.user_id}. Error: ${error.message}`);
    } else {
      console.error(`Error storing data for user: ${user.user_id}. Unknown error`);
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await getAllUsers();
    
    for (const user of users) {
      if (user.twitter_id) {
        await storeFollowersAndFollowing(user);
      } else {
        console.log(`Skipping user ${user.user_id} due to missing Twitter ID`);
      }
    }

    res.status(200).json({ message: 'Data processed for all users' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in handler:', error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error('Error in handler: Unknown error');
      res.status(500).json({ error: 'Unknown error' });
    }
  }
}

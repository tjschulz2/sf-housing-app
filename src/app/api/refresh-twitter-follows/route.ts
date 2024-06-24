import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CLIENT as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const storeTwitterDataUrl = 'http://localhost:3000/api/store-twitter-data';

const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  uuid: string;
  twitter_id: string;
}

async function fetchNewUsers(): Promise<User[]> {
  console.log("Fetching new users...");
  const response = await fetch('http://localhost:3000/api/fetch-new-users');
  if (!response.ok) {
    console.error("Failed to fetch new users:", response.statusText);
    throw new Error('Failed to fetch new users');
  }

  const data: { users: User[] } = await response.json(); // Specify the expected structure
  console.log("Fetched new users:", data.users);
  return data.users;
}

async function storeTwitterData(uuid: string, twitterID: string): Promise<void> {
  console.log(`Storing Twitter data for UUID: ${uuid}, TwitterID: ${twitterID}`);
  const response = await fetch(storeTwitterDataUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uuid, twitterID }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to store Twitter data:", errorData.message);
    throw new Error(`Failed to store Twitter data: ${errorData.message}`);
  }

  console.log(`Successfully stored Twitter data for UUID: ${uuid}`);
}

export async function GET(req: Request) {
  try {
    console.log("Starting refresh-twitter-follows process...");
    const users = await fetchNewUsers();

    for (const user of users) {
      console.log(`Processing user UUID: ${user.uuid}, TwitterID: ${user.twitter_id}`);
      await storeTwitterData(user.uuid, user.twitter_id);
 

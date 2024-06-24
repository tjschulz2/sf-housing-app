import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_CLIENT!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// const supabaseUrl = process.env.SUPABASE_URL_DEV!;
// const supabaseKey = process.env.SUPABASE_ANON_KEY_DEV!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL and Key must be set in environment variables");
  }
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  export async function GET(req: NextRequest) {
    try {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
      const { data: newUsers, error: newUsersError } = await supabase
        .from('users')
        .select('user_id, twitter_id')
        .gte('created_at', oneMonthAgo);
  
      if (newUsersError) throw newUsersError;
  
      const { data: housingUsers, error: housingUsersError } = await supabase
        .from('housing_search_profiles')
        .select('user_id')
        .gte('created_at', oneMonthAgo);
  
      if (housingUsersError) throw housingUsersError;
  
      const { data: organizerUsers, error: organizerUsersError } = await supabase
        .from('organizer_profiles')
        .select('user_id')
        .gte('created_at', oneMonthAgo);
  
      if (organizerUsersError) throw organizerUsersError;
  
      const { data: communityUsers, error: communityUsersError } = await supabase
        .from('communities')
        .select('user_id')
        .gte('created_at', oneMonthAgo);
  
      if (communityUsersError) throw communityUsersError;
  
      const userIds = [
        ...newUsers.map((u) => u.user_id),
        ...housingUsers.map((u) => u.user_id),
        ...organizerUsers.map((u) => u.user_id),
        ...communityUsers.map((u) => u.user_id),
      ];
  
      const uniqueUserIds = Array.from(new Set(userIds));
  
      const { data: usersWithTwitter, error: usersWithTwitterError } = await supabase
        .from('users')
        .select('user_id, twitter_id')
        .in('user_id', uniqueUserIds);
  
      if (usersWithTwitterError) throw usersWithTwitterError;
  
      return NextResponse.json({ users: usersWithTwitter });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}
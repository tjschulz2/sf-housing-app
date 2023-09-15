import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_CLIENT,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

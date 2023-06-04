type User = {
  id: number;
  name: string;
  username: string;
};

declare namespace NodeJS {
  export interface ProcessEnv {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  }
}

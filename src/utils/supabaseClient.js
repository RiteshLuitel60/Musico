import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lnimaukxuplfyzhvqrhh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuaW1hdWt4dXBsZnl6aHZxcmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4MDM2MjQsImV4cCI6MjA0MTM3OTYyNH0.UyVH93s6aJEBy24DwVSeELG6VuOFUStC2RIsvY9C3Ew";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const retryWithBackoff = async (fn, retries = 5, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || error.status !== 429) throw error;
    await new Promise((res) => setTimeout(res, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
};

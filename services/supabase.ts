import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://chwrulahgkwrktnyqotk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNod3J1bGFoZ2t3cmt0bnlxb3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODU1OTMsImV4cCI6MjA5Mzk2MTU5M30.k_UJVrYMjyDKsm7RJ1R2P50CD7FFMgNU4Drpg66x0Bk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

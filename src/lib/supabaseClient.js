import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// During local dev without a Supabase project configured yet, this will be
// null and screens fall back to mock data instead of throwing.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

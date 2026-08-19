import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Note: We use NEXT_PUBLIC_SUPABASE_ANON_KEY as defined in the original setup
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createBrowserClient(
  supabaseUrl!,
  supabaseKey!,
);

export const createClient = () => supabase;

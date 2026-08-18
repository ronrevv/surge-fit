import { createClient } from "@supabase/supabase-js";

// Note: For SSR with cookies, you should install @supabase/ssr
// This is a basic server client for admin/service-role tasks

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

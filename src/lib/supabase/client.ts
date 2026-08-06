import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type RoleType =
  | "super_admin"
  | "chain_owner"
  | "chain_manager"
  | "branch_manager"
  | "trainer"
  | "independent_trainer"
  | "trainee";

export interface UserWorkspace {
  id: string;
  user_id: string;
  organization_id: string;
  branch_id?: string;
  role: RoleType;
  status: "active" | "invited" | "suspended" | "archived";
}

/**
 * ⚡ SurgeFit Role Assignments Hook
 *
 * - useMyRoleAssignments(userId) — fetches all role contexts for the logged-in user,
 *   joined with assigner info for the "assigned by X" banner
 * - useAssignRoleMutation() — used by managers to assign roles to users in their scope
 * - useUpsertSelfRoleAssignment() — called on login to ensure demo/seed users have a row
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/client";
import { RoleType } from "@/components/navigation/TopNavBar";

export interface RoleAssignment {
  id: string;
  user_id: string;
  role: RoleType;
  org_id: string | null;
  branch_id: string | null;
  assigned_by: string | null;
  assigned_by_role: RoleType | null;
  assigned_by_name: string | null;
  org_name: string | null;
  branch_name: string | null;
  status: "active" | "suspended" | "revoked";
  assigned_at: string;
}

// ── Fetch all active role assignments for the current user ───────────────────
export function useMyRoleAssignments(userId: string) {
  return useQuery({
    queryKey: ["role_assignments", userId],
    queryFn: async (): Promise<RoleAssignment[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("role_assignments")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("assigned_at", { ascending: true });

      if (error) {
        if (error.code === "42P01") return []; // table not yet migrated — degrade gracefully
        throw new Error(error.message);
      }
      return (data || []) as RoleAssignment[];
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
}

// ── Upsert a self-assigned role (for demo accounts / seed users) ─────────────
export function useUpsertSelfRoleAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      user_id: string;
      role: RoleType;
      org_id?: string | null;
      branch_id?: string | null;
      org_name?: string | null;
      branch_name?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("role_assignments")
        .upsert(
          {
            user_id: payload.user_id,
            role: payload.role,
            org_id: payload.org_id ?? null,
            branch_id: payload.branch_id ?? null,
            assigned_by: null,
            assigned_by_role: null,
            assigned_by_name: null,
            org_name: payload.org_name ?? null,
            branch_name: payload.branch_name ?? null,
            status: "active",
          },
          { onConflict: "user_id,role,org_id,branch_id", ignoreDuplicates: true }
        )
        .select()
        .maybeSingle();

      if (error && error.code !== "42P01") {
        // Silently degrade if table doesn't exist yet
        console.warn("role_assignments upsert:", error.message);
      }
      return data;
    },
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ["role_assignments", vars.user_id] });
    },
  });
}

// ── Assign a role to another user (manager → trainer / trainer → trainee) ────
export function useAssignRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      user_id: string;
      role: RoleType;
      org_id?: string | null;
      branch_id?: string | null;
      assigned_by: string;          // current user's UUID
      assigned_by_role: RoleType;   // current user's role
      assigned_by_name: string;     // current user's display name
      org_name?: string | null;
      branch_name?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("role_assignments")
        .upsert(
          {
            user_id: payload.user_id,
            role: payload.role,
            org_id: payload.org_id ?? null,
            branch_id: payload.branch_id ?? null,
            assigned_by: payload.assigned_by,
            assigned_by_role: payload.assigned_by_role,
            assigned_by_name: payload.assigned_by_name,
            org_name: payload.org_name ?? null,
            branch_name: payload.branch_name ?? null,
            status: "active",
          },
          { onConflict: "user_id,role,org_id,branch_id" }
        )
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as RoleAssignment;
    },
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ["role_assignments", vars.user_id] });
    },
  });
}

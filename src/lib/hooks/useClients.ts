/**
 * ⚡ SurgeFit Client Management Hooks
 * Full Supabase-backed trainer → client relationship API.
 * 
 * useMyClients        — fetch trainer's real client roster from DB
 * useLookupByEmail    — search profiles by email (to add existing users as clients)
 * useAddClientMutation — add a user to trainer's roster (trainer_clients table)
 * useRemoveClientMutation — remove a client from roster
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/client";

export interface ClientProfile {
  id: string;
  client_id: string;
  trainer_id: string;
  client_name: string;
  client_email: string;
  goal?: string;
  weight_kg?: number;
  height_cm?: number;
  notes?: string;
  created_at: string;
}

export interface ProfileLookup {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

// ── Fetch trainer's full client roster ──────────────────────────────────────
export function useMyClients(trainerId: string) {
  return useQuery({
    queryKey: ["trainer_clients", trainerId],
    queryFn: async (): Promise<ClientProfile[]> => {
      if (!trainerId) return [];
      const { data, error } = await supabase
        .from("trainer_clients")
        .select("*")
        .eq("trainer_id", trainerId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching clients:", error);
        throw new Error(error.message);
      }
      return data || [];
    },
    enabled: !!trainerId,
  });
}

// ── Look up a user profile by email ─────────────────────────────────────────
export function useLookupByEmail() {
  return useMutation({
    mutationFn: async (email: string): Promise<ProfileLookup | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("email", email.toLowerCase().trim())
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // not found
        throw new Error(error.message);
      }
      return data;
    },
  });
}

// ── Add a client to the trainer's roster ────────────────────────────────────
export function useAddClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      trainer_id: string;
      client_id: string;
      client_name: string;
      client_email: string;
      goal?: string;
      weight_kg?: number;
      height_cm?: number;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("trainer_clients")
        .insert([payload])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("This client is already on your roster.");
        }
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trainer_clients", data.trainer_id] });
    },
  });
}

// ── Remove a client from the roster ─────────────────────────────────────────
export function useRemoveClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trainerId, clientId }: { trainerId: string; clientId: string }) => {
      const { error } = await supabase
        .from("trainer_clients")
        .delete()
        .eq("trainer_id", trainerId)
        .eq("client_id", clientId);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["trainer_clients", vars.trainerId] });
    },
  });
}

// ── Invite a new trainee via email ──────────────────────────────────────────
export function useInviteTraineeMutation() {
  return useMutation({
    mutationFn: async (payload: {
      email: string;
      inviterId: string;
      orgId?: string;
      branchId?: string;
    }) => {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          role: "trainee",
          inviterId: payload.inviterId,
          orgId: payload.orgId,
          branchId: payload.branchId,
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation.");
      }
      return data;
    },
  });
}


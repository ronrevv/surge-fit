/**
 * ⚡ SurgeFit Plan Hooks
 * Full Supabase-backed plan management:
 *
 * useAssignedPlans        — trainee's assigned plans (reads from assigned_plans)
 * useTrainerAssignments   — trainer's list of all assignments they've made
 * useAssignPlanMutation   — assign a plan (workout/diet/schedule) to a trainee
 * useSaveTrainerPlanMutation — save a plan template to trainer_plans
 * useTrainerSavedPlans    — fetch trainer's saved plan templates
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/client";

export type PlanType = "workout" | "diet" | "schedule";

export interface AssignedPlan {
  id: string;
  trainer_id: string;
  trainee_id: string;
  type: PlanType;
  title: string;
  summary: string;
  content: any;
  status: "active" | "completed" | "archived";
  created_at: string;
}

export interface TrainerPlan {
  id: string;
  trainer_id: string;
  type: PlanType;
  title: string;
  summary: string;
  content: any;
  created_at: string;
}

// ── Trainee: fetch my assigned plans from DB ─────────────────────────────────
export function useAssignedPlans(traineeId: string) {
  return useQuery({
    queryKey: ["assigned_plans", traineeId],
    queryFn: async (): Promise<AssignedPlan[]> => {
      if (!traineeId) return [];
      const { data, error } = await supabase
        .from("assigned_plans")
        .select("*")
        .eq("trainee_id", traineeId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching assigned plans:", error);
        throw new Error(error.message);
      }
      return data || [];
    },
    enabled: !!traineeId,
  });
}

// ── Trainer: fetch all assignments they've made ───────────────────────────────
export function useTrainerAssignments(trainerId: string) {
  return useQuery({
    queryKey: ["trainer_assignments", trainerId],
    queryFn: async (): Promise<AssignedPlan[]> => {
      if (!trainerId) return [];
      const { data, error } = await supabase
        .from("assigned_plans")
        .select("*")
        .eq("trainer_id", trainerId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!trainerId,
  });
}

// ── Trainer: fetch saved plan templates ──────────────────────────────────────
export function useTrainerSavedPlans(trainerId: string) {
  return useQuery({
    queryKey: ["trainer_plans", trainerId],
    queryFn: async (): Promise<TrainerPlan[]> => {
      if (!trainerId) return [];
      const { data, error } = await supabase
        .from("trainer_plans")
        .select("*")
        .eq("trainer_id", trainerId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!trainerId,
  });
}

// ── Trainer: save a plan as a reusable template ──────────────────────────────
export function useSaveTrainerPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      trainer_id: string;
      type: PlanType;
      title: string;
      summary: string;
      content: any;
    }) => {
      const { data, error } = await supabase
        .from("trainer_plans")
        .insert([payload])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as TrainerPlan;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trainer_plans", data.trainer_id] });
    },
  });
}

// ── Trainer: assign a plan to a specific trainee ─────────────────────────────
export function useAssignPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      trainer_id: string;
      trainee_id: string;
      type: PlanType;
      title: string;
      summary: string;
      content: any;
      scheduled_date?: string;
    }) => {
      // Archive any existing active plan of same type for this trainee (replace)
      // Only archive if it's not a scheduled plan (which have scheduled_date)
      if (!payload.scheduled_date) {
        await supabase
          .from("assigned_plans")
          .update({ status: "archived" })
          .eq("trainer_id", payload.trainer_id)
          .eq("trainee_id", payload.trainee_id)
          .eq("type", payload.type)
          .is("scheduled_date", null)
          .eq("status", "active");
      }

      const { data, error } = await supabase
        .from("assigned_plans")
        .insert([{ ...payload, status: "active" }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as AssignedPlan;
    },
    onSuccess: (data) => {
      // Refresh trainee's plan view
      queryClient.invalidateQueries({ queryKey: ["assigned_plans", data.trainee_id] });
      // Refresh trainer's assignment history
      queryClient.invalidateQueries({ queryKey: ["trainer_assignments", data.trainer_id] });
    },
  });
}

// ── Trainer: bulk assign schedule entries ────────────────────────────────────
export function useAssignScheduleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      trainer_id: string;
      trainee_id: string;
      entries: any[];
    }) => {
      // Create records to insert
      const recordsToInsert = payload.entries.map((entry: any) => ({
        trainer_id: payload.trainer_id,
        trainee_id: payload.trainee_id,
        type: entry.type,
        title: entry.title,
        summary: `Scheduled for ${entry.dateKey}`,
        content: entry.type === "workout" ? entry.exercises : entry.meals,
        status: "active",
        scheduled_date: entry.dateKey,
      }));

      // In a real app, we might want to clean up existing schedule for these dates first
      const { data, error } = await supabase
        .from("assigned_plans")
        .insert(recordsToInsert)
        .select();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_, variables) => {
      // Refresh trainee's plan view
      queryClient.invalidateQueries({ queryKey: ["assigned_plans", variables.trainee_id] });
      // Refresh trainer's assignment history
      queryClient.invalidateQueries({ queryKey: ["trainer_assignments", variables.trainer_id] });
    },
  });
}


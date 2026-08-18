import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';

export function useAssignedPlans(traineeId: string) {
  return useQuery({
    queryKey: ['assigned_plans', traineeId],
    queryFn: async () => {
      if (!traineeId) return [];
      const { data, error } = await supabase
        .from('assigned_plans')
        .select('*')
        .eq('trainee_id', traineeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase Error fetching plans:", error);
        throw new Error(error.message);
      }
      return data || [];
    },
    enabled: !!traineeId,
  });
}

export function useTrainerAssignments(trainerId: string) {
  return useQuery({
    queryKey: ['trainer_assignments', trainerId],
    queryFn: async () => {
      if (!trainerId) return [];
      const { data, error } = await supabase
        .from('assigned_plans')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!trainerId,
  });
}

export function useAssignPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlan: {
      trainer_id: string;
      trainee_id: string;
      type: 'workout' | 'diet' | 'schedule';
      title: string;
      summary: string;
      content: any;
    }) => {
      const { data, error } = await supabase
        .from('assigned_plans')
        .insert([newPlan])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate both trainee and trainer views
      queryClient.invalidateQueries({ queryKey: ['assigned_plans', data.trainee_id] });
      queryClient.invalidateQueries({ queryKey: ['trainer_assignments', data.trainer_id] });
    },
  });
}

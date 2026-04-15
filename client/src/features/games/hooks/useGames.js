import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamesApi } from '../api/games.api';
import { toast } from 'sonner';

export const useGames = (filters) => {
  return useQuery({
    queryKey: ['admin', 'games', filters],
    queryFn: () => gamesApi.getAll(filters),
    staleTime: 30_000,
  });
};

export const useGameMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: gamesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
      toast.success('Game created successfully');
    },
    onError: (err) => toast.error('Failed to create game'),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => gamesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
      toast.success('Game updated successfully');
    },
    onError: (err) => toast.error('Failed to update game'),
  });

  const toggle = useMutation({
    mutationFn: (id) => gamesApi.toggle(id),
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['admin', 'games'] });
      const previous = queryClient.getQueryData(['admin', 'games']);
      
      queryClient.setQueryData(['admin', 'games'], (old) => {
        if (!old) return old;
        return old.map(g => g.id === id ? { ...g, is_active: !g.is_active } : g);
      });

      return { previous };
    },
    onError: (_, __, context) => {
      // Rollback
      if (context?.previous) {
        queryClient.setQueryData(['admin', 'games'], context.previous);
      }
      toast.error('Failed to toggle game status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
    },
  });

  const remove = useMutation({
    mutationFn: gamesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'games'] });
      toast.success('Game removed successfully');
    },
    onError: (err) => toast.error('Failed to eliminate game'),
  });

  return { create, update, toggle, remove };
};

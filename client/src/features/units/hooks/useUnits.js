import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unitsApi } from '../api/units.api';

export const useUnits = (filters) => {
  return useQuery({
    queryKey: ['admin', 'units', filters],
    queryFn: () => unitsApi.getAll(filters),
    staleTime: 60_000,
  });
};

export const useUnitMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: unitsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'units'] });
      toast.success('Unit created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create unit'),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => unitsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'units'] });
      toast.success('Unit updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update unit'),
  });

  const remove = useMutation({
    mutationFn: (id) => unitsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'units'] });
      toast.success('Unit deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete unit'),
  });

  const reorder = useMutation({
    mutationFn: unitsApi.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'units'] });
      toast.success('Unit order updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to reorder units'),
  });

  return { create, update, remove, reorder };
};

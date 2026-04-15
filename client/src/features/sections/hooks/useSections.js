import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sectionsApi } from '../api/sections.api';

export const useSections = (filters) => {
  return useQuery({
    queryKey: ['admin', 'sections', filters],
    queryFn: () => sectionsApi.getAll(filters),
    staleTime: 60_000,
  });
};

export const useSectionMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: sectionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sections'] });
      toast.success('Section created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create section'),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => sectionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sections'] });
      toast.success('Section updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update section'),
  });

  const remove = useMutation({
    mutationFn: (id) => sectionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sections'] });
      toast.success('Section deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete section'),
  });

  return { create, update, remove };
};

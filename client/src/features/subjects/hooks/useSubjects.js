import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsApi } from '../api/subjects.api';
import { toast } from 'sonner';

export const useSubjects = (filters) => {
  return useQuery({
    queryKey: ['admin', 'subjects', filters],
    queryFn: () => subjectsApi.getAll(filters),
    staleTime: 60_000,
  });
};

export const useSubjectMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      toast.success('Subject created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create subject'),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => subjectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] });
      toast.success('Subject updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update subject'),
  });

  return { create, update };
};

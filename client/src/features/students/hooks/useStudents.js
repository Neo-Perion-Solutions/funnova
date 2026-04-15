import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../api/students.api';
import { toast } from 'sonner';

export const useStudents = (filters) => {
  return useQuery({
    queryKey: ['admin', 'students', filters],
    queryFn: () => studentsApi.getAll(filters),
    staleTime: 30_000,
  });
};

export const useStudentProgress = (id) => {
  return useQuery({
    queryKey: ['admin', 'students', id, 'progress'],
    queryFn: () => studentsApi.getProgress(id),
    enabled: !!id,
  });
};

export const useStudentMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
      toast.success('Student created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create student'),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => studentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
      toast.success('Student updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update student'),
  });

  const remove = useMutation({
    mutationFn: studentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
      toast.success('Student removed successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to remove student'),
  });

  const resetPassword = useMutation({
    mutationFn: ({ id, password }) => studentsApi.resetPassword(id, password),
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to reset password'),
  });

  return { create, update, remove, resetPassword };
};

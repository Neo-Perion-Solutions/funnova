import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '../api/adminUsers.api';
import { toast } from 'sonner';

export const useAdminUsers = (filters) => {
  return useQuery({
    queryKey: ['admin', 'adminUsers', filters],
    queryFn: () => adminUsersApi.getAll(filters),
    staleTime: 30_000,
  });
};

export const useAdminUserMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: adminUsersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'adminUsers'] });
      toast.success('Admin created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create admin'),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => adminUsersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'adminUsers'] });
      toast.success('Admin updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update admin'),
  });

  const remove = useMutation({
    mutationFn: adminUsersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'adminUsers'] });
      toast.success('Admin removed successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to remove admin'),
  });

  return { create, update, remove };
};

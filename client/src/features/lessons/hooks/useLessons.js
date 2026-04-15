import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '../api/lessons.api';
import { toast } from 'sonner';

export const useLessons = (filters) => {
  // If id is provided, fetch single lesson
  if (filters?.id) {
    return useQuery({
      queryKey: ['admin', 'lesson', filters.id],
      queryFn: () => lessonsApi.getById(filters.id),
      staleTime: 30_000,
    });
  }

  // Otherwise fetch list with filters
  // Enabled if: filtering by unit_id OR both grade AND subject_id provided
  const isEnabled = !!(filters?.unit_id || (filters?.grade && filters?.subject_id));

  return useQuery({
    queryKey: ['admin', 'lessons', filters],
    queryFn: () => lessonsApi.getAll(filters),
    staleTime: 30_000,
    enabled: isEnabled,
  });
};

export const useLessonMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: lessonsApi.create,
    onSuccess: () => {
      // Invalidate ALL lesson queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'lessons'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'lesson'] });
      toast.success('Lesson created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create lesson'),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => lessonsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lesson'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'lessons'] });
      toast.success('Lesson updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update lesson'),
  });

  const remove = useMutation({
    mutationFn: lessonsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lesson'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'lessons'] });
      toast.info('Lesson soft-deleted. It is now hidden from students.');
    },
    onError: (err) => toast.error('Failed to remove lesson'),
  });

  const restore = useMutation({
    mutationFn: lessonsApi.restore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lesson'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'lessons'] });
      toast.success('Lesson restored successfully');
    },
    onError: (err) => toast.error('Failed to restore lesson'),
  });

  const reorder = useMutation({
    mutationFn: lessonsApi.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lesson'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'lessons'] });
      toast.success('Lesson order updated successfully');
    },
    onError: (err) => toast.error('Failed to save lesson order'),
  });

  return { create, update, remove, restore, reorder };
};

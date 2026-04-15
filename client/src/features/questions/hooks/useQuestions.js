import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '../api/questions.api';
import { toast } from 'sonner';

export const useQuestions = (lessonId) => {
  return useQuery({
    queryKey: ['admin', 'questions', lessonId],
    queryFn: () => questionsApi.getByLesson(lessonId),
    enabled: !!lessonId,
  });
};

export const useSaveQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, data }) => questionsApi.saveByLesson(lessonId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'questions', variables.lessonId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'lessons'] }); // To update ready/incomplete status
      toast.success('Atomic quiz saved successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save questions'),
  });
};

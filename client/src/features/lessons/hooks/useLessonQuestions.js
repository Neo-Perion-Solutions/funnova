import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../../../lib/axios';

// API calls for questions
const questionsApi = {
  getByLesson: (lessonId, type) =>
    api.get(`/admin/questions/${lessonId}`).then(res => res.data),
  create: (data) => api.post('/admin/questions', data).then(res => res.data),
  updateByLesson: (lessonId, data) => api.put(`/admin/questions/${lessonId}`, data).then(res => res.data),
  delete: (id) => api.delete(`/admin/questions/${id}`).then(res => res.data),
};

export const useLessonQuestions = (lessonId, type) => {
  return useQuery({
    queryKey: ['admin', 'questions', lessonId, type],
    queryFn: () => questionsApi.getByLesson(lessonId, type),
    enabled: !!lessonId && !!type,
    select: (data) => {
      // Filter questions by type client-side
      return Array.isArray(data) ? data.filter(q => q.type === type) : [];
    },
  });
};

export const useLessonQuestionMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data) => {
      // Transform form data into API format
      const options = {};
      if (data.option_a) options.A = data.option_a;
      if (data.option_b) options.B = data.option_b;
      if (data.option_c) options.C = data.option_c;
      if (data.option_d) options.D = data.option_d;

      // Wrap single question in bulk format expected by server
      return questionsApi.create({
        lesson_id: data.lesson_id,
        questions: [{
          section_id: data.section_id || 1,
          type: data.type,
          question_text: data.question_text,
          correct_answer: data.correct_answer,
          options: Object.keys(options).length > 0 ? options : null,
          question_order: data.question_order ?? 1,
        }],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'questions'] });
      toast.success('Question added successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add question'),
  });

  const update = useMutation({
    mutationFn: ({ lessonId, id, data }) => {
      // Fetch all questions, update the target one, send all back
      const questions = queryClient.getQueryData(['admin', 'questions', lessonId]);
      if (!questions) {
        return Promise.reject(new Error('Questions not loaded'));
      }

      // Transform form data into API format
      const options = {};
      if (data.option_a) options.A = data.option_a;
      if (data.option_b) options.B = data.option_b;
      if (data.option_c) options.C = data.option_c;
      if (data.option_d) options.D = data.option_d;

      const updated = questions.map(q => {
        if (q.id === id) {
          return {
            ...q,
            type: data.type || q.type,
            question_text: data.question_text || q.question_text,
            correct_answer: data.correct_answer || q.correct_answer,
            options: Object.keys(options).length > 0 ? options : q.options,
            question_order: q.question_order, // Never change question_order through edit
          };
        }
        return q;
      });

      return questionsApi.updateByLesson(lessonId, { questions: updated });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'questions'] });
      toast.success('Question updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update question'),
  });

  const remove = useMutation({
    mutationFn: (id) => questionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'questions'] });
      toast.success('Question deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete question'),
  });

  return { create, update, remove };
};

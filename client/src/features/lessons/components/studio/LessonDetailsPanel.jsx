import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import { useLessons, useLessonMutations } from '../../hooks/useLessons';

const lessonDetailsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional().default(''),
  video_url: z.string().url('Must be a valid URL').min(1, 'Video URL is required'),
});

const LessonDetailsPanel = ({ lessonId }) => {
  const { data: lesson } = useLessons({ id: lessonId });
  const { update } = useLessonMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(lessonDetailsSchema),
    defaultValues: {
      title: '',
      description: '',
      video_url: '',
    },
  });

  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title || '',
        description: lesson.description || '',
        video_url: lesson.video_url || '',
      });
    }
  }, [lesson, reset]);

  const onSubmit = async (data) => {
    await update.mutateAsync({
      id: lessonId,
      data,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Lesson Title"
          placeholder="e.g., Introduction to Fractions"
          {...register('title')}
          error={errors.title?.message}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          placeholder="Optional description of the lesson"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          rows={3}
        />
      </div>

      <Input
        label="Video URL"
        placeholder="https://www.youtube.com/embed/..."
        {...register('video_url')}
        error={errors.video_url?.message}
      />

      <div className="flex gap-2 pt-4">
        <Button type="submit" loading={isSubmitting || update.isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default LessonDetailsPanel;

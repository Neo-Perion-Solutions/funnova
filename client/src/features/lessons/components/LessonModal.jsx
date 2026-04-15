import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../../../components/shared/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Youtube, Gamepad2 } from 'lucide-react';

const lessonSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  video_url: z.string().url('Must be a valid URL'),
  has_game: z.boolean().default(false),
  game_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
}).refine(data => !data.has_game || (data.game_url && data.game_url.length > 0), {
  message: "Game URL is required when game is enabled",
  path: ["game_url"],
});

const LessonModal = ({ isOpen, onClose, onSave, lesson = null, isLoading = false }) => {
  const isEdit = !!lesson;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      description: '',
      video_url: '',
      has_game: false,
      game_url: '',
    },
  });

  const hasGame = useWatch({ control, name: 'has_game' });

  useEffect(() => {
    if (isOpen) {
      if (lesson) {
        reset({
          title: lesson.title,
          description: lesson.description || '',
          video_url: lesson.video_url || '',
          has_game: !!lesson.has_game,
          game_url: lesson.game_url || '',
        });
      } else {
        reset({
          title: '',
          description: '',
          video_url: '',
          has_game: false,
          game_url: '',
        });
      }
    }
  }, [isOpen, lesson, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Lesson Module' : 'Add New Lesson'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSave)} loading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Lesson'}
          </Button>
        </>
      }
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Lesson Title"
              placeholder="e.g. Introduction to Fractions"
              error={errors.title?.message}
              {...register('title')}
            />
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Detailed Description</label>
              <textarea
                rows={4}
                placeholder="What will the students learn in this lesson?..."
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                {...register('description')}
              />
            </div>
          </div>

          <div className="space-y-5">
            {/* Video URL */}
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-indigo-700">
                <Youtube size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Video Content</span>
              </div>
              <Input
                placeholder="YouTube URL..."
                error={errors.video_url?.message}
                {...register('video_url')}
              />
            </div>

            {/* Game Toggle & URL */}
            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-700">
                  <Gamepad2 size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Game Asset</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    {...register('has_game')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {hasGame && (
                <div className="animate-in slide-in-from-top-2 duration-200 mt-2">
                   <Input
                    placeholder="External Game URL..."
                    error={errors.game_url?.message}
                    {...register('game_url')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LessonModal;

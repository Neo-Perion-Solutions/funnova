import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../../../components/shared/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Gamepad2 } from 'lucide-react';

const gameSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  topic: z.string().min(2, 'Topic is required'),
  objective: z.string().optional(),
  unit_no: z.coerce.number().min(1, 'Unit number is required'),
  game_no: z.coerce.number().min(1, 'Game number is required'),
  game_url: z.string().url('Must be a valid URL'),
});

const GameModal = ({ isOpen, onClose, onSave, game = null, isLoading = false }) => {
  const isEdit = !!game;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      title: '',
      topic: '',
      objective: '',
      unit_no: 1,
      game_no: 1,
      game_url: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (game) {
        reset({
          title: game.title,
          topic: game.topic || '',
          objective: game.objective || '',
          unit_no: game.unit_no || 1,
          game_no: game.game_no || 1,
          game_url: game.game_url || '',
        });
      } else {
        reset({
          title: '',
          topic: '',
          objective: '',
          unit_no: 1,
          game_no: 1,
          game_url: '',
        });
      }
    }
  }, [isOpen, game, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Game Asset' : 'Add New Game'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSave)} loading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Game'}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl mb-2">
          <div className="p-2 bg-indigo-600 text-white rounded-lg">
            <Gamepad2 size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-900 leading-tight">External Game Asset</h4>
            <p className="text-[10px] text-indigo-700/70 font-medium uppercase tracking-widest">Connect HTML5 / Unity WebGL games</p>
          </div>
        </div>

        <Input
          label="Game Title"
          placeholder="e.g. Fraction Shooter"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Topic"
            placeholder="e.g. Fractions"
            error={errors.topic?.message}
            {...register('topic')}
          />
          <Input
            label="Game Type / Link"
            placeholder="https://game-link.com"
            error={errors.game_url?.message}
            {...register('game_url')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Unit Number"
            type="number"
            error={errors.unit_no?.message}
            {...register('unit_no')}
          />
          <Input
            label="Game Number"
            type="number"
            error={errors.game_no?.message}
            {...register('game_no')}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Learning Objective</label>
          <textarea
            rows={3}
            placeholder="What should the student master through this game?..."
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            {...register('objective')}
          />
        </div>
      </form>
    </Modal>
  );
};

export default GameModal;

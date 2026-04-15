import React, { useState } from 'react';
import { Plus, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import ConfirmDialog from '../../../../components/shared/ConfirmDialog';
import { useLessons } from '../../hooks/useLessons';
import { useGames, useGameMutations } from '../../../games/hooks/useGames';
import GameModal from '../../../games/components/GameModal';

const GamesPanel = ({ lessonId }) => {
  const { data: games = [], isLoading } = useGames({ lesson_id: lessonId });
  const { remove: removeGame } = useGameMutations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = async () => {
    if (deleteConfirm) {
      await removeGame.mutateAsync(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {games.map((game) => (
          <div key={game.id} className="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900">{game.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={game.game_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    View Game
                    <ExternalLink size={14} />
                  </a>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${game.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {game.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedGame(game);
                    setIsModalOpen(true);
                  }}
                >
                  <Edit2 size={16} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(game.id)}>
                  <Trash2 size={16} className="text-red-600" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={() => {
        setSelectedGame(null);
        setIsModalOpen(true);
      }} className="w-full flex items-center justify-center gap-2">
        <Plus size={16} />
        Add Game
      </Button>

      <GameModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGame(null);
        }}
        game={selectedGame}
        lessonId={lessonId}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Remove Game?"
        message="The game will be detached from this lesson."
        confirmLabel="Remove"
        isDangerous
        isLoading={removeGame.isPending}
      />
    </div>
  );
};

export default GamesPanel;

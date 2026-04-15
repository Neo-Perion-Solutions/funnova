import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import FilterBar from '../../components/shared/FilterBar';
import GameCard from './components/GameCard';
import GameModal from './components/GameModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useGames, useGameMutations } from './hooks/useGames';
import { useUIStore } from '../../store/uiStore';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import { Gamepad2 } from 'lucide-react';

const GamesPage = () => {
  const [filters, setFilters] = useState({ topic: '' });
  const { data: games, isLoading } = useGames(filters);
  const { create, update, toggle, remove } = useGameMutations();
  const { activeModal, modalData, openModal, closeModal } = useUIStore();

  const onSave = async (data) => {
    if (activeModal === 'editGame') {
      await update.mutateAsync({ id: modalData.id, data });
    } else {
      await create.mutateAsync(data);
    }
    closeModal();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Interactive Games"
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => openModal('addGame')}
          >
            Create Game
          </Button>
        }
      />

      <FilterBar
        filters={[
          {
            key: 'topic',
            label: 'Filter by Topic',
            type: 'search',
            placeholder: 'Search topic...',
          },
        ]}
        values={filters}
        onChange={(key, val) => setFilters({ [key]: val })}
        onReset={() => setFilters({ topic: '' })}
      />

      {isLoading ? (
        <Spinner className="h-64" />
      ) : !games || games.length === 0 ? (
        <EmptyState
          icon={Gamepad2}
          title="No Games Found"
          description="Build interactive learning experiences by adding your first game module."
          action={
            <Button variant="primary" icon={Plus} onClick={() => openModal('addGame')}>
              Add Game Asset
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {games.map(game => (
            <GameCard
              key={game.id}
              game={game}
              onEdit={(g) => openModal('editGame', g)}
              onToggle={(id) => toggle.mutate(id)}
              onDelete={(g) => openModal('deleteGame', g)}
            />
          ))}
        </div>
      )}

      <GameModal
        isOpen={activeModal === 'addGame' || activeModal === 'editGame'}
        onClose={closeModal}
        onSave={onSave}
        game={activeModal === 'editGame' ? modalData : null}
        isLoading={create.isPending || update.isPending}
      />

      <ConfirmDialog
        isOpen={activeModal === 'deleteGame'}
        onClose={closeModal}
        onConfirm={() => { remove.mutate(modalData.id); closeModal(); }}
        isDangerous
        title="Remove Game"
        message={`Are you sure you want to permanently delete "${modalData?.title}"? This cannot be undone.`}
        confirmLabel="Confirm Delete"
        isLoading={remove.isPending}
      />
    </div>
  );
};

export default GamesPage;

import React from 'react';
import { Gamepad2, Settings, Trash2, Power } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

const GameCard = ({ game, onEdit, onToggle, onDelete }) => {
  return (
    <div className={cn(
      "bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group transition-all duration-300",
      !game.is_active && "opacity-60 grayscale-[0.5]"
    )}>
      {/* Header / Info */}
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 transition-transform group-hover:scale-110",
            game.is_active ? "bg-indigo-600" : "bg-gray-400"
          )}>
            <Gamepad2 size={24} />
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Unit {game.unit_no} • Game {game.game_no}
            </span>
            <div className={cn(
              "mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
              game.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            )}>
              {game.is_active ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        <h4 className="text-base font-bold text-gray-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
          {game.title}
        </h4>
        <p className="text-xs text-gray-400 font-medium mb-4">Topic: {game.topic || 'General'}</p>
        
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic">
          "{game.objective || 'No objective defined.'}"
        </p>
      </div>

      {/* Footer / Actions */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1.5 min-w-0 text-gray-400 hover:text-indigo-600"
            onClick={() => onEdit(game)}
            icon={Settings}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1.5 min-w-0 text-gray-400 hover:text-red-500"
            onClick={() => onDelete(game)}
            icon={Trash2}
          />
        </div>

        <button
          onClick={() => onToggle(game.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            game.is_active 
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
              : "bg-red-50 text-red-500 hover:bg-red-100"
          )}
        >
          <Power size={12} />
          {game.is_active ? 'Online' : 'Offline'}
        </button>
      </div>
    </div>
  );
};

export default GameCard;

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';

const SidebarUnitList = ({ units, selectedUnitId, onSelectUnit }) => {
  return (
    <div className="w-full h-full bg-[#1e1b4b] rounded-3xl p-4 flex flex-col gap-3 overflow-y-auto fun-scrollbar">
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="text-3xl">🔬</div>
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">Science World</h2>
          <p className="text-white/60 text-xs">Your Learning Adventure</p>
        </div>
      </div>

      {units.map((unit, idx) => {
        const isSelected = unit.id === selectedUnitId;
        
        // Calculate progress for the unit
        const totalLessons = unit.lessons?.length || 0;
        const completedLessons = unit.lessons?.filter(l => l.is_completed).length || 0;
        const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
        // Proper lock logic: a unit is unlocked if its first lesson is unlocked
        const firstLesson = unit.lessons?.[0];
        const isLocked = firstLesson ? !firstLesson.is_unlocked : (idx > 0);

        return (
          <button
            key={unit.id}
            onClick={() => !isLocked && onSelectUnit(unit.id)}
            disabled={isLocked}
            className={`
              relative w-full text-left p-3 rounded-2xl transition-all
              ${isSelected 
                ? 'bg-[#3b9f2e] border-2 border-[#4ADE80] shadow-lg shadow-green-900/50' 
                : 'bg-[#2A276B] hover:bg-[#343085] border-2 border-transparent'}
              ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {isSelected && (
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-[#3b9f2e] border-b-8 border-b-transparent" />
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0
                  ${isSelected ? 'bg-white shadow-inner' : 'bg-[#e2e8f0] opacity-90'}
                `}>
                  {idx === 0 ? '🍃' : idx === 1 ? '❤️' : idx === 2 ? '🌍' : '⚡'}
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-green-100' : 'text-indigo-200'}`}>
                    Unit {unit.unit_order || idx + 1}
                  </p>
                  <h3 className={`font-bold text-sm leading-tight ${isSelected ? 'text-white' : 'text-white'}`}>
                    {unit.title}
                  </h3>
                </div>
              </div>
              {isLocked && <Lock className="text-white/60" size={20} />}
            </div>

            {/* Progress bar */}
            {!isLocked && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2.5 bg-black/30 rounded-full p-[2px] shadow-inner">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#4ADE80] to-white"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-white'}`}>
                  {progressPct}%
                </span>
              </div>
            )}
          </button>
        );
      })}

      <div className="mt-auto pt-4">
        <button className="w-full p-3 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center gap-3 text-sm font-bold shadow-[0_4px_0_#5B21B6] active:shadow-none active:translate-y-1 hover:brightness-110 transition-all">
          <span className="text-lg">🏆</span>
          Achievements
          <span className="ml-auto font-bold text-lg">→</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarUnitList;

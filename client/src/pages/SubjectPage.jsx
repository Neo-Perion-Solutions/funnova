import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import GameTopbar from '../components/common/GameTopbar';
import LevelPath from '../components/roadmap/LevelPath';
import MascotGuide from '../components/game/MascotGuide';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useFetch } from '../hooks/useFetch';
import { studentService } from '../services/student.service';
import { useAuth } from '../hooks/useAuth';

const subjectDecorations = {
  'Mathematics': { emoji: '🔢', bg: 'from-blue-600 to-indigo-700', decor: ['📐', '📏', '🧮', '➕', '✖️'] },
  'Science': { emoji: '🔬', bg: 'from-green-600 to-emerald-700', decor: ['🧪', '🌱', '⚗️', '🦠', '🔭'] },
  'English': { emoji: '📚', bg: 'from-purple-600 to-purple-800', decor: ['📖', '✍️', '🔤', '📝', '🎭'] },
  'History': { emoji: '📜', bg: 'from-amber-600 to-orange-700', decor: ['🏛️', '⚔️', '👑', '🗿', '🏺'] },
  'Geography': { emoji: '🌍', bg: 'from-teal-600 to-cyan-700', decor: ['🗺️', '🧭', '⛰️', '🌊', '🏔️'] },
};

const getDecoration = (name) =>
  subjectDecorations[name] || { emoji: '📖', bg: 'from-slate-600 to-slate-800', decor: ['📖', '✏️', '📝', '🎯', '💡'] };

const SubjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student } = useAuth();

  const { data: subjectResponse, loading, error } = useFetch(
    () => studentService.getSubjectUnits(id),
    [id]
  );

  const subjectData = subjectResponse?.data;
  const subjectName = subjectData?.subject?.name || 'Subject';
  const units = subjectData?.units || [];
  const decor = getDecoration(subjectName);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F0F4FF] via-[#E8EDFF] to-[#F5F0FF] fun-scrollbar">
      <GameTopbar />

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden bg-gradient-to-r ${decor.bg} px-4 py-8 sm:px-6`}
      >
        {/* Floating decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {decor.decor.map((emoji, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute text-3xl opacity-15"
              style={{
                left: `${10 + (i * 20) % 80}%`,
                top: `${10 + (i * 25) % 60}%`,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Back button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold mb-4 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Home
          </motion.button>

          {/* Title */}
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl sm:text-5xl border border-white/30 shadow-xl"
            >
              {decor.emoji}
            </motion.div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{subjectName}</h1>
              <p className="text-white/60 text-sm font-bold mt-1">
                🗺️ Your Learning Journey
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border-2 border-red-200 bg-red-50 p-8 text-center"
            >
              <span className="text-4xl mb-3 block">😿</span>
              <p className="text-red-600 font-bold">{error}</p>
            </motion.div>
          ) : (
            <LevelPath units={units} currentLessonId={student?.current_lesson_id} />
          )}
        </div>
      </main>

      {/* Mascot */}
      <MascotGuide
        message="Complete lessons in order to unlock the next one! 🔓"
      />
    </div>
  );
};

export default SubjectPage;

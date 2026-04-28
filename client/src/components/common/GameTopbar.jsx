import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useGradeContext } from '../../context/GradeContext';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User, Home } from 'lucide-react';

/**
 * GameTopbar — A fun, colorful topbar for the student game UI.
 * Features animated avatar, coins display, streak counter, and playful dropdown.
 */
const GameTopbar = ({ coins = 0, streak = 0, xp = 0, level = 1 }) => {
  const { student, logout } = useAuth();
  const { activeGrade } = useGradeContext();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const firstName = student?.name ? student.name.split(' ')[0] : 'Explorer';
  const gradeNumber = student?.grade ? String(student.grade).replace('Grade ', '') : activeGrade;

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 py-3 shadow-xl shadow-purple-500/20">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/student/dashboard" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-extrabold text-white border border-white/30 shadow-inner"
          >
            🎮
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">FUNNOVA</h1>
            <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest">Learning Adventure</p>
          </div>
        </Link>

        {/* Center Stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Grade Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20"
          >
            <span className="text-sm">📚</span>
            <span className="text-xs sm:text-sm font-bold text-white">Grade {gradeNumber}</span>
          </motion.div>

          {/* Streak */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-sm"
            >
              🔥
            </motion.span>
            <span className="text-xs sm:text-sm font-bold text-white">{streak}</span>
          </motion.div>

          {/* XP */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="hidden sm:flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20"
          >
            <span className="text-sm">⚡</span>
            <span className="text-xs sm:text-sm font-bold text-white">{xp} XP</span>
          </motion.div>
        </div>

        {/* Profile */}
        <div className="relative">
          <motion.button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full pl-1.5 pr-3 py-1.5 border border-white/20 hover:bg-white/25 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-sm font-extrabold text-white shadow-inner">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold text-white hidden sm:block">{firstName}</span>
            <ChevronDown size={14} className={`text-white/70 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg border-3 border-white mb-2">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-white font-bold text-lg">{student?.name}</h3>
                    <p className="text-white/70 text-xs font-medium">Grade {gradeNumber} • Level {level}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-0 border-b border-gray-100">
                    <div className="text-center p-3 border-r border-gray-100">
                      <p className="text-lg font-bold text-gray-800">🔥 {streak}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Streak</p>
                    </div>
                    <div className="text-center p-3 border-r border-gray-100">
                      <p className="text-lg font-bold text-gray-800">⚡ {xp}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">XP</p>
                    </div>
                    <div className="text-center p-3">
                      <p className="text-lg font-bold text-gray-800">🏅 {level}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Level</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => { navigate('/student/dashboard'); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <Home size={18} /> Dashboard
                    </button>
                    <button
                      onClick={() => { navigate('/student/profile'); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <User size={18} /> My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default GameTopbar;

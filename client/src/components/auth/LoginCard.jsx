import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const LoginCard = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!studentId || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(studentId, password);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Invalid Student ID or Password';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 w-full"
    >
      <div className="text-center mb-6">
        <div className="flex justify-center gap-2 text-2xl mb-4">
          {['⭐', '🎨', '📚', '🚀', '⭐'].map((e, i) => (
            <motion.span key={i} animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}>
              {e}
            </motion.span>
          ))}
        </div>
        <p className="text-gray-500 font-bold text-sm">Enter your student ID to start!</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 text-sm font-bold text-red-600 text-center">
          ❌ {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Student ID</label>
          <input
            type="text"
            placeholder="e.g. STU001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 text-base font-bold text-gray-800 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-300"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Password</label>
          <input
            type="password"
            placeholder="Your secret password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 text-base font-bold text-gray-800 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-300"
          />
        </div>
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl transition-shadow disabled:opacity-60 mt-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              Logging in...
            </span>
          ) : (
            "🚀 Let's Learn!"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default LoginCard;

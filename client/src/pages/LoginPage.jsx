import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import LoginCard from '../components/auth/LoginCard';

const floatingIcons = ['🎮', '📚', '🧩', '⭐', '🏆', '🎨', '🔬', '🎯', '✨', '🚀'];

const LoginPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/student/dashboard');
    }
  }, [isAuthenticated, loading, navigate, user]);

  if (loading || isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 flex items-center justify-center relative overflow-hidden">
      {/* Animated background icons */}
      {floatingIcons.map((icon, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.sin(i) * 20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 5 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.4,
          }}
          className="absolute text-4xl opacity-15 pointer-events-none"
          style={{
            left: `${(i * 11) % 90 + 5}%`,
            top: `${(i * 13) % 80 + 10}%`,
          }}
        >
          {icon}
        </motion.div>
      ))}

      {/* Background circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

      {/* Login content */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm items-center justify-center text-4xl border border-white/30 shadow-2xl mb-4"
          >
            🎮
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white">FUNNOVA</h1>
          <p className="text-white/60 font-medium mt-1">Learning is an Adventure! 🚀</p>
        </motion.div>

        <LoginCard />
      </motion.div>
    </div>
  );
};

export default LoginPage;

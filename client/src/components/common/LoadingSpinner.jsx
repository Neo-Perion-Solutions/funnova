import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading magic...' }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
    />
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="text-4xl mt-4"
    >
      ✨
    </motion.div>
    <h2 className="mt-2 text-lg font-bold text-purple-600">{message}</h2>
  </div>
);

export default LoadingSpinner;

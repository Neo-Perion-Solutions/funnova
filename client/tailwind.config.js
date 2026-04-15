/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gamified theme colors
        primary: { DEFAULT: '#1E40AF', hover: '#1E3A8A', light: '#EFF6FF' },
        success: { DEFAULT: '#10B981', light: '#ECFDF5' },
        achievement: { DEFAULT: '#F59E0B', light: '#FFFBEB' },
        celebration: { DEFAULT: '#8B5CF6', light: '#F3E8FF' },
        danger: { DEFAULT: '#EF4444', light: '#FEF2F2' },
        surface: { DEFAULT: '#FFFFFF', secondary: '#F9FAFB', tertiary: '#F3F4F6' },
        border: { DEFAULT: '#E5E7EB', strong: '#D1D5DB' },

        // Subject colors
        subject: {
          math: '#3B82F6',      // Blue
          english: '#8B5CF6',   // Purple
          science: '#10B981',   // Green
          history: '#F59E0B',   // Amber
          geography: '#14B8A6', // Teal
          art: '#EC4899',       // Pink
          sports: '#EF4444',    // Red
        },
      },
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 1s infinite',
        'shimmer': 'shimmer 2s infinite',
        'celebrate': 'celebrate 0.6s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        celebrate: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

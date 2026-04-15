/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6366F1', hover: '#4F46E5', light: '#EEF2FF' },
        success: { DEFAULT: '#10B981', light: '#ECFDF5' },
        warning: { DEFAULT: '#F59E0B', light: '#FFFBEB' },
        danger:  { DEFAULT: '#EF4444', light: '#FEF2F2' },
        surface: { DEFAULT: '#FFFFFF', secondary: '#F9FAFB', tertiary: '#F3F4F6' },
        border:  { DEFAULT: '#E5E7EB', strong: '#D1D5DB' },
      },
    },
  },
  plugins: [],
};

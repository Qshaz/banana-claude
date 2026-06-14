/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#1C5D52',
        'primary-light': '#2A7A6E',
        accent: '#C9982D',
        background: '#FAF8F4',
        surface: '#FFFFFF',
        text: '#1A1A1A',
        'text-muted': '#6B7280',
        border: '#E5E0D8',
        success: '#4A8C70',
        error: '#C0392B',
      },
      fontFamily: {
        arabic: ['serif'],
      },
    },
  },
  plugins: [],
};

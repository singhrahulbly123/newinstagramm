/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    '!./app/api/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'from-stone-950',
    'via-emerald-950',
    'to-teal-900',
    'text-emerald-600',
    'text-emerald-700',
    'text-emerald-800',
    'bg-emerald-50',
    'bg-emerald-100',
    'bg-teal-50',
    'border-emerald-200',
    'border-emerald-300',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        glow: '0 24px 80px rgba(5, 150, 105, 0.14)',
      },
      backgroundImage: {
        soft: 'radial-gradient(circle at top, rgba(6,95,70,0.16), transparent 38%), radial-gradient(circle at 80% 10%, rgba(20,184,166,0.13), transparent 30%), radial-gradient(circle at 20% 80%, rgba(5,150,105,0.1), transparent 32%)',
      },
      colors: {
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
        },
      },
    },
  },
  plugins: [],
};

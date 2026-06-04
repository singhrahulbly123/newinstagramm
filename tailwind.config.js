/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 24px 80px rgba(99, 102, 241, 0.14)',
      },
      backgroundImage: {
        soft: 'radial-gradient(circle at top, rgba(59,130,246,0.14), transparent 38%), radial-gradient(circle at 80% 10%, rgba(168,85,247,0.12), transparent 30%), radial-gradient(circle at 20% 80%, rgba(59,130,246,0.08), transparent 32%)',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'pulse-smooth': 'pulse-smooth 1.5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'spin-slow': 'spin 12s linear infinite',
        'gradient-flow-x': 'gradient-x 5s ease infinite', // 👈 Add this
      },
      keyframes: {
        'pulse-smooth': {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
          '50%': { transform: 'scale(1.5)', opacity: 0.1 },
        },
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'gradient-x': { // 👈 Add this
          '0%, 100%': {
            'background-position': '100% 0%',
          },
          '50%': {
            'background-position': '0% 0%',
          },
        },
      },
      backgroundSize: {
        '200': '200% 200%', // 👈 Add this if needed
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

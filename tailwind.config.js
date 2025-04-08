/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'pulse-smooth': 'pulse-smooth 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-smooth': {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
          '50%': { transform: 'scale(1.5)', opacity: 0.1 },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

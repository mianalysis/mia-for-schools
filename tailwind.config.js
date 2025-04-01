import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        growshrink: 'growshrink 0.5s ease-in infinite',
      },
      keyframes: {
        growshrink: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
  safelist: [{ pattern: /text-./ }, { pattern: /font-./ }, { pattern: /bg-./ }]
};

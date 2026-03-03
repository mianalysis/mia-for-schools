import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        growshrink: 'growshrink 0.5s ease-in infinite',
      },
      boxShadow: {
        'equal': '0 0 18px 4px currentColor',
      },
      keyframes: {
        growshrink: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
  safelist: [{ pattern: /text-./ }, { pattern: /font-./ }, { pattern: /bg-./ }, { pattern: /w-./ }, { pattern: /h-./ }, { pattern: /rounded-./ }, { pattern: /border/ }, { pattern: /flex/ }, { pattern: /border-./ }, { pattern: /items-./ }, { pattern: /shadow-./ }, { pattern: /transform/ }, { pattern: /rotate-./ }, { pattern: /inline-./ }],
};

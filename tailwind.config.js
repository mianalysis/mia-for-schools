import { transform } from 'typescript';

const variants = ['sm', 'md', 'lg', 'xl', '2xl', '5xl'];

const patterns = [
  /text-.*/,
  /font-.*/,
  /bg-.*/,
  /w-.*/,
  /h-.*/,
  /mr-.*/,
  /ml-.*/,
  /mt-.*/,
  /mb-.*/,
  /rounded-.*/,
  /border/,
  /flex/,
  /items-.*/,
  /shadow-.*/,
  /transform/,
  /rotate-.*/,
  /inline-.*/,
];

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        growshrink: 'growshrink 0.5s ease-in infinite',
      },
      boxShadow: {
        equal: '0 0 18px 4px currentColor',
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
  safelist: patterns.map(pattern => ({
    pattern,
    variants,
  })),
};

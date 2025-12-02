import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d0715', // Presque noir avec nuance violette
          dark: '#2d2654', // Violet très sombre (pour contraste)
        },
        accent: {
          DEFAULT: '#5fff8d', // Vert néon (ancien light)
          light: '#a7ffbd', // Vert néon très clair et doux
          coral: '#ff6b35', // Rouge corail
          orange: '#ff5722', // Orange
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config
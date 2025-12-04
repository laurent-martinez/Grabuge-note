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
          DEFAULT: '#f5f5f7', // Fond gris clair Apple
          dark: '#ffffff', // Cartes blanches
        },
        accent: {
          DEFAULT: '#4B0082', // Bleu Apple principal
          light: '#34c759', // Vert Apple
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
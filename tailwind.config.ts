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
          DEFAULT: '#1e1b4b', // indigo-950
          dark: '#0f0d29',
        },
        accent: {
          DEFAULT: '#fbbf24', // yellow-400
          light: '#fde047', // yellow-300
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

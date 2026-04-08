import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        brand: {
          light: '#f8fafc',
          DEFAULT: '#2563eb',
          navy: '#1e293b',
          dark: '#0f172a',
          blue: '#2563eb',
          orange: '#f97316',
          green: '#16a34a',
        },
      },
    },
  },
  plugins: [],
}

export default config

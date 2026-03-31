import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        navy: {
          950: '#080d1a',
          900: '#0a1020',
          800: '#0f1929',
          700: '#172035',
        },
      },
    },
  },
  plugins: [],
}

export default config

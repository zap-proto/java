import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@hanzo/ui/**/*.{js,ts,jsx,tsx}',
    './node_modules/@hanzo/docs/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        background: '#0a0a0a',
        foreground: '#fafafa',
        muted: '#a1a1aa',
        border: '#27272a',
      },
    },
  },
  plugins: [],
}

export default config

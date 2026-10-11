/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#080C14',
          card: '#0F172A',
          cardBorder: '#1E293B',
          surface: '#131D31',
          emerald: '#10B981',
          emeraldGlow: '#059669',
          violet: '#8B5CF6',
          violetGlow: '#7C3AED',
          amber: '#F59E0B',
          rose: '#F43F5E',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}

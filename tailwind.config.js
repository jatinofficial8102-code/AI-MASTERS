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
        gov: {
          navy: {
            950: '#050c18',
            900: '#0b162a',
            850: '#0f1f3d',
            800: '#142952',
            700: '#1a376d',
            600: '#24498e',
          },
          slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
          },
          blue: {
            50: '#eef6ff',
            100: '#d9ebff',
            200: '#bce0fd',
            300: '#8ecbfc',
            400: '#58aff8',
            500: '#2f90f2',
            600: '#1a73e8',
            700: '#135bc3',
            800: '#144c9e',
            900: '#16417d',
          },
          cyan: {
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
          },
          emerald: {
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
          },
          purple: {
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
          },
          amber: {
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'glow-blue': '0 0 25px -3px rgba(37, 99, 235, 0.25)',
        'glow-cyan': '0 0 25px -3px rgba(6, 182, 212, 0.25)',
        'glow-emerald': '0 0 25px -3px rgba(16, 185, 129, 0.25)',
        'gov-card': '0 4px 20px -2px rgba(11, 22, 42, 0.06)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

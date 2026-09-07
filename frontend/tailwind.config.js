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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          900: '#1e3a8a',
        },
        slate: {
          850: '#151e2e',
          950: '#0b0f19',
        },
        ai: {
          glow: '#8b5cf6',
          accent: '#7c3aed',
          badge: '#f3e8ff',
          text: '#6b21a8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
        'glass-dark': '0 4px 30px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.2)',
        'ai-glow': '0 0 25px rgba(139, 92, 246, 0.25)',
      }
    },
  },
  plugins: [],
}

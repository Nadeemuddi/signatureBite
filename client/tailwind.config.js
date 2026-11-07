/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — warm, appetite-driving tones.
        brand: {
          50: '#fff1f0',
          100: '#ffe0dd',
          200: '#ffc2bb',
          300: '#ff988a',
          400: '#ff6f5c',
          500: '#f43f2e', // primary
          600: '#e02412',
          700: '#bb1a0c',
          800: '#9a1a10',
          900: '#7f1c14',
        },
        gold: '#f5a623',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -4px rgba(0,0,0,0.12)',
        'card-hover': '0 12px 32px -8px rgba(0,0,0,0.22)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};

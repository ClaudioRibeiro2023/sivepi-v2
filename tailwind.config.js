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
        primary: {
          50: '#E6F7F9',
          100: '#B3E9EF',
          200: '#80DBE5',
          300: '#4DCDDB',
          400: '#1ABFD1',
          500: '#00A3BD',
          600: '#008DA3',
          700: '#007789',
          800: '#00616F',
          900: '#004B55',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter var', 'sans-serif'],
      },
      animation: {
        'in': 'fadeIn 0.2s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

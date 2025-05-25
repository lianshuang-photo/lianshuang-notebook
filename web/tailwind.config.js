/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'apple-blue': '#007AFF',
        'apple-link': '#007AFF',
        'apple-gray': {
          50: '#F9F9F9',
          100: '#F2F2F7',
          200: '#E5E5EA',
          300: '#D1D1D6',
          400: '#AEAEB2',
          500: '#8E8E93',
          600: '#636366', // Placeholder text, secondary icons
          700: '#4A4A4A',
          800: '#3A3A3C',
          900: '#1D1D1F',
          'text-primary': '#1D1D1F',
          'text-secondary': '#636366',
          'background-light': '#F2F2F7',
          'background-elevated': '#FFFFFF',
          'border-primary': '#D1D1D6', 
          'border-secondary': '#E5E5EA',
        },
        // 保留原来的primary配色作为备选
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', "SF Pro Text", "SF Pro Icons", "Helvetica Neue", "Helvetica", "Arial", 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem', // 12px
        '2xl': '1rem',   // 16px
        '3xl': '1.25rem', // 20px
        'apple': '10px',
      },
      boxShadow: {
        'apple-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 1px 0 rgba(0, 0, 0, 0.03)', // Softer
        'apple-md': '0 3px 8px 0 rgba(0, 0, 0, 0.06), 0 2px 4px 0 rgba(0, 0, 0, 0.04)', // Softer
        'apple-lg': '0 8px 20px 0 rgba(0, 0, 0, 0.06), 0 4px 8px 0 rgba(0, 0, 0, 0.04)', // Softer
        'apple-xl': '0 15px 30px 0 rgba(0, 0, 0, 0.07), 0 6px 12px 0 rgba(0, 0, 0, 0.05)', // Softer
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.4, 0, 0.2, 1)', // Smoother than default ease-in-out
        'modal-ease': 'cubic-bezier(0.4, 0, 0.22, 1)',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        slideInUp: 'slideInUp 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        scaleUp: 'scaleUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideInUp: { '0%': { opacity: '0', transform: 'translateY(15px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleUp: { '0%': { opacity: '0.5', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#007AFF', // 使用苹果蓝色替换绿色
          'primary-focus': '#0066CC',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#007AFF', // 使用苹果蓝色替换绿色
          'primary-focus': '#0066CC',
        },
      },
    ],
  },
} 
 
 
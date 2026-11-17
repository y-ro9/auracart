/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ice: { DEFAULT: '#EAF4FF', hover: '#D6E9FF', deep: '#BFDDFF' },
        blush: { DEFAULT: '#FFE4EF', hover: '#FFCFE3', deep: '#FFB5D3' },
        lilac: { DEFAULT: '#EDE4FF', hover: '#DFD2FF', deep: '#CDBBFF' },
        mint: { DEFAULT: '#DCFCE7', hover: '#BBF7D0', deep: '#86EFAC' },
        peach: { DEFAULT: '#FFEDD5', hover: '#FED7AA', deep: '#FDBA74' },
        ink: { DEFAULT: '#1F2937', soft: '#4B5563', muted: '#9CA3AF' },
        accent: { DEFAULT: '#7C3AED', hover: '#6D28D9', light: '#A78BFA' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 10px 30px -10px rgba(124, 58, 237, 0.25)',
        'card-pink': '0 10px 30px -10px rgba(236, 72, 153, 0.25)',
        'card-blue': '0 10px 30px -10px rgba(59, 130, 246, 0.25)',
        glow: '0 0 40px rgba(167, 139, 250, 0.4)',
      },
      backgroundImage: {
        'pastel-hero': 'linear-gradient(135deg, #FFE4EF 0%, #EDE4FF 50%, #EAF4FF 100%)',
        'pastel-banner': 'linear-gradient(90deg, #F472B6 0%, #A78BFA 50%, #60A5FA 100%)',
        'pastel-button': 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)',
        'pastel-button-hover': 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
        'pastel-soft': 'linear-gradient(135deg, #FDF2F8 0%, #F5F3FF 50%, #EFF6FF 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-25px) rotate(5deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(20px) rotate(-5deg)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
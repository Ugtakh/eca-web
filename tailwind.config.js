/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1D3A',
        'primary-dark': '#12152C',
        'primary-light': '#2D3260',
        accent: '#4F8EF7',
        'accent-dark': '#3A72D4',
        background: '#0A0B0F',
        surface: '#0F1020',
        'surface-2': '#161828',
        'surface-3': '#1C1F35',
        foreground: '#F0EDE8',
        muted: '#8B8E99',
        'muted-2': '#5A5D6A',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '20px',
        xl: '28px',
        '2xl': '32px',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'border-rotate': 'borderRotate 3s ease infinite',
        'status-pulse': 'statusPulse 2s ease-in-out infinite',
        spark: 'spark 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        borderRotate: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        spark: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      fontWeight: {
        600: '600',
        700: '700',
        800: '800',
        900: '900',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};

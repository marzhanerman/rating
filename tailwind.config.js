/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
  ],

  theme: {
    extend: {

      keyframes: {

        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },

        pulseSlow: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.25' },
        },

        gridMove: {
  '0%': { transform: 'translate(0px, 0px)' },
  '100%': { transform: 'translate(-60px, -60px)' },
},

        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
mapPulse: {
      '0%, 100%': { opacity: '0.2' },
      '50%': { opacity: '0.5' },
    },
    nodePulse: {
      '0%, 100%': { transform: 'scale(1)', opacity: '0.4' },
      '50%': { transform: 'scale(1.4)', opacity: '1' },
    },
      },

      animation: {

        fadeUp: 'fadeUp 0.8s ease-out forwards',

        pulseSlow: 'pulseSlow 6s ease-in-out infinite',

        gridMove: 'gridMove 8s linear infinite',

        float: 'float 6s ease-in-out infinite',

         mapPulse: 'mapPulse 6s ease-in-out infinite',
    nodePulse: 'nodePulse 4s ease-in-out infinite',

      },

    },
  },

  plugins: [],
}
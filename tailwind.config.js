/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'base': '#0D1117', // Near-black background
        'panel': 'rgba(22, 27, 34, 0.7)', // Panel color for glassmorphism
        'primary': '#2F81F7', // A nice, modern blue (used for the button)
        'glow': 'rgba(47, 129, 247, 0.3)', // **Slightly more subtle glow**
        'sky-400': '#38bdf8', // Tailwind's sky-400, often used for accents
        'sky-500': '#0ea5e9', // Tailwind's sky-500
        'gray-200': '#E6EDF3', // Light text for readability
        'gray-300': '#C0C7D0', // Slightly dimmer text
        'gray-400': '#8B949E', // Even dimmer for descriptions
      },
      keyframes: { // <-- ADD THIS SECTION
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: { // <-- AND THIS SECTION
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },

    },
  },
  plugins: [],
}
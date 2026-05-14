/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "0.2" },
          "20%": { opacity: "1" },
        },
      },
      animation: {
        blink: "blink 1.4s infinite both",
      },
    },
  },
  plugins: [],
};

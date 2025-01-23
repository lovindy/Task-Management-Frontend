/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        text: "#000000",
      },
      backgroundColor: {
        "global-gradient": "linear-gradient(to bottom right, #f0f9ff, #cbdbf4)",
      },
    },
  },
  plugins: [],
};

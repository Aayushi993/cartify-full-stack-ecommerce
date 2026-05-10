/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2874f0",
        secondary: "#f1f3f6",
        dark: "#212121",
        lightText: "#878787",
      },
      boxShadow: {
        card: "0 6px 18px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

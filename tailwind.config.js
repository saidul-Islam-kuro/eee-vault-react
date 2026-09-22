/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        vault: {
          red: "#dc2626",
          redDark: "#b91c1c",
          black: "#0a0a0a",
          zinc: "#18181b",
        },
      },
      keyframes: {
        "sheet-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "tab-pop": {
          "0%": { transform: "scale(0.85)" },
          "60%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "sheet-up": "sheet-up 0.45s cubic-bezier(0.22,1,0.36,1)",
        "pop-in": "pop-in 0.25s cubic-bezier(0.16,1,0.3,1)",
        "fade-in": "fade-in 0.25s ease",
        "tab-pop": "tab-pop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      },
    },
  },
  plugins: [],
};

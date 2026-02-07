import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: "#B0FF1F",
        text: "#334B06",
        "bg-accordion": "#F5F5F5",
        warning: "#FFBB00",
        danger: {
          DEFAULT: "#FF0000",
          text: "#FF0000",
          border: "#FF0000",
          bg: "#FF0000",
        },
        safe: "#10b981",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "system-ui", "sans-serif"],
      },
      spacing: {
        "safe-top": "20px",
      },
    },
  },
  plugins: [],
} satisfies Config;

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
        "bg-header": "#B0FF1F",
        "bg-primary": "#0C0C0F",
        "bg-secondary": "#15151A",
        "text-dark": "#121C00",
        "text-light": "#B0FF1F",
        "text-base": "#F5F5F5",
        "text-warning": "#FF0000",
        lime: "#B0FF1F",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./public/**/*.svg",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1E40AF",
        },
        accent: "#06B6D4",
        text: "#0F172A",
        textDark: "#E2E8F0",
        bgLight: "#FFFFFF",
        bgDark: "#0B1020",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "Inter", "ui-sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;


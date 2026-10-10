import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-primary)", "DM Sans", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "DM Serif Display", "Georgia", "serif"],
      },
      colors: {
        "cotton-candy": "var(--color-cotton-candy)",
        "chalk-white":  "var(--color-chalk-white)",
        "jet-black":    "var(--color-jet-black)",
        "pewter-gray":  "var(--color-pewter-gray)",
        bg:      "var(--bg)",
        surface: "var(--surface)",
        text:    "var(--text)",
        muted:   "var(--text-muted)",
        accent:  "var(--accent)",
        border:  "var(--border)",
        /* Legacy aliases kept for backward compat */
        pri:  "var(--pri)",
        pink: "var(--pink)",
        ink:  "var(--ink)",
        mute: "var(--mute)",
        line: "var(--line)",
      },
      borderRadius: {
        pill:  "999px",
        card:  "20px",
        tile:  "16px",
        thumb: "12px",
        img:   "20px",
        input: "12px",
        frame: "28px",
      },
    },
  },
  plugins: [],
};

export default config;


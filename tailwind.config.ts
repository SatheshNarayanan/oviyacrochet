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
        baloo: ["var(--font-baloo)", "DM Sans", "sans-serif"],
        dm: ["var(--font-dm)", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        lav: "var(--lav)",
        pri: "var(--pri)",
        pink: "var(--pink)",
        lilac: "var(--lilac)",
        mint: "var(--mint)",
        ink: "var(--ink)",
        mute: "var(--mute)",
        line: "var(--line)",
      },
      borderRadius: {
        pill: "999px",
        card: "22px",
        tile: "16px",
        thumb: "12px",
        img: "24px",
        input: "12px",
        frame: "32px",
      },
    },
  },
  plugins: [],
};

export default config;

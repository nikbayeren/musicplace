import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        "text-muted": "var(--text-muted)",
        "text-faint": "var(--text-faint)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
      },
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        background: "#000000",
        foreground: "#ededed",
        obsidian: {
          DEFAULT: "#000000",
          base: "#09090b",
          elevated: "#121215",
          terminal: "#050507",
        },
        terminal: {
          canvas: "#050507",
          prompt: "#10b981",
          output: "#d4d4d8",
          error: "#f43f5e",
          copilot: "#06b6d4",
          xp: "#f59e0b",
        },
      },
      boxShadow: {
        "glow-emerald": "0 0 25px rgba(16, 185, 129, 0.25)",
        "glow-cyan": "0 0 25px rgba(6, 182, 212, 0.25)",
        "inner-bezel": "inset 0 1px 0 0 rgba(255, 255, 255, 0.07)",
        "bevel-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.07), 0 0 30px rgba(16, 185, 129, 0.22)",
        "machined": "inset 0 1px 0 0 rgba(255, 255, 255, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;

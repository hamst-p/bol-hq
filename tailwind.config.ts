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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        wave1: {
          '0%': { transform: 'translateX(0) rotate(-3deg)' },
          '50%': { transform: 'translateX(-25%) rotate(-3deg)' },
          '100%': { transform: 'translateX(0) rotate(-3deg)' },
        },
        wave2: {
          '0%': { transform: 'translateX(0) rotate(2deg)' },
          '50%': { transform: 'translateX(-30%) rotate(2deg)' },
          '100%': { transform: 'translateX(0) rotate(2deg)' },
        },
        wave3: {
          '0%': { transform: 'translateX(0) rotate(-1deg)' },
          '50%': { transform: 'translateX(-20%) rotate(-1deg)' },
          '100%': { transform: 'translateX(0) rotate(-1deg)' },
        },
      },
      animation: {
        'wave1': 'wave1 15s ease-in-out infinite',
        'wave2': 'wave2 18s ease-in-out infinite',
        'wave3': 'wave3 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;

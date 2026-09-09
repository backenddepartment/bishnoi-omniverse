import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        ink: '#0f0e0c',
        'ink-2': '#1c1a17',
        'ink-soft': '#4a463d',
        paper: '#faf8f4',
        'paper-2': '#f2ede2',
        surface: '#ffffff',
        line: '#e4ddd0',
        muted: '#6e675a',
        accent: {
          DEFAULT: '# ',
          dark: '#c2561a',
          tint: '#fde9de',
        },
        // Global Network blue, carried over from the Getmeds design.
        'brand-blue': '#1d9fda',
      },
      maxWidth: {
        wrap: '1180px',
      },
    },
  },
  plugins: [],
};
export default config;

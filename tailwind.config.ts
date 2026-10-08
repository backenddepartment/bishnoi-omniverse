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
          DEFAULT: '#f36b21',
          dark: '#c2561a',
          tint: '#fde9de',
        },
        // Global Network blue, carried over from the Getmeds design.
        'brand-blue': '#1d9fda',
        // The analytics dashboard (/admin/), after the Bishnoi One CRM component sheet
        // (analytics-worker/bishnoi-one-crm-components.html): ink for text and lines, and a
        // nine-step blue main colour. 50-200: soft backgrounds and selected rows · 300-400: fills
        // and charts · p (main): buttons and where you are · 600-800: hover, pressed and text on
        // soft fills.
        crm: {
          ink: '#141414',
          'ink-2': '#3b3b3b',
          'ink-3': '#6a6a6a',
          'ink-4': '#8f8f8f',
          rule: '#e2e2e2',
          'rule-2': '#f0f0ee',
          outline: '#8a8a8a',
          bench: '#fafaf8',
          hover: '#f4f4f2',
          head: '#fbfbfa',
          'p-50': '#ecf4fd',
          'p-100': '#d8eafb',
          'p-200': '#b1d4f6',
          'p-300': '#86bcf1',
          'p-400': '#499bea',
          p: '#0c79e3',
          'p-600': '#0a68c3',
          'p-700': '#08559f',
          'p-800': '#07437d',
          good: '#3f6f35',
          'good-bg': '#e6f2e1',
          warn: '#8a5a00',
          'warn-bg': '#fbf0d9',
          behind: '#e8c27a',
          bad: '#b42318',
          'bad-bg': '#fde8e6',
          info: '#1f4f8a',
          'info-bg': '#e7eef8',
        },
      },
      maxWidth: {
        wrap: '1180px',
      },
      // Short screens (by height, not width), so the /admin/ sign-in card fits without scrolling.
      // h-sm comes second so it wins where both match.
      screens: {
        'h-md': { raw: '(max-height: 820px)' },
        'h-sm': { raw: '(max-height: 660px)' },
      },
    },
  },
  plugins: [],
};
export default config;

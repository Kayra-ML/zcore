/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        "colors": {
            "surface-container-low": "#1a1b21",
            "outline": "#958ea0",
            "primary-container": "#a078ff",
            "primary-fixed": "#e9ddff",
            "surface-dim": "#111318",
            "outline-variant": "#4a4551",
            "secondary-container": "#4a4459",
            "secondary": "#cbc2dc",
            "inverse-surface": "#e2e2e9",
            "inverse-primary": "#653bd6",
            "primary": "#d1bcff",
            "on-surface-variant": "#cbc4d6",
            "surface": "#111318",
            "surface-container": "#1d1f25",
            "on-surface": "#e2e2e9",
            "tertiary": "#f0b7bc",
            "error-container": "#93000a",
            "error": "#ffb4ab",
            "success": "#34d399",     /* Optional success color */
            "warning": "#fbbf24"      /* Optional warning color */
        }
    },
  },
  plugins: [],
}

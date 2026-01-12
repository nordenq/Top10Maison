/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F2428",
        accent: "#2BBBAD",
        "accent-hover": "#25A79B",
        "accent-soft": "#D7F4EF",
        secondary: "#F7A6A8",
        background: "#F8FBF9",
        surface: "#FFFFFF",
        border: "#E3ECE7",
        success: "#10B981",
        warning: "#F59E0B",
        alert: "#EF4444"
      },
      fontFamily: {
        sans: ["DM Sans", "Inter", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"]
      },
      boxShadow: {
        card: "0 10px 24px rgba(28, 28, 30, 0.08)"
      }
    }
  },
  plugins: []
};

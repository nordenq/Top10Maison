/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F2428",
        accent: "#0B4F43",
        "accent-hover": "#093E3A",
        "accent-soft": "#D7F4EF",
        secondary: "#F7A6A8",
        background: "#F8FBF9",
        surface: "#FFFFFF",
        "surface-muted": "#F3F5F4",
        border: "#E3ECE7",
        success: "#10B981",
        warning: "#F59E0B",
        alert: "#EF4444"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"]
      },
      boxShadow: {
        card: "0 10px 24px rgba(28, 28, 30, 0.08)"
      }
    }
  },
  plugins: []
};

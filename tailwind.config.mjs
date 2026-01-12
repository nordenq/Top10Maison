/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F2428",
        accent: "#13897C",
        "accent-hover": "#106D66",
        "accent-soft": "#D1F0ED",
        secondary: "#F7A6A8",
        background: "#F8FBF9",
        surface: "#FFFFFF",
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

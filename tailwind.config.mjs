/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C1C1E",
        accent: "#2F80ED",
        "accent-hover": "#1A73E8",
        background: "#F9FAFB",
        border: "#E5E7EB",
        success: "#10B981",
        warning: "#F59E0B",
        alert: "#EF4444"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 10px 24px rgba(28, 28, 30, 0.08)"
      }
    }
  },
  plugins: []
};

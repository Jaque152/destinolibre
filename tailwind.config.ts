import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-bricolage)", "ui-sans-serif", "sans-serif"],
        serif: ["var(--font-instrument)", "ui-serif", "serif"],
        mono: ["var(--font-martian)", "ui-monospace", "monospace"],
      },
      colors: {
        // Nueva paleta de marca: Destino Libre
        brand: {
          orange: {
            DEFAULT: "#F97316", // orange-500
            50: "#FFF7ED",
            100: "#FFEDD5",
            500: "#F97316",
            600: "#EA580C",
            700: "#C2410C",
          },
          sky: {
            DEFAULT: "#38BDF8", // sky-400
            50: "#F0F9FF",
            100: "#E0F2FE",
            400: "#38BDF8",
            500: "#0EA5E9",
            600: "#0284C7",
          },
          slate: {
            DEFAULT: "#0F172A", // slate-900
            50: "#F8FAFC",
            100: "#F1F5F9",
            800: "#1E293B",
            900: "#0F172A",
            950: "#020617",
          },
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "spin-slow": "spin-slow 22s linear infinite",
        rise: "rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        blink: "blink 1.4s ease-in-out infinite",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.25rem",
          sm: "2rem",
          lg: "3rem",
        },
        screens: {
          "2xl": "1440px",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
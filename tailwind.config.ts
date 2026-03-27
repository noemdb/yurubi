import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          blue: {
            DEFAULT: "#0c88ee",
            50: "#f0f7ff",
            100: "#e0effe",
            500: "#0c88ee",
            600: "#006cd1",
            700: "#0056ad",
            800: "#003e7e",
            900: "#002a55",
          },
          green: {
            DEFAULT: "#45b072",
            50: "#f2fcf5",
            100: "#e0f8e8",
            500: "#45b072",
            600: "#32925a",
            700: "#2a764b",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // ── TIPOGRAFÍA ──────────────────────────────────────────────
      fontFamily: {
        // Mapeo de tokens a variables CSS inyectadas por next/font
        display: ["var(--font-display)", "Georgia", "Cambria", "serif"],
        body:    ["var(--font-body)", "Georgia", "Cambria", "serif"],
        ui:      ["var(--font-ui)", "ui-sans-serif", "system-ui", "sans-serif"],
        // Aliases para compatibilidad semántica
        sans:    ["var(--font-ui)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif:   ["var(--font-body)", "Georgia", "Cambria", "serif"],
      },

      // ── ESCALA TIPOGRÁFICA EXTENDIDA ─────────────────────────────
      // Tailwind base cubre text-xs hasta text-9xl.
      // Se añaden aliases semánticos para consistencia en el proyecto.
      fontSize: {
        // Display scale (H1 / Hero)
        "display-2xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],  // 60px
        "display-xl":  ["3rem",    { lineHeight: "1.1", letterSpacing: "-0.01em" }],  // 48px
        // Heading scale
        "heading-lg":  ["2.5rem",  { lineHeight: "1.2", letterSpacing: "-0.005em" }], // 40px
        "heading-md":  ["2rem",    { lineHeight: "1.2", letterSpacing: "-0.005em" }], // 32px
        "heading-sm":  ["1.625rem",{ lineHeight: "1.3", letterSpacing: "0" }],        // 26px
        "heading-xs":  ["1.375rem",{ lineHeight: "1.3", letterSpacing: "0" }],        // 22px
        // Body scale
        "body-lg":     ["1.125rem",{ lineHeight: "1.5", letterSpacing: "0.005em" }],  // 18px
        "body-md":     ["1rem",    { lineHeight: "1.5", letterSpacing: "0" }],        // 16px
        "body-sm":     ["0.875rem",{ lineHeight: "1.5", letterSpacing: "0" }],        // 14px
        // UI scale
        "ui-md":       ["1rem",    { lineHeight: "1.1", letterSpacing: "0.01em" }],   // 16px (buttons)
        "ui-sm":       ["0.875rem",{ lineHeight: "1.3", letterSpacing: "0.01em" }],   // 14px (labels)
        "ui-xs":       ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],   // 12px (captions)
        "overline":    ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],   // 12px (overlines)
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};

export default config;

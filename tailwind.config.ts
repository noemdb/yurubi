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
        // Sistema mono-familiar: Inter en todos los contextos
        sans:    ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        // Aliases semánticos — todos apuntan a Inter
        display: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        body:    ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        ui:      ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },

      // ── ESCALA TIPOGRÁFICA SEMÁNTICA ─────────────────────────────
      fontSize: {
        // Display / Hero
        "display-2xl": ["3.75rem", { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "700" }], // 60px
        "display-xl":  ["3rem",    { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "700" }], // 48px
        // Headings
        "heading-xl":  ["2.5rem",  { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }], // 40px
        "heading-lg":  ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }], // 36px
        "heading-md":  ["1.75rem", { lineHeight: "1.25", letterSpacing: "-0.005em",fontWeight: "600" }], // 28px
        "heading-sm":  ["1.5rem",  { lineHeight: "1.25", letterSpacing: "-0.005em",fontWeight: "600" }], // 24px
        "heading-xs":  ["1.25rem", { lineHeight: "1.3",  letterSpacing: "0",       fontWeight: "500" }], // 20px
        // Body
        "body-lg":     ["1.125rem",{ lineHeight: "1.6",  letterSpacing: "0" }],  // 18px
        "body-md":     ["1rem",    { lineHeight: "1.5",  letterSpacing: "0" }],  // 16px
        "body-sm":     ["0.875rem",{ lineHeight: "1.45", letterSpacing: "0" }],  // 14px
        // UI / Funcional
        "ui-lg":       ["1rem",    { lineHeight: "1",    letterSpacing: "0.01em" }], // 16px buttons
        "ui-md":       ["0.9375rem",{lineHeight: "1",    letterSpacing: "0.01em" }], // 15px buttons sm
        "ui-sm":       ["0.875rem",{ lineHeight: "1.3",  letterSpacing: "0.005em"}], // 14px labels
        "ui-xs":       ["0.8125rem",{lineHeight: "1.3",  letterSpacing: "0.005em"}], // 13px labels sm
        // Micro
        "caption":     ["0.75rem", { lineHeight: "1.4",  letterSpacing: "0.01em" }], // 12px
        "overline":    ["0.6875rem",{ lineHeight: "1.4", letterSpacing: "0.08em" }],  // 11px
        // KPI (dashboard)
        "kpi-lg":      ["3rem",    { lineHeight: "1",    letterSpacing: "-0.02em", fontWeight: "700" }], // 48px
        "kpi-md":      ["2.5rem",  { lineHeight: "1",    letterSpacing: "-0.02em", fontWeight: "700" }], // 40px
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

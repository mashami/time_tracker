import plugin from "tailwindcss/plugin"

export const shadcnPlugin = plugin(
  ({ addBase }) => {
    addBase({
      ":root": {
        "--background": "100 100% 100%",
        "--foreground": "0 0% 23%",

        "--muted": "210 40% 96.1%",
        "--muted-foreground": "0 0% 23%",

        "--popover": "0 0% 100%",
        "--popover-foreground": "222.2 84% 4.9%",

        "--card": "0 0% 100%",
        "--card-foreground": "222.2 84% 4.9%",

        "--border": "256 60% 91.4%",
        "--input": "256 31.8% 91.4%",

        "--primary": "193 100% 26%",
        "--primary-foreground": "3 0% 26%",

        "--secondary": "210 40% 96.1%",
        "--secondary-foreground": "222.2 47.4% 11.2%",

        "--accent": "210 40% 96.1%",
        "--accent-foreground": "222.2 47.4% 11.2%",

        "--destructive": "0 84.2% 60.2%",
        "--destructive-foreground": "210 40% 98%",

        "--ring": "256 40% 65.1%",

        "--purple_50": "254 100% 97%",
        "--purple_200": " 256 100% 87%",
        "--purple_400": "255 100% 73%",
        "--purple_500": "256 100% 67%",
        "--purple_600": "255 63% 55%",

        "--blue": "202 100% 65%",
        "--lebalColor": "0 0% 58%",

        "--radius": "4px"
      }
    })

    addBase({
      "*": {
        "@apply border-border": {}
      },
      body: {
        "@apply bg-background text-foreground": {}
      }
    })
  },
  {
    theme: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1400px"
        }
      },

      extend: {
        fontFamily: {
          ibm_plex_mono: [`var(--font-ibm-plex-mono)`],
          bricolage: [`var(--font-bricolage-grotesque)`],
          lexend: [`var(--font-lexend-Deca)`]
          // --font-lexend-Deca
        },
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          brand: "var(--brand-color)",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))"
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))"
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))"
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))"
          },
          purple_50: {
            DEFAULT: "hsl(var(--purple_50))",
            foreground: "hsl(var(--purple-foreground))"
          },
          purple_200: {
            DEFAULT: "hsl(var(--purple_200))"
          },
          purple_400: {
            DEFAULT: "hsl(var(--purple_400))"
          },

          purple_500: {
            DEFAULT: "hsl(var(--purple_500))",
            foreground: "hsl(var(--purple-foreground))"
          },
          purple_600: {
            DEFAULT: "hsl(var(--purple_600))"
          },

          blue: {
            DEFAULT: "hsl(var(--blue))"
          },
          lebalColor: {
            DEFAULT: "hsl(var(--lebalColor))"
          },

          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))"
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))"
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))"
          }
        },
        borderRadius: {
          main: "var(--radius)"
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" }
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" }
          }
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out"
        }
      }
    }
  }
)

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0D2137",
        blue: "#1A7BBF",
        orange: "#E8913A",
        offwhite: "#F5F7FA",
        charcoal: "#1C2833",
        grey: "#7F8C8D",
        lightblue: "#E8F0F7",
        lightorange: "#FEF5E7",
        success: "#27AE60",
        error: "#E74C3C",
      },
    },
  },
  plugins: [],
};

export default config;

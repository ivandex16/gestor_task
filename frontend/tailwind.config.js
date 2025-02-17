/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", "...defaultTheme.fontFamily.sans"],
      },
    },
  },
  plugins: [require("daisyui")],
};

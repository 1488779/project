export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        colors: {
          primary: "#2E7D32",
          secondary: "#FFFFFF",
          text: "#666666",
        }
    },
  },
  plugins: [],
}
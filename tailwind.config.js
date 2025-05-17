/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["server/admin/views/**/*.hbs", "server/admin/views/**/*.html"],
  theme: {
    extend: {
      colors: {
        blue: {
          tec2med: "#6EC1E4"
        }
      }
    },
  },
  plugins: [],
}


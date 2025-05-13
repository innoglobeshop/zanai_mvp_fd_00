/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line tells Tailwind to scan all .js, .ts, .jsx, .tsx files in the src folder
  ],
  theme: {
    extend: {
      colors: { // Add a colors object
        'deep-blue': '#0D3B66', // Your custom color from the spec
      },
    },
  },
  plugins: [],
}
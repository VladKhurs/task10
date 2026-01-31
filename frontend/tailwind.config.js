/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                "theme": "#1f2937",
                "theme-hover": "#374151",
                "accent": "#f75b00",
                "accent-hover": "#ff6709",
                "gray-light": "#e4e4e7",
                "gray-medium": "#71717a",

            }
        },
    },
    plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                "theme": "#2e0228", 
                "theme-hover": "#4a0440",
                "accent": "#00ff9d",
                "accent-hover": "#5effc4",
                "gray-light": "#fdf2f8",
                "gray-medium": "#9d5c88",
            }
        },
    },
    plugins: [],
};

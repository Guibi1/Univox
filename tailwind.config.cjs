/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["src/app.html", "src/**/*.svelte"],
    darkMode: ["class", '[data-colorscheme="dark"]'],
    theme: {
        extend: {},
        screens: {
            tablet: "640px",
            laptop: "1024px",
            desktop: "1280px",
        },
    },
    plugins: [],
};

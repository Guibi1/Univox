/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["src/app.html", "src/**/*.svelte"],
    darkMode: ["class", '[data-colorscheme="dark"]'],
    theme: {
        extend: {
            colors: {
                blue: {
                    primary: "#36A7B3",
                    secondary: "#226B73",
                },
                orange: {
                    primary: "#FF8126",
                    secondary: "#FF7F25",
                },
            },
        },
        screens: {
            tablet: "640px",
            laptop: "1024px",
            desktop: "1280px",
        },
    },
    plugins: [],
};

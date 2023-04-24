/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["src/app.html", "src/**/*.svelte"],
    darkMode: ["class", '[data-colorscheme="dark"]'],
    theme: {
        extend: {
            colors: {
                blue: {
                    primary: "#176936",
                    secondary: "#0F2240",
                    darkPrimary: "#229C50",
                },
                orange: {
                    primary: "#FF8126",
                    secondary: "#FF7F25",
                },
                gray1: "#343434",
                gray2: "#353535",
                gray3: "#202020",
            },
        },
        screens: {
            tablet: "800px",
            laptop: "1024px",
            desktop: "1280px",
        },
    },
    plugins: [],
};

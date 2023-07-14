/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            colors: {
                "blue": {
                    primary: "#176936",
                    secondary: "#0F2240",
                    darkPrimary: "#229C50",
                },
                "orange": {
                    primary: "#FF8126",
                    secondary: "#FF7F25",
                },
                "light-gray": "#606060",
                "gray2": "#353535",
                "gray3": "#202020",
            },
        },
    },
    darkMode: "class",
    content: [
        "src/app.html",
        "src/**/*.svelte",
        require("path").join(
            require.resolve("@skeletonlabs/skeleton"),
            "../**/*.{html,js,svelte,ts}"
        ),
    ],
    plugins: [
        ...require("@skeletonlabs/skeleton/tailwind/skeleton.cjs")(),
        require("tailwind-scrollbar")({ nocompatible: true }),
    ],
};

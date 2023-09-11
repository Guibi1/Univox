import { join } from "path";
import type { Config } from "tailwindcss";

import { skeleton } from "@skeletonlabs/tw-plugin";
import tailwindForms from "@tailwindcss/forms";
import { theme } from "./src/univox-theme";

const config = {
    darkMode: "class",
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}"),
    ],
    theme: {
        extend: {},
    },
    plugins: [
        tailwindForms(),
        skeleton({
            themes: {
                custom: [theme],
            },
        }),
    ],
} satisfies Config;

export default config;

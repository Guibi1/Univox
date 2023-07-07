import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        alias: {
            "$lib": "./src/lib",
            "$lib/*": "./src/lib/*",
            "$src/*": "./src/*",
            "$assets/*": "./src/assets/*",
        },
    },
};

export default config;

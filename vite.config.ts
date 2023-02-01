import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import path from "path";

const config: UserConfig = {
    plugins: [sveltekit()],
    resolve: {
        alias: {
            $lib: path.resolve("./src/lib"),
            $src: path.resolve("./src"),
            $assets: path.resolve("./src/assets"),
        },
    },
};

export default config;

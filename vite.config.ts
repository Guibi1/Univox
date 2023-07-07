import { sveltekit } from "@sveltejs/kit/vite";
import { apiFetch } from "sveltekit-api-fetch/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit(), apiFetch()],
});

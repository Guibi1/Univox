import { dev } from "$app/environment";
import { planetscale } from "@lucia-auth/adapter-mysql";
import lucia from "lucia-auth";
import { sveltekit } from "lucia-auth/middleware";
import { planetScaleConnection } from "./db";

export const auth = lucia({
    adapter: planetscale(planetScaleConnection),
    env: dev ? "DEV" : "PROD",
    middleware: sveltekit(),
    transformDatabaseUser: (userData) => ({ ...userData }),
});

export type Auth = typeof auth;

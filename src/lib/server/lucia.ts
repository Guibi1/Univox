import { dev } from "$app/environment";
import { planetscale } from "@lucia-auth/adapter-mysql";
import lucia from "lucia-auth";
import { sveltekit } from "lucia-auth/middleware";
import { planetScaleConnection } from "./db";

export const auth = lucia({
    adapter: planetscale(planetScaleConnection),
    env: dev ? "DEV" : "PROD",
    middleware: sveltekit(),
    transformDatabaseUser: (userData) => {
        return {
            id: userData.id,
            da: userData.da,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar,
        };
    },
});

export type Auth = typeof auth;

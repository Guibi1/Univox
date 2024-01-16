import { dev } from "$app/environment";
import { DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USERNAME } from "$env/static/private";
import { planetscale } from "@lucia-auth/adapter-mysql";
import { connect } from "@planetscale/database";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";

const conn = connect({
    host: DATABASE_HOST,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
});

export const auth = lucia({
    //@ts-expect-error Lucia's planetscale version doesn't match
    adapter: planetscale(conn, {
        user: "users",
        key: "user_key",
        session: "user_session",
    }),
    env: dev ? "DEV" : "PROD",
    middleware: sveltekit(),
    getUserAttributes(d) {
        return {
            da: d.da,
            email: d.email,
            firstName: d.firstName,
            lastName: d.lastName,
            avatar: d.avatar,
        };
    },
    csrfProtection: true,
});

export type Auth = typeof auth;

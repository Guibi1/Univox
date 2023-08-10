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
    adapter: planetscale(conn, {
        user: "auth_user",
        key: "auth_key",
        session: "auth_session",
    }),
    env: dev ? "DEV" : "PROD",
    middleware: sveltekit(),
    getUserAttributes(d) {
        const data = d as unknown as {
            first_name: string;
            last_name: string;
        };

        return {
            da: d.da,
            email: d.email,
            firstName: data.first_name,
            lastName: data.last_name,
            avatar: d.avatar,
        };
    },
});

export type Auth = typeof auth;

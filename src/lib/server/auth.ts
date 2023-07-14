import { dev } from "$app/environment";
import { DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USERNAME } from "$env/static/private";
import { planetscale } from "@lucia-auth/adapter-mysql";
import { connect } from "@planetscale/database";
import lucia from "lucia-auth";
import { sveltekit } from "lucia-auth/middleware";

const conn = connect({
    host: DATABASE_HOST,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
});

export const auth = lucia({
    adapter: planetscale(conn),
    env: dev ? "DEV" : "PROD",
    middleware: sveltekit(),
    transformDatabaseUser: (userData) => ({ ...userData }),
});

export type Auth = typeof auth;

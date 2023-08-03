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
    transformDatabaseUser: (d) => {
        // Lucia does not map the table columns to the property name
        // Here we have to rename some property to make it align with the User type
        const data = d as unknown as Omit<U, "firstName" | "lastName"> & {
            first_name: string;
            last_name: string;
        };
        return {
            id: data.id,
            da: data.da,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            avatar: data.avatar,
        } as U;
    },
});

export type Auth = typeof auth;

type U = Required<
    Readonly<
        {
            id: string;
        } & Required<Lucia.UserAttributes>
    >
>;

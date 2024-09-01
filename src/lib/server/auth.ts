import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

import { Lucia, type RegisteredDatabaseUserAttributes } from "lucia";
import { dev } from "$app/environment";

import { userTable, sessionTable, type User } from "./schema/authentication";
import { connectSQLite } from "./sqlite";

const db = connectSQLite();

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: !dev
        }
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username
        }
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: Omit<User, "id">;
    }
}

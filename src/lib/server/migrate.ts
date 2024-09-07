import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { connectSQLite } from "./sqlite";

const db = connectSQLite();

console.log("Starting migration...");

if (db === null) {
    console.log("Could not connect to database");
} else {
    migrate(db, { migrationsFolder: './drizzle' });

    console.log("Migration finished");
}



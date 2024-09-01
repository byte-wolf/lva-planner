import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { connectSQLite } from "./sqlite";

const db = connectSQLite();

console.log("Starting migration...");

migrate(db, { migrationsFolder: './drizzle' });

console.log("Migration finished");

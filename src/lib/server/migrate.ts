import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { connectSQLite } from "./sqlite";

const db = connectSQLite();

migrate(db, { migrationsFolder: './drizzle' });

import { drizzle, type BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';


let db: BunSQLiteDatabase | null = null;

export function connectSQLite() {
    if (db === null) {
        const sqlite = new Database("app.db");
        db = drizzle(sqlite);
    }

    return db;
}
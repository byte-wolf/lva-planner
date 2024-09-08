import { drizzle, type BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as authSchema from './schema/authentication'
import * as businessSchema from './schema/business'
import type { SQLiteTableWithColumns, SQLiteColumn } from 'drizzle-orm/sqlite-core';
import type { Relations, Many, One } from 'drizzle-orm';

const schema = { ...businessSchema, ...authSchema };
let db: BunSQLiteDatabase<typeof schema> | null = null;

export function connectSQLite(): Exclude<typeof db, null> {
    if (db === null) {
        const sqlite = new Database("app.db");
        db = drizzle(sqlite, { schema });
    }

    return db;
}
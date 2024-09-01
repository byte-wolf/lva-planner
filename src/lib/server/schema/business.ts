import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const semesterTable = sqliteTable("semester", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    year: integer("year"),
    isSummerSemester: integer("is_summer_semester", { mode: 'boolean' })
});

export type Semester = typeof semesterTable.$inferSelect;
export type InsertSemester = typeof semesterTable.$inferInsert;
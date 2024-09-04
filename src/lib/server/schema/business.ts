import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";

export const semesterTable = sqliteTable("semester", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    year: integer("year").notNull(),
    isSummerSemester: integer("is_summer_semester", { mode: 'boolean' }).notNull()
}, (t) => ({
    unq: unique().on(t.year, t.isSummerSemester)
}));

export type Semester = typeof semesterTable.$inferSelect;
export type InsertSemester = typeof semesterTable.$inferInsert;


export const courseTable = sqliteTable("course", {

});
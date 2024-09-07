import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

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
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title"),
    courseTypeId: integer("course_type_id").references(() => courseTypeTable.id),
    semesterId: integer("semester_id").references(() => semesterTable.id)
});

export type Course = typeof courseTable.$inferSelect;
export type InsertCourse = typeof courseTable.$inferInsert;


export const courseTypeTable = sqliteTable("course_type", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    label: text("label")
});

export type CourseType = typeof courseTypeTable.$inferSelect;
export type InsertCourseType = typeof courseTypeTable.$inferInsert;
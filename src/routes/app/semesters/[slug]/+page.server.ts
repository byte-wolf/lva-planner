import { courseTable, courseTypeTable, semesterTable } from "$lib/server/schema/business";
import { connectSQLite } from "$lib/server/sqlite";
import { count, eq, inArray, sql, sum } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { fail, message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import { z } from "zod";

export const load: PageServerLoad = async (event) => {
    let semesterId = parseInt(event.params.slug);

    const db = connectSQLite();

    //const semester = db.select().from(semesterTable).where(sql`${semesterTable.id} = ${semesterId}`).get();
    const semester = await db.query.semesterTable.findFirst({
        where: eq(semesterTable.id, semesterId),
        with: {
            courses: {
                with: {
                    courseType: true
                }
            }
        }
    });

    const stats = db.select({ ects: sum(courseTable.ectsAmount).mapWith(Number), count: count(courseTable) }).from(semesterTable).leftJoin(courseTable, eq(semesterTable.id, courseTable.semesterId)).get()!;

    const courseTypes = await db.select().from(courseTypeTable);

    if (semester === undefined) {
        return error(404, 'Not found');
    }

    const form = await superValidate(zod(formSchema));

    return {
        semester,
        courseTypes,
        stats,
        form
    }
}

export const actions = {
    createCourse: async (event) => {
        const formData = await event.request.formData();
        const form = await superValidate(formData, zod(formSchema));

        console.log("FORM DATA:", form.data);

        if (!form.valid) {
            return fail(400, {
                form,
            });
        };


        if (!formData.has('semesterId')) {
            return setError(form, 'Semester not found.');
        }

        const db = connectSQLite();


        await db.insert(courseTable).values({
            semesterId: JSON.parse(formData.get('semesterId') as string),
            title: form.data.title,
            courseTypeId: form.data.courseTypeId,
            ectsAmount: form.data.ectsAmount,
            registerCourseTimestamp: form.data.registerTimestamp,
            registerGroupTimestamp: form.data.registerGroupTimestamp,
        });

        return message(form, 'Form posted successfully!');
    },
    deleteCourses: async (event) => {
        const formData = await event.request.formData();

        const schema = z.object({
            ids: z.string().transform((val): number[] => {
                try {
                    const parsed = JSON.parse(val);
                    if (Array.isArray(parsed) && parsed.every(Number.isInteger)) {
                        return parsed;
                    }
                    throw new Error("Invalid format");
                } catch {
                    throw new Error("ids must be a valid JSON string representing an array of integers");
                }
            }),
        });

        const form = await superValidate(formData, zod(schema));

        if (!form.valid) {
            return fail(400, {
                form,
            });
        };

        const db = connectSQLite();

        await db.delete(courseTable).where(inArray(courseTable.id, form.data.ids))

        return message(form, 'Form posted successfully!');

    },
};
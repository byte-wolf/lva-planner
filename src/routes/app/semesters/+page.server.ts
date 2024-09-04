import { semesterTable } from '$lib/server/schema/business.js';
import { connectSQLite } from '$lib/server/sqlite.js';
import dayjs from 'dayjs';
import type { PageServerLoad, RequestEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms';
import { and, desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) redirect(302, "/identity/login");
    const db = connectSQLite();

    const now = dayjs();

    const semesters = (await db.select().from(semesterTable).orderBy(semesterTable.year, desc(semesterTable.isSummerSemester))).map(s => ({
        ...s,
        isCurrentSemester: now.year() === s.year && (s.isSummerSemester && now.month() < 6 || !s.isSummerSemester)
    }));

    return {
        username: event.locals.user.username,
        semesters: semesters,
        form: await superValidate(zod(formSchema))
    }
}

export const actions = {
    create: async (event) => {
        const form = await superValidate(event, zod(formSchema));

        if (!form.valid) {
            return fail(400, {
                form,
            });
        };

        const db = connectSQLite();

        const result = await db.select()
            .from(semesterTable)
            .where(and(eq(semesterTable.isSummerSemester, form.data.isSummerSemester), eq(semesterTable.year, form.data.year)));

        if (result.length > 0) {
            return setError(form, 'Semester already exists');
        }

        await db.insert(semesterTable).values({
            year: form.data.year,
            isSummerSemester: form.data.isSummerSemester,
        });

        return { form };
    },
    createCurrent: async (event) => {
        const db = connectSQLite();
        const now = dayjs();

        console.log("inserting...");

        await db.insert(semesterTable).values({
            year: now.year(),
            isSummerSemester: now.month() < 6
        });

        console.log("inserted");
    }
};
import { semesterTable } from '$lib/server/schema/business.js';
import { connectSQLite } from '$lib/server/sqlite.js';
import dayjs from 'dayjs';
import type { PageServerLoad, RequestEvent } from './$types';
import { redirect } from '@sveltejs/kit';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) redirect(302, "/identity/login");
    const db = connectSQLite();

    const now = dayjs();
    const semesters = (await db.select().from(semesterTable)).map(s => ({
        ...s,
        isCurrentSemester: now.year() === s.year && (s.isSummerSemester || now.month() >= 6)
    }));

    return {
        username: event.locals.user.username,
        semesters: semesters,
        form: await superValidate(zod(formSchema))
    }
}

export const actions = {
    create: async (event: RequestEvent) => {
        console.log(event.params);
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
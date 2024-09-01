import { semesterTable } from '$lib/server/schema/business.js';
import { connectSQLite } from '$lib/server/sqlite.js';
import dayjs from 'dayjs';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) redirect(302, "/identity/login");
    const db = connectSQLite();

    const semesters = await db.select().from(semesterTable);

    return {
        username: event.locals.user.username,
        semesters: semesters
    }
}

export const actions = {
    create: async (event) => {
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
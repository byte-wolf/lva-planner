import { semesterTable } from "$lib/server/schema/business";
import { connectSQLite } from "$lib/server/sqlite";
import { sql } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    let semesterId = event.params.slug;

    const db = connectSQLite();

    const semester = db.select().from(semesterTable).where(sql`${semesterTable.id} = ${semesterId}`).get();

    if (semester === undefined) {
        return error(404, 'Not found');
    }

    return {
        semester
    }
}
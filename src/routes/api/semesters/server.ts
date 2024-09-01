import type { KitConfig, RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent<{}>) {
    const data = await event.request.formData();
}
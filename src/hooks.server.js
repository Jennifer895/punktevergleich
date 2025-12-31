import { checkAndRunWeeklyReset } from "$lib/server/db";    

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({event, resolve}) {

    checkAndRunWeeklyReset();
    const response = await resolve(event);
    return response;
}
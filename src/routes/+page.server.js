import {getCurrentScores, getHistory} from '$lib/server/db.js';

export async function load(){

    const aktuellerStand = getCurrentScores();
    const historie = getHistory();
    return {
        aktuellerStand,
        historie
    };
}
import {endWeekAndReset, getCurrentScores, getHistory, updateScore} from '$lib/server/db.js';
import { fail } from '@sveltejs/kit';

export async function load(){

    const aktuellerStand = getCurrentScores();
    const historie = getHistory();
    return {
        aktuellerStand,
        historie
    };
}

async function handleAutomaticReset(aktuellerStand){

        let lastResetDate = new Date(aktuellerStand.lastResetDate);
    let today =new Date();
    const SEVEN_DAYS_IN_MS = 604800000;
    if (today.getTime() >= lastResetDate.getTime() + SEVEN_DAYS_IN_MS){
       let netDifference = aktuellerStand.scoreA - aktuellerStand.scoreB; 
    endWeekAndReset({
        pointsA: aktuellerStand.scoreA,
        pointsB: aktuellerStand.scoreB,
        netDifference: netDifference
    });
    aktuellerStand = getCurrentScores(); // Daten neu laden!
    }
}

// Die ACTIONS (Serverseitig, nur zum Datenändern)
/** @type {import('./$types').Actions} */
export const actions = {
    // Action für Felix (Score-Schlüssel 'A')
    increaseScoreA: async () => {
        try {
            
            const stand = getCurrentScores();
            const neuerScore = stand.scoreA + 1;
            updateScore('A', neuerScore);

            return { success: true, participant: 'Felix' };

        } catch (error) {
            console.error("Fehler beim Erhöhen von Score A:", error);
            // Wenn etwas schiefgeht (z.B. DB-Fehler), geben wir einen Fehler zurück
            return fail(500, { success: false, message: 'Fehler beim Speichern der Punkte für Felix.' });
        }
    },

    // Action für Jenny (Score-Schlüssel 'B')
    increaseScoreB: async () => {
         try {
            
            const stand = getCurrentScores();
            const neuerScore = stand.scoreB + 1;
            updateScore('B', neuerScore);

            return { success: true, participant: 'Jenny' };

        } catch (error) {
            console.error("Fehler beim Erhöhen von Score B:", error);
            return fail(500, { success: false, message: 'Fehler beim Speichern der Punkte für Jenny.' });
        }
    },

    endWeek: async () => {
        try{
             
            const stand = getCurrentScores();
            let netDifference = stand.scoreA - stand.scoreB;
            endWeekAndReset({
                pointsA: stand.scoreA, 
                pointsB: stand.scoreB, 
                netDifference: netDifference});

            return {sucess: true, message: 'Woche erfolgreich abgeschlossen.'}
        } catch (error){
            console.error("Fehler beim Wochenabschluss:", error)
            return fail(500, {success: false, message: 'Fehler beim Speichern der Wochenhistorie'})
        }
    }
}


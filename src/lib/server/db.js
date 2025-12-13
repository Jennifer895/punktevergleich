import Database from 'better-sqlite3';

const db = new Database('database.db');

export function getCurrentScores(){ 
    return db.prepare('select scoreA, scoreB, maxWeeklyPoints from current where id =1;').get();
}

export function updateScore(participant, newScore){
    const key = `score${participant}`;
    
    // Die Spalte (${key}) ist dynamisch, der Wert (?) ist ein sicherer Platzhalter.
    db.prepare(`UPDATE current SET ${key} = ? WHERE id = 1`).run(newScore);
}
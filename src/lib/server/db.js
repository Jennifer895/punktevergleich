import Database from 'better-sqlite3';

const db = new Database('database.db');

export function getCurrentScores(){ 
    return db.prepare('SELECT scoreA, scoreB, maxWeeklyPoints FROM current WHERE id =1').get();
}

export function updateScore(participant, newScore){
    const key = `score${participant}`;
    
    // Die Spalte (${key}) ist dynamisch, der Wert (?) ist ein sicherer Platzhalter.
    db.prepare(`UPDATE current SET ${key} = ? WHERE id = 1`).run(newScore);
}

export function endWeekAndReset({ pointsA, pointsB, netDifference }) {
    // ... (Berechnungen von lastEntry, newOverallScore)
    const lastEntry = db.prepare('SELECT overallNetScore FROM history ORDER BY id DESC LIMIT 1').get(); 
    const previousOverallScore = lastEntry ? lastEntry.overallNetScore : 0;
    const newOverallScore = previousOverallScore + netDifference;

    const today = new Date().toISOString(); 

    // INSERT des Datensatzes
    db.prepare('INSERT INTO history (date, pointsA, pointsB, netDifference, overallNetScore) VALUES (?, ?, ?, ?, ?)')
      .run(today, pointsA, pointsB, netDifference, newOverallScore);
    
    db.prepare('UPDATE current SET scoreA = 0, scoreB = 0, maxWeeklyPoints = 0 WHERE id = 1').run();
}

export function getHistory(){
    return db.prepare('SELECT * FROM history').all()
}
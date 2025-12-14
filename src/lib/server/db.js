// src/lib/server/db.js

import Database from 'better-sqlite3';

// 1. Verbindung zur Datenbank herstellen
const db = new Database('database.db');

// 2. Tabellenstrukturen und Initialisierung (WICHTIG: KEIN db.close() HIER!)
const createHistoryTable = `
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    pointsA INTEGER NOT NULL,
    pointsB INTEGER NOT NULL,
    netDifference INTEGER NOT NULL,
    overallNetScore INTEGER NOT NULL
);`;

const createCurrentTable = `
CREATE TABLE IF NOT EXISTS current (
    id INTEGER PRIMARY KEY CHECK (id = 1), 
    scoreA INTEGER NOT NULL,
    scoreB INTEGER NOT NULL,
    lastResetDate TEXT NOT NULL
);`;

db.exec(createHistoryTable);
db.exec(createCurrentTable);

const currentCheck = db.prepare('SELECT COUNT(*) AS count FROM current').get();
const today = new Date().toISOString();

if (currentCheck.count === 0) {
    db.prepare(`
        INSERT INTO current (id, scoreA, scoreB, lastResetDate)
        VALUES (1, 0, 0, ?)
    `).run(today);
    console.log('Datenbank initialisiert mit Startwerten.');
} else {
    console.log('Datenbanktabellen sind bereit.');
}

// ----------------------------------------------------------------------
// EXPORTIERTE FUNKTIONEN
// ----------------------------------------------------------------------

export function getCurrentScores(){ 
    return db.prepare('SELECT scoreA, scoreB, lastResetDate FROM current WHERE id =1').get();
}

export function updateScore(participant, newScore){
    const key = `score${participant}`;
    db.prepare(`UPDATE current SET ${key} = ? WHERE id = 1`).run(newScore);
}


export function endWeekAndReset({ pointsA, pointsB, netDifference}) {
    const lastEntry = db.prepare('SELECT overallNetScore FROM history ORDER BY id DESC LIMIT 1').get(); 
    const previousOverallScore = lastEntry ? lastEntry.overallNetScore : 0;
    const newOverallScore = previousOverallScore + netDifference;
    const lastResetDate = today;

   

    db.prepare('INSERT INTO history (date, pointsA, pointsB, netDifference, overallNetScore) VALUES (?, ?, ?, ?, ?)')
      .run(today, pointsA, pointsB, netDifference, newOverallScore);
    
    db.prepare('UPDATE current SET scoreA = 0, scoreB = 0 WHERE id = 1').run();
}

export function getHistory(){
    return db.prepare('SELECT * FROM history').all();
}
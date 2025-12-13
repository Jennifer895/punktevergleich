import Database from 'better-sqlite3';

const db = new Database('database.db');

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
    maxWeeklyPoints INTEGER NOT NULL
);`;

db.exec(createHistoryTable);
db.exec(createCurrentTable);

const currentCheck = db.prepare('SELECT COUNT(*) AS count FROM current').get();

if (currentCheck.count === 0) {
    db.prepare(`
        INSERT INTO current (id, scoreA, scoreB, maxWeeklyPoints)
        VALUES (1, 0, 0, 3)
    `).run();
    console.log('Datenbank initialisiert mit Startwerten.');
} else {
    console.log('Datenbanktabellen sind bereit.');
}

db.close();
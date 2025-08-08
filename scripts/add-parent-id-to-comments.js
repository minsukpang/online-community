
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(process.cwd(), 'community.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  db.run(`ALTER TABLE comments ADD COLUMN parentId INTEGER`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log('parentId column already exists in comments table.');
      } else {
        console.error('Error adding parentId column to comments table', err.message);
      }
    } else {
      console.log('parentId column added to comments table.');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing the database', err.message);
  } else {
    console.log('Database connection closed.');
  }
});

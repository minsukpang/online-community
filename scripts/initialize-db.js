
const db = require('../lib/db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating posts table', err.message);
    } else {
      console.log('Posts table created or already exists.');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating comments table', err.message);
    } else {
      console.log('Comments table created or already exists.');
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

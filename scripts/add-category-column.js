
const db = require('../lib/db');

db.serialize(() => {
  db.run(`ALTER TABLE posts ADD COLUMN category TEXT`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log('Category column already exists.');
      } else {
        console.error('Error adding category column to posts table', err.message);
      }
    } else {
      console.log('Category column added to posts table.');
    }
  });
});

db.close();

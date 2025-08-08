import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all posts
export async function GET() {
  return new Promise((resolve) => {
    db.all('SELECT * FROM posts ORDER BY createdAt DESC', [], (err, rows) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      } else {
        resolve(NextResponse.json(rows, { status: 200 }));
      }
    });
  });
}

// POST a new post
export async function POST(request) {
  const { title, content, category } = await request.json();

  if (!title || !content || !category) {
    return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 });
  }

  return new Promise((resolve) => {
    db.run('INSERT INTO posts (title, content, category) VALUES (?, ?, ?)', [title, content, category], function (err) {
      if (err) {
        console.error('API Error creating post:', err);
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ id: this.lastID, title, content, category }, { status: 201 }));
      }
    });
  });
}
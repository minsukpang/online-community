
import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a single post by id
export async function GET(request, { params }) {
  const { id } = params;

  return new Promise((resolve) => {
    db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      } else if (row) {
        resolve(NextResponse.json(row, { status: 200 }));
      } else {
        resolve(NextResponse.json({ error: 'Post not found' }, { status: 404 }));
      }
    });
  });
}

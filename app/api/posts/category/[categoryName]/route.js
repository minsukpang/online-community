
import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all posts in a specific category
export async function GET(request, { params }) {
  const { categoryName } = params;

  // Capitalize the first letter to match the stored category
  const category = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return new Promise((resolve) => {
    db.all('SELECT * FROM posts WHERE category = ? ORDER BY createdAt DESC', [category], (err, rows) => {
      if (err) {
        console.error('API Error fetching posts by category:', err);
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      } else {
        resolve(NextResponse.json(rows, { status: 200 }));
      }
    });
  });
}

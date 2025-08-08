import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Helper function to build a tree of comments
function buildCommentTree(comments, parentId = null) {
  const tree = [];
  comments.forEach(comment => {
    if (comment.parentId === parentId) {
      const children = buildCommentTree(comments, comment.id);
      if (children.length) {
        comment.children = children;
      }
      tree.push(comment);
    }
  });
  return tree;
}

// GET all comments for a post, with replies
export async function GET(request, { params }) {
  const { id } = params;

  return new Promise((resolve) => {
    db.all('SELECT * FROM comments WHERE postId = ? ORDER BY createdAt ASC', [id], (err, rows) => {
      if (err) {
        console.error('API Error fetching comments:', err);
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      } else {
        const commentTree = buildCommentTree(rows);
        resolve(NextResponse.json(commentTree, { status: 200 }));
      }
    });
  });
}

// POST a new comment to a post
export async function POST(request, { params }) {
  const { id: postId } = params;
  const { content, parentId = null } = await request.json();

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  return new Promise((resolve) => {
    db.run('INSERT INTO comments (postId, content, parentId) VALUES (?, ?, ?)', [postId, content, parentId], function (err) {
      if (err) {
        console.error('API Error creating comment:', err);
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ id: this.lastID, postId, content, parentId }, { status: 201 }));
      }
    });
  });
}
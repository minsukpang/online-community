import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db'; // db 대신 supabase 임포트

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
);
  return tree;
}

// GET all comments for a post, with replies
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('postid', id) // postId 대신 postid 사용
      .order('createdat', { ascending: true }); // createdat 사용

    if (error) {
      console.error('Supabase GET comments error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const commentTree = buildCommentTree(comments);
    return NextResponse.json(commentTree, { status: 200 });
  } catch (e) {
    console.error('Unexpected error in GET comments:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new comment to a post
export async function POST(request, { params }) {
  const { id: postId } = params;
  const { content, parentId = null } = await request.json();

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ postid: postId, content, parentId }]) // postid 사용
      .select();

    if (error) {
      console.error('Supabase POST comment error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data[0], { status: 201 });
  } catch (e) {
    console.error('Unexpected error in POST comment:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
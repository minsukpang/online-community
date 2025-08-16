import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db'; // db 대신 supabase 임포트

// GET a single post by id
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single(); // 단일 레코드 반환

    if (error) {
      console.error('Supabase GET post by ID error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    console.log('GET single post result:', post); // ADDED LOG
    return NextResponse.json(post, { status: 200 });
  } catch (e) {
    console.error('Unexpected error in GET post by ID:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
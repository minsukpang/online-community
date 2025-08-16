import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db'; // db 대신 supabase 임포트

// GET all posts
export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('createdat', { ascending: false }); // 최신순 정렬

    if (error) {
      console.error('Supabase GET posts error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(posts, { status: 200 });
  } catch (e) {
    console.error('Unexpected error in GET posts:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new post
export async function POST(request) {
  const { title, content, category } = await request.json();

  if (!title || !content || !category) {
    return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content, category }])
      .select(); // 삽입된 데이터 반환

    if (error) {
      console.error('Supabase POST post error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data[0], { status: 201 }); // 삽입된 첫 번째 레코드 반환
  } catch (e) {
    console.error('Unexpected error in POST post:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

import { categoryMapping } from '@/app/posts/new/page';

export async function GET(request, { params }) {
  const { categoryName } = params;
  const category = categoryMapping[categoryName]; 

  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('"category"', category) // 컬럼 이름을 큰따옴표로 감쌈
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase GET posts by category error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(posts, { status: 200 });
  } catch (e) {
    console.error('Unexpected error in GET posts by category:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
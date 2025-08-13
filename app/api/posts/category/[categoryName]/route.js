import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// categoryMapping을 lib/constants에서 직접 임포트
import { categoryMapping } from '@/lib/constants'; 

export async function GET(request, { params }) {
  const { categoryName } = params;
  const category = categoryMapping[categoryName]; 

  console.log('Request categoryName:', categoryName);
  console.log('Mapped category:', category);

  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('"category"', category)
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

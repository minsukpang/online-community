import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db'; // db 대신 supabase 임포트

// categoryMapping 임포트
import { categoryMapping } from '@/app/posts/new/page'; // categoryMapping을 export한 파일 경로

// GET all posts in a specific category
export async function GET(request, { params }) {
  const { categoryName } = params;

  // categoryMapping을 사용하여 정확한 카테고리 이름 가져오기
  // URL slug (예: 'game')를 실제 카테고리 이름 (예: 'Game')으로 변환
  const category = categoryMapping[categoryName]; 

  // 만약 categoryMapping에 없는 slug라면, 기존 방식대로 첫 글자만 대문자로 변환 (폴백)
  // 이 부분은 실제 데이터베이스에 저장된 카테고리 이름과 일치해야 합니다.
  // 현재 데이터베이스에는 'Game', 'Politics' 등으로 저장되어 있으므로, categoryMapping을 사용하는 것이 가장 정확합니다.
  // 하지만 혹시 모를 경우를 대비해 폴백으로 남겨둡니다.
  // category = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  // 또는 단순히 category = categoryName; (데이터베이스에 소문자로 저장된 경우)
  if (!category) {
    console.warn(`Category slug "${categoryName}" not found in mapping. Using capitalized version.`);
  }


  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
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

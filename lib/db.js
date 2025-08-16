import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트의 URL과 Anon Public Key를 여기에 입력하세요.
// 이 값들은 Vercel 환경 변수에서 가져올 것입니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
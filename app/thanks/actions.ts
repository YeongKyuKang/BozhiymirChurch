'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

const ITEMS_PER_PAGE = 6;

// 1. 글 등록 및 캐시 갱신
export async function createThanksPost(content: string, userId: string, nickname: string) {
  if (!content || !userId) return { error: "내용이 없습니다." };

  const { error } = await supabase
    .from('thanks_posts')
    .insert([{ 
      content, 
      user_id: userId, 
      author_nickname: nickname,
      created_at: new Date().toISOString() 
    }]);

  if (!error) {
    revalidatePath('/thanks');
    return { success: true };
  }
  return { success: false, error: error.message };
}

// 2. 비동기로 특정 페이지의 데이터만 가져오기
export async function getThanksPageData(page: number) {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, count, error } = await supabase
    .from('thanks_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) return { posts: [], totalPages: 0 };
  
  return {
    posts: data || [],
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
  };
}

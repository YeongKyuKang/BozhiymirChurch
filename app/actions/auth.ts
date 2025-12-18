'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOutAction() {
  // ★ 핵심 수정: await를 붙여서 비동기로 쿠키 저장소를 가져옵니다.
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Action에서 쿠키 설정 중 에러가 발생해도 무시 (이미 응답이 시작되었을 수 있음)
          }
        },
      },
    }
  );

  // 1. 서버 측 세션 종료
  await supabase.auth.signOut();

  // 2. 메인 페이지로 리다이렉트 (쿠키 삭제 헤더 포함)
  redirect('/');
}
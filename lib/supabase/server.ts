import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createClientPrimitive } from "@supabase/supabase-js"; // supabase-js 직접 import
import { Database } from "@/lib/supabase";

// 1. 기존 함수: 로그인 정보가 필요한 서버 컴포넌트용 (그대로 유지)
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // 무시
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // 무시
          }
        },
      },
    }
  );
}

// 2. [신규 추가] 캐시용 함수: 쿠키 없이 데이터만 가져오는 클라이언트
export function createClientForCache() {
  // 쿠키 접근 없이 순수하게 API 요청만 보내는 클라이언트를 생성합니다.
  return createClientPrimitive<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createClientPrimitive } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase";

// 1. 서버 컴포넌트/액션/미들웨어용 (Next.js 15+ 대응, 비동기)
export async function createClient() {
  const cookieStore = await cookies(); // await 필수

  return createServerClient<Database>(
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
            // 서버 컴포넌트에서 쿠키 설정 시 발생하는 에러 무시 (정상 동작)
          }
        },
      },
    }
  );
}

// 2. 캐시/데이터 데이터 페칭용 (unstable_cache 등에서 사용, 동기)
export function createClientForCache() {
  // 쿠키를 사용하지 않는 단순 데이터 조회용 클라이언트
  return createClientPrimitive<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

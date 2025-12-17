import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createClientPrimitive } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase";

// 1. 서버 컴포넌트/액션용 (Next.js 15 비동기 대응)
export async function createClient() {
  const cookieStore = await cookies(); // Next.js 15에서는 await 필수

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
            // 서버 컴포넌트에서 set 호출 시 발생하는 에러 무시
          }
        },
      },
    }
  );
}

// 2. 캐시/데이터 전용 클라이언트 (동일 유지)
export function createClientForCache() {
  return createClientPrimitive<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
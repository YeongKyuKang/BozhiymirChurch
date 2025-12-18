import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // [DEBUG] 미들웨어 시작 로그
  console.log(`[Middleware] Processing request: ${request.nextUrl.pathname}`);
  
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // [DEBUG] 쿠키 설정 로그
          console.log(`[Middleware] Setting cookies: ${cookiesToSet.map(c => c.name).join(', ')}`);
          
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          
          supabaseResponse = NextResponse.next({
            request,
          });
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser를 호출하여 세션을 검증하고 쿠키를 갱신합니다.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // [DEBUG] 유저 상태 로그
  if (error) {
    console.log(`[Middleware] getUser error or no session: ${error.message}`);
  } else {
    console.log(`[Middleware] User authenticated: ${user?.id}`);
  }

  return supabaseResponse;
}

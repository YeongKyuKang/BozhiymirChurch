import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. 초기 응답 객체 생성
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Supabase 클라이언트 생성 (쿠키 제어용)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. 세션 갱신 (매우 중요: 이것이 없으면 로그인이 자꾸 풀림)
  // getUser()를 호출하면 만료된 세션을 자동으로 갱신해줍니다.
  const { data: { user } } = await supabase.auth.getUser()

  // 4. (선택 사항) 관리자 페이지 보호 로직
  // /admin으로 시작하는 주소인데 로그인이 안되어있으면 로그인 페이지로 튕겨내기
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

// 5. 미들웨어가 실행될 경로 설정 (정적 파일 제외)
// _next, static, image, favicon 등은 체크하지 않음 -> 로그 제거 효과
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
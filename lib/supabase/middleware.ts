// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. 초기 응답 객체 생성
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Supabase 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // ★★★ 핵심: 쿠키를 request와 response 양쪽에 모두 설정해야 함 ★★★
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          
          supabaseResponse = NextResponse.next({
            request,
          })
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. 토큰 갱신 (여기서 setAll이 호출되어 supabaseResponse에 새 쿠키가 심어짐)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. ★★★ 중요: 반드시 쿠키가 갱신된 supabaseResponse를 반환해야 함 ★★★
  return supabaseResponse
}
"use server"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js" // Added direct Supabase client for Service Role
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function signOutAction() {
  // ★ 핵심 수정: await를 붙여서 비동기로 쿠키 저장소를 가져옵니다.
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server Action에서 쿠키 설정 중 에러가 발생해도 무시 (이미 응답이 시작되었을 수 있음)
          }
        },
      },
    },
  )

  // 1. 서버 측 세션 종료
  await supabase.auth.signOut()

  // 2. 메인 페이지로 리다이렉트 (쿠키 삭제 헤더 포함)
  redirect("/")
}

export async function updatePasswordAction(newPassword: string) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Ignore cookie setting errors
          }
        },
      },
    },
  )

  // Update password via Supabase Auth
  const { error: authError } = await supabase.auth.updateUser({ password: newPassword })

  if (authError) {
    return { error: authError.message }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not found" }
  }

  // Update last_pw_change in database
  const { error: dbError } = await supabase
    .from("users")
    .update({ last_pw_change: new Date().toISOString() })
    .eq("id", user.id)

  if (dbError) {
    console.error("DB update error:", dbError)
    // Don't fail if DB update fails, password was already changed
  }

  return { error: null }
}

export async function registerCodeAction(code: string, userId: string) {
  console.log("[v0] registerCodeAction called with code:", code, "userId:", userId)

  try {
    if (!userId) {
      console.error("[v0] No userId provided")
      return { error: "로그인이 필요합니다." }
    }

    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("[v0] Created admin client with Service Role Key")

    // Fetch registration code using Service Role Key (bypasses RLS)
    console.log("[v0] Fetching registration code from database...")
    const { data: codeData, error: fetchError } = await supabaseAdmin
      .from("registration_codes")
      .select("*")
      .eq("code", code)
      .maybeSingle()

    console.log("[v0] Code fetch result:", { codeData, fetchError })

    if (fetchError) {
      console.error("[v0] Fetch error:", fetchError)
      return { error: "코드 조회 중 오류가 발생했습니다." }
    }

    if (!codeData) {
      console.error("[v0] Code not found")
      return { error: "유효하지 않은 코드입니다." }
    }

    if (codeData.is_used) {
      console.error("[v0] Code already used")
      return { error: "이미 사용된 코드입니다." }
    }

    console.log("[v0] Code is valid, role:", codeData.role)

    const { error: updateError } = await supabaseAdmin
      .from("registration_codes")
      .update({
        is_used: true,
        used_by_user_id: userId,
        used_at: new Date().toISOString(),
      })
      .eq("id", codeData.id)

    console.log("[v0] Code update result:", { updateError })

    if (updateError) {
      console.error("[v0] Update error:", updateError)
      return { error: "코드 업데이트에 실패했습니다." }
    }

    console.log("[v0] Code registered successfully, trigger should update user role")
    return { error: null }
  } catch (error: any) {
    console.error("[v0] Unexpected error in registerCodeAction:", error)
    return { error: error.message || "예상치 못한 오류가 발생했습니다." }
  }
}

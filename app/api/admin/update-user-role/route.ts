import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// admin-key를 사용하여 Supabase Admin 클라이언트 생성
// 이 클라이언트는 RLS(Row Level Security) 정책을 우회합니다.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // .env.local 파일에 이 키가 있어야 합니다.
)

export async function POST(request: Request) {
  const { userId, role } = await request.json()

  if (!userId || !role) {
    return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 })
  }

  // 유효한 역할인지 확인
  if (!['admin', 'user', 'child'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  try {
    // 'public.users' 테이블에서 해당 사용자의 'role'을 업데이트합니다.
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ role: role })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ message: 'User role updated successfully', data }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
import { createServerClient } from '@supabase/ssr'; 
import { createClient } from '@supabase/supabase-js'; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required Supabase environment variables for permission update.');
}

// Admin 권한으로 Supabase 클라이언트 생성
const supabaseAdmin = createClient<any>(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req: Request) {
  try {
    // [수정] adminPassword 제거. 토글 기능에는 비밀번호 확인이 불편하므로 세션 권한 체크로 대체합니다.
    const { userId, can_comment } = await req.json(); 

    if (!userId || typeof can_comment !== 'boolean') {
      return NextResponse.json({ error: 'User ID and can_comment status are required.' }, { status: 400 });
    }

    // [중요] 현재 로그인된 사용자가 실제 Admin인지 확인
    const cookieStore = await cookies(); 
    
    const supabase = createServerClient<any>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // 미들웨어 등에서 처리하므로 여기선 무시 가능
          },
        },
      }
    );

    // 세션 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // DB에서 역할(Role) 확인
    const { data: currentUserProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profileError || currentUserProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Permission denied: Only administrators can modify user permissions.' }, { status: 403 });
    }

    // 권한 업데이트 실행
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        can_comment: can_comment, 
        updated_at: new Date().toISOString() 
      }) 
      .eq('id', userId);

    if (updateError) {
      console.error('Supabase update error:', updateError.message);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'User permission updated successfully.' });

  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
// app/api/admin/update-user-permission/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
import { createServerClient } from '@supabase/ssr'; 
import { Database } from '@/lib/supabase'; 
import { createClient } from '@supabase/supabase-js'; 
import * as crypto from 'crypto'; 


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// const adminPasswordEnv = process.env.ADMIN_PASSWORD; // ✅ 제거: 환경 변수 참조 제거

if (!supabaseUrl || !supabaseServiceRoleKey) { // ✅ 수정: adminPasswordEnv 체크 제거
    console.error('Missing required Supabase or admin password environment variables for permission update.');
}

const supabaseAdmin = createClient<Database>(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function checkPasswordExpiration(passwordSetDate: string | null): boolean {
  if (!passwordSetDate) {
    return true; 
  }
  const setDate = new Date(passwordSetDate);
  const nowUtc = new Date(new Date().toUTCString()); 
  const oneMonthLater = new Date(setDate);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1); 

  return nowUtc > oneMonthLater; 
}

export async function POST(req: Request) {
  try {
    const { userId, can_comment, adminPassword } = await req.json(); 

    if (!userId || typeof can_comment !== 'boolean' || !adminPassword) {
      return NextResponse.json({ error: 'User ID, can_comment status, and admin password are required.' }, { status: 400 });
    }

    // 1. admin_settings에서 저장된 비밀번호 해시와 설정 날짜 가져오기 (✅ 추가)
    const { data: adminSettings, error: settingsError } = await supabaseAdmin
      .from('admin_settings')
      .select('delete_password_hash, password_set_date')
      .eq('id', 1)
      .single();

    if (settingsError || !adminSettings) {
      console.error('Error fetching admin settings or settings not found:', settingsError);
      return NextResponse.json(
        { error: 'Admin settings not configured. Please set the admin password first.' },
        { status: 500 }
      );
    }

    // 2. 관리자 비밀번호 만료 확인 (✅ 추가)
    if (checkPasswordExpiration(adminSettings.password_set_date)) {
      return NextResponse.json(
        { error: 'Admin password has expired. Please update it in Admin Settings.' },
        { status: 403 }
      );
    }

    // 3. 입력된 비밀번호를 해싱하여 저장된 해시와 비교 (✅ 수정)
    const hashedAdminPasswordInput = hashPassword(adminPassword);
    if (hashedAdminPasswordInput !== adminSettings.delete_password_hash) { // ✅ 수정: adminPasswordEnv 대신 adminSettings.delete_password_hash 사용
      return NextResponse.json({ error: 'Incorrect admin password.' }, { status: 403 });
    }

    // 4. 현재 로그인된 사용자가 관리자인지 확인 (세션 기반)
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: () => {}, 
          remove: () => {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const { data: currentUserProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profileError || currentUserProfile?.role !== 'admin') {
      console.error('Permission denied: Not an admin.', profileError);
      return NextResponse.json({ error: 'Permission denied: Only administrators can modify user permissions.' }, { status: 403 });
    }

    // 5. public.users 테이블에서 can_comment 필드 업데이트
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ can_comment: can_comment, updated_at: new Date().toISOString() }) 
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

// app/api/admin/delete-user/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/supabase'; 
import * as crypto from 'crypto'; // ✅ 추가: crypto 모듈 임포트

// Supabase 서비스 역할 키와 관리자 비밀번호를 환경 변수에서 가져옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ADMIN_PASSWORD 환경 변수는 이제 초기 설정이나 비상용으로만 사용되며,
// 실제 비밀번호는 데이터베이스의 admin_settings 테이블에 해시되어 저장됩니다.
// const adminPasswordEnv = process.env.ADMIN_PASSWORD; // ✅ 제거
// const adminPasswordLastChangedAt = process.env.ADMIN_PASSWORD_LAST_CHANGED_AT; // ✅ 제거

if (!supabaseUrl || !supabaseServiceRoleKey) { // ✅ 수정: 환경 변수 누락 체크
    console.error('Missing required Supabase environment variables for admin operations.');
    // In a real app, you might want to return an error here if these are missing.
}

// createClient에 Database 타입을 적용합니다.
const supabaseAdmin = createClient<Database>(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ✅ 추가: 비밀번호 해싱 함수 (SHA-256)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ✅ 추가: 비밀번호 만료 확인 함수 (password_set_date와 비교)
function checkPasswordExpiration(passwordSetDate: string | null): boolean {
  if (!passwordSetDate) {
    // 비밀번호 설정 날짜가 없으면 (초기 상태이거나 문제 발생 시) 만료된 것으로 간주하여 설정을 강제
    return true; 
  }
  const setDate = new Date(passwordSetDate);
  const oneMonthLater = new Date(setDate);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1); 

  return new Date() > oneMonthLater; 
}

export async function POST(req: Request) {
  try {
    const { userId, adminPassword } = await req.json(); 

    if (!userId || !adminPassword) {
      return NextResponse.json({ error: 'User ID and admin password are required' }, { status: 400 });
    }

    // 1. admin_settings에서 저장된 비밀번호 해시와 설정 날짜 가져오기
    const { data: adminSettings, error: settingsError } = await supabaseAdmin
      .from('admin_settings')
      .select('delete_password_hash, password_set_date')
      .eq('id', 1) // admin_settings 테이블은 id가 1인 단일 행을 가정
      .single();

    if (settingsError || !adminSettings) {
      console.error('Error fetching admin settings or settings not found:', settingsError);
      return NextResponse.json(
        { error: 'Admin settings not configured. Please set the admin password first.' },
        { status: 500 }
      );
    }

    // 2. 관리자 비밀번호 만료 확인
    if (checkPasswordExpiration(adminSettings.password_set_date)) {
      return NextResponse.json(
        { error: 'Admin password has expired. Please update it in Admin Settings.' },
        { status: 403 }
      );
    }

    // 3. 입력된 비밀번호를 해싱하여 저장된 해시와 비교
    const hashedAdminPasswordInput = hashPassword(adminPassword);
    if (hashedAdminPasswordInput !== adminSettings.delete_password_hash) {
      return NextResponse.json({ error: 'Incorrect admin password.' }, { status: 403 });
    }

    // 4. Supabase Auth에서 사용자 삭제
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Supabase Auth Delete Error:', authError.message);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

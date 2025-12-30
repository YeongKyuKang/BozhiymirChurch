import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
import { createServerClient } from '@supabase/ssr'; 
// Database import가 있어도 사용하지 않으면 상관없지만, 확실하게 하기 위해 타입을 any로 풉니다.
// import { Database } from '@/lib/supabase'; 
import { createClient } from '@supabase/supabase-js'; 
import * as crypto from 'crypto'; 

// ▼▼▼ 로컬 타입 정의 (이 파일 전용) ▼▼▼
type AdminSettingsRow = {
  id: number;
  delete_password_hash: string | null;
  password_set_date: string | null;
  password_history_hashes: string[] | null;
  created_at: string;
  updated_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required Supabase or admin password environment variables for permission update.');
}

// ▼▼▼ [핵심 수정] <Database>를 <any>로 바꿔서 테이블 검사를 아예 끕니다. ▼▼▼
const supabaseAdmin = createClient<any>(supabaseUrl!, supabaseServiceRoleKey!, {
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

    // 1. admin_settings 데이터 가져오기
    // createClient<any>를 썼기 때문에 .from('admin_settings')에서 에러가 나지 않습니다.
    const { data, error: settingsError } = await supabaseAdmin
      .from('admin_settings')
      .select('delete_password_hash, password_set_date')
      .eq('id', 1)
      .single();

    if (settingsError || !data) {
      console.error('Error fetching admin settings or settings not found:', settingsError);
      return NextResponse.json(
        { error: 'Admin settings not configured. Please set the admin password first.' },
        { status: 500 }
      );
    }

    // 가져온 데이터를 우리가 정의한 타입으로 변환 (자동완성 활성화)
    const adminSettings = data as unknown as AdminSettingsRow;

    // 2. 관리자 비밀번호 만료 확인
    if (checkPasswordExpiration(adminSettings.password_set_date)) {
      return NextResponse.json(
        { error: 'Admin password has expired. Please update it in Admin Settings.' },
        { status: 403 }
      );
    }

    // 3. 비밀번호 검증
    const hashedAdminPasswordInput = hashPassword(adminPassword);
    if (hashedAdminPasswordInput !== adminSettings.delete_password_hash) {
      return NextResponse.json({ error: 'Incorrect admin password.' }, { status: 403 });
    }

    // 4. 현재 로그인된 사용자 확인 (Next.js 15 대응)
    const cookieStore = await cookies(); 
    
    // 유저 확인용 클라이언트는 일반적인 타입을 써도 되지만, 충돌 방지를 위해 여기서도 any를 쓰거나
    // Database 타입을 쓰려면 import가 필요합니다. 여기서는 안전하게 any로 갑니다.
    const supabase = createServerClient<any>(
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
              // Ignore
            }
          },
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
      return NextResponse.json({ error: 'Permission denied: Only administrators can modify user permissions.' }, { status: 403 });
    }

    // 5. 권한 업데이트
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
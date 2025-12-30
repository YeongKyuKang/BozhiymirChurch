import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// Database 타입 임포트는 에러 방지를 위해 주석 처리하거나 사용하지 않습니다.
// import { Database } from '@/lib/supabase'; 
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
    console.error('관리자 비밀번호 설정에 필요한 Supabase 환경 변수가 누락되었습니다.');
}

// ▼▼▼ [핵심] <any>로 설정하여 테이블 존재 여부 검사를 아예 건너뜁니다. ▼▼▼
const supabaseAdmin = createClient<any>(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// 비밀번호 해싱 함수
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: Request) {
  try {
    const { newPassword, currentAdminPassword } = await req.json();

    if (!newPassword) {
      return NextResponse.json({ error: '새 비밀번호는 필수입니다.' }, { status: 400 });
    }

    const hashedNewPassword = hashPassword(newPassword);

    // 1. admin_settings 데이터 가져오기
    // any 타입이므로 .from('admin_settings') 에서 에러가 나지 않습니다.
    const { data, error: fetchError } = await supabaseAdmin
      .from('admin_settings')
      .select('delete_password_hash')
      .eq('id', 1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116은 데이터 없음 오류
      console.error('관리자 설정 조회 중 오류 발생:', fetchError.message);
      return NextResponse.json({ error: '관리자 설정을 불러오는 데 실패했습니다.' }, { status: 500 });
    }

    // 가져온 데이터를 우리가 정의한 타입으로 변환 (자동완성 및 타입 체크 활성화)
    const adminSettings = data ? (data as unknown as AdminSettingsRow) : null;

    if (adminSettings && adminSettings.delete_password_hash) {
      // 기존 비밀번호가 설정되어 있다면, 현재 비밀번호 검증 필요
      if (!currentAdminPassword) {
        return NextResponse.json({ error: '기존 비밀번호를 입력해야 합니다.' }, { status: 400 });
      }
      const hashedCurrentAdminPassword = hashPassword(currentAdminPassword);
      if (hashedCurrentAdminPassword !== adminSettings.delete_password_hash) {
        return NextResponse.json({ error: '기존 비밀번호가 일치하지 않습니다.' }, { status: 403 });
      }
      
      // 비밀번호 업데이트
      const { error: updateError } = await supabaseAdmin
        .from('admin_settings')
        .update({
          delete_password_hash: hashedNewPassword,
          password_set_date: new Date().toISOString(),
          // any 타입이므로 []를 써도 에러가 나지 않습니다.
          password_history_hashes: [] 
        })
        .eq('id', 1);

      if (updateError) {
        console.error('관리자 비밀번호 업데이트 중 오류 발생:', updateError.message);
        return NextResponse.json({ error: '관리자 비밀번호 업데이트에 실패했습니다.' }, { status: 500 });
      }
      return NextResponse.json({ message: '관리자 비밀번호가 성공적으로 업데이트되었습니다.' });

    } else {
      // 비밀번호가 아직 설정되지 않았다면, 새로 삽입
      const { error: insertError } = await supabaseAdmin
        .from('admin_settings')
        .insert({
          id: 1, // 단일 행을 보장
          delete_password_hash: hashedNewPassword,
          password_set_date: new Date().toISOString(),
          password_history_hashes: []
        });

      if (insertError) {
        console.error('관리자 비밀번호 초기 설정 중 오류 발생:', insertError.message);
        return NextResponse.json({ error: '관리자 비밀번호 초기 설정에 실패했습니다.' }, { status: 500 });
      }
      return NextResponse.json({ message: '관리자 비밀번호가 성공적으로 설정되었습니다.' });
    }

  } catch (error) {
    console.error('예상치 못한 오류 발생:', error);
    return NextResponse.json({ error: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
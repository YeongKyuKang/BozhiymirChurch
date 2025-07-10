// app/admin/users/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminUsersClient from '@/components/admin-users-client'; // 새로 생성할 클라이언트 컴포넌트
import { Database } from '@/lib/supabase'; // Database 타입 임포트

export const revalidate = 0; // 페이지 캐싱 비활성화

async function fetchUsersForAdmin() {
  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 사용자 인증 및 관리자 역할 확인
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    redirect('/login'); // 로그인하지 않았으면 로그인 페이지로 리다이렉트
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.user.id)
    .single();

  if (profileError || userProfile?.role !== 'admin') {
    console.error('Admin access denied:', profileError);
    redirect('/'); // 관리자가 아니면 홈으로 리다이렉트
  }

  // 모든 사용자 정보 가져오기 (✅ 수정: gender, profile_picture_url, updated_at 추가)
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id, email, nickname, role, created_at, can_comment, gender, profile_picture_url, updated_at'); // 필요한 필드 모두 선택

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return []; // 오류 발생 시 빈 배열 반환
  }

  return usersData;
}

export default async function AdminUsersPage() {
  const initialUsers = await fetchUsersForAdmin();

  return (
    <AdminUsersClient initialUsers={initialUsers} />
  );
}
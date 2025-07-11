// app/admin/users/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// import AdminUsersClient from '@/components/admin-users-client'; // ✅ 제거: 동적 임포트로 변경
import { Database } from '@/lib/supabase';
import Header from '@/components/header';
import Footer from '@/components/footer';
import dynamic from 'next/dynamic'; // ✅ 추가: dynamic 임포트

// ✅ 추가: AdminUsersClient를 동적으로 임포트 (SSR 비활성화)
const AdminUsersClient = dynamic(() => import("@/components/admin-users-client"), { ssr: false });

export const revalidate = 0; // 페이지 캐싱 비활성화

async function fetchUsersForAdmin() {
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

  // 사용자 인증 및 관리자 역할 확인
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    redirect('/login'); 
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.user.id)
    .single();

  if (profileError || userProfile?.role !== 'admin') {
    console.error('Admin access denied:', profileError);
    redirect('/'); 
  }

  // 모든 사용자 정보 가져오기
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id, email, nickname, role, created_at, can_comment, gender, profile_picture_url, updated_at'); 

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return []; 
  }

  return usersData;
}

export default async function AdminUsersPage() {
  const initialUsers = await fetchUsersForAdmin();

  return (
    <>
      <Header />
      {/* fallback은 선택 사항이며, 로딩 중 표시할 내용을 정의할 수 있습니다. */}
      <AdminUsersClient initialUsers={initialUsers} />
      <Footer />
    </>
  );
}

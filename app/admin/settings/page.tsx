// app/admin/settings/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/lib/supabase'; // Database 타입 임포트

export const revalidate = 0; // 페이지 캐싱 비활성화

async function checkAdminAccess() {
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
}

export default async function AdminSettingsPage() {
  await checkAdminAccess(); // 관리자 권한 확인

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8 pt-24 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">관리자 설정</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            관리자 계정 및 시스템 관련 설정을 구성하는 페이지입니다.
            현재 페이지는 준비 중입니다.
          </p>
          <Button asChild>
            <Link href="/admin">관리자 대시보드로 돌아가기</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
// app/admin/content-edit/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/lib/supabase';
import { ArrowLeft } from "lucide-react"; // ArrowLeft 아이콘 추가

export const revalidate = 0;

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
}

export default async function AdminContentEditPage() {
  await checkAdminAccess();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8 pt-24 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">콘텐츠 설정</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            웹사이트의 다양한 페이지 콘텐츠를 직접 편집하고 관리하는 페이지입니다.
            현재 페이지는 준비 중입니다.
          </p>
          <Button asChild>
            <Link href="/admin">관리자 대시보드로 돌아가기</Link>
          </Button>
          {/* 뒤로가기 버튼 추가 - Link 컴포넌트를 사용합니다. */}
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로가기
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

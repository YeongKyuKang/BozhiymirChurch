// app/admin/contact-forms/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminContactFormsClient from '@/components/admin-contact-forms-client'; // 클라이언트 컴포넌트 임포트
import { Database } from '@/lib/supabase'; // Database 타입 임포트

export const revalidate = 0; // 페이지 캐싱 비활성화

async function fetchContactForms() {
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

  // contact_forms 데이터 가져오기 (is_read가 false인 것을 먼저, 그 다음 created_at 내림차순)
  const { data: contactForms, error: formsError } = await supabase
    .from('contact_forms')
    .select('*')
    .order('is_read', { ascending: true }) // 읽지 않은 것 먼저
    .order('created_at', { ascending: false }); // 최신순

  if (formsError) {
    console.error('Error fetching contact forms:', formsError);
    return []; // 오류 발생 시 빈 배열 반환
  }

  // Json 타입으로 저장된 interests를 파싱합니다.
  const parsedContactForms = contactForms.map(form => ({
    ...form,
    interests: typeof form.interests === 'string' ? JSON.parse(form.interests) : form.interests
  }));

  return parsedContactForms;
}

export default async function AdminContactFormsPage() {
  const initialContactForms = await fetchContactForms();

  return (
    <AdminContactFormsClient initialContactForms={initialContactForms} />
  );
}
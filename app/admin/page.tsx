// app/admin/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Settings, User, MessageSquareText, MailCheck } from 'lucide-react'; // MailCheck 아이콘 추가
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Badge 컴포넌트 임포트
import { Database } from '@/lib/supabase'; // Database 타입 임포트

export const revalidate = 0; // 페이지 캐싱 비활성화

async function fetchAdminData() {
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
    console.error('Admin check failed:', profileError);
    redirect('/'); // 관리자가 아니면 홈으로 리다이렉트
  }

  // 읽지 않은 contact_forms 개수 가져오기
  const { count: unreadContactFormsCount, error: countError } = await supabase
    .from('contact_forms')
    .select('id', { count: 'exact' })
    .eq('is_read', false);

  if (countError) {
    console.error('Error fetching unread contact forms count:', countError);
    // 오류 발생 시 카운트를 0으로 처리하거나 적절하게 처리
  }

  return { unreadContactFormsCount: unreadContactFormsCount || 0 };
}

export default async function AdminPage() {
  const { unreadContactFormsCount } = await fetchAdminData();

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 사용자 관리 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" /> <span>User Management</span>
              </CardTitle>
              <CardDescription>Manage user accounts and roles.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/users">Go to Users</Link>
              </Button>
            </CardContent>
          </Card>

          {/* 문의 관리 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquareText className="h-5 w-5" /> <span>Contact Forms</span>
                {unreadContactFormsCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadContactFormsCount} New
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>View and manage submitted contact forms.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/contact-forms">View Forms</Link>
              </Button>
            </CardContent>
          </Card>

          {/* 콘텐츠 편집 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" /> <span>Content Settings</span>
              </CardTitle>
              <CardDescription>Edit page content directly.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/content-edit">Edit Content</Link> {/* 필요시 해당 라우트 추가 */}
              </Button>
            </CardContent>
          </Card>
          
          {/* 관리자 설정 카드 (새로운 delete-password 설정 관련) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" /> <span>Admin Settings</span>
              </CardTitle>
              <CardDescription>Configure admin-level settings like delete password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/settings">Go to Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
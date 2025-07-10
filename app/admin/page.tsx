// app/admin/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Settings, User, MessageSquareText, MailCheck, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/supabase';

export const revalidate = 0;

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
    redirect('/');
  }

  const { count: unreadContactFormsCount, error: countError } = await supabase
    .from('contact_forms')
    .select('id', { count: 'exact' })
    .eq('is_read', false);

  if (countError) {
    console.error('Error fetching unread contact forms count:', countError);
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
                {/* ✅ 수정: Link 컴포넌트의 자식을 명시적으로 단일 <span>으로 감싸기 */}
                <Link href="/admin/users"><span>Go to Users</span></Link>
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
                {/* ✅ 수정: Link 컴포넌트의 자식을 명시적으로 단일 <span>으로 감싸기 */}
                <Link href="/admin/contact-forms"><span>View Forms</span></Link>
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
                {/* ✅ 수정: Link 컴포넌트의 자식을 명시적으로 단일 <span>으로 감싸기 */}
                <Link href="/admin/content-edit"><span>Edit Content</span></Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* 말씀 게시물 관리 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" /> <span>Daily Word Posts</span>
              </CardTitle>
              <CardDescription>Create and manage daily word posts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                {/* ✅ 수정: Link 컴포넌트의 자식을 명시적으로 단일 <span>으로 감싸기 */}
                <Link href="/admin/word-posts"><span>Manage Posts</span></Link>
              </Button>
            </CardContent>
          </Card>

          {/* 관리자 설정 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" /> <span>Admin Settings</span>
              </CardTitle>
              <CardDescription>Configure admin-level settings like delete password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                {/* ✅ 수정: Link 컴포넌트의 자식을 명시적으로 단일 <span>으로 감싸기 */}
                <Link href="/admin/settings"><span>Go to Settings</span></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
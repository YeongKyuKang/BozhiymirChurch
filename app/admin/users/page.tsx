// app/admin/users/page.tsx
// 이 파일에는 "use client"; 지시자가 없어야 합니다.

// import Header from "@/components/header"; // Header 임포트 제거
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import dynamic from 'next/dynamic';
import { Database } from "@/lib/supabase";
import { Button } from "@/components/ui/button"; // Button 임포트 유지 (뒤로가기 버튼 스타일링용)
import { ArrowLeft } from "lucide-react"; // ArrowLeft 아이콘 임포트 유지
import Link from "next/link"; // Link 임포트 추가 (뒤로가기 버튼 기능용)

// 클라이언트 컴포넌트를 동적으로 임포트 (SSR 비활성화)
const AdminUsersClient = dynamic(() => import("@/components/admin-users-client"), { ssr: false });

interface UserProfile {
  id: string;
  email: string;
  nickname: string | null;
  role: string | null;
  created_at: string;
  can_comment: boolean;
}

async function fetchUsersData() {
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

  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      nickname,
      role,
      created_at,
      can_comment
    `);

  if (error) {
    console.error("Error fetching users on server:", error);
    return [];
  }

  return data as UserProfile[];
}

export default async function AdminUsersPage() {
  const initialUsers = await fetchUsersData();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 pt-24 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* 뒤로가기 버튼을 좌측 상단에 배치 */}
          <div className="mb-8"> {/* 제목 위쪽에 여백 추가 */}
            <Button
              asChild // Link 컴포넌트를 Button처럼 스타일링
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              // onClick 대신 Link의 href 사용
            >
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로가기
              </Link>
            </Button>
          </div>
          <AdminUsersClient initialUsers={initialUsers} />
        </div>
      </div>
      <Footer />
    </>
  );
}

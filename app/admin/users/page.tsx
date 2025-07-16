// app/admin/users/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import dynamic from 'next/dynamic';
import { Database } from "@/lib/supabase";

// 클라이언트 컴포넌트를 동적으로 임포트 (SSR 비활성화)
const AdminUsersClient = dynamic(() => import("@/components/admin-users-client"), { ssr: false });

interface UserProfile {
  id: string;
  email: string;
  nickname: string | null;
  role: string | null;
  created_at: string;
  last_sign_in_at: string | null;
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
    .from('profiles')
    .select(`
      id,
      email,
      nickname,
      role,
      created_at,
      last_sign_in_at
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
      <Header />
      <AdminUsersClient initialUsers={initialUsers} />
      <Footer />
    </>
  );
}

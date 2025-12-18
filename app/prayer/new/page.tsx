// app/prayer/new/page.tsx
import PrayerRequestForm from "@/components/prayer-request-form";
import { createServerClient, type CookieOptions } from "@supabase/ssr"; 
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewPrayerRequestPage() {
  const cookieStore = await cookies(); // 수정: cookies() 호출 앞에 await 추가

  const supabase = createServerClient(
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
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?redirect_to=/prayer/new");
  }

  // 로그인한 사용자에게만 폼을 보여줍니다.
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16 pt-32 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          새 기도 요청 추가
        </h1>
        <PrayerRequestForm />
      </div>
    </div>
  );
}

// app/prayer/new/page.tsx
import PrayerRequestForm from "@/components/prayer-request-form";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewPrayerRequestPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트 시 redirect_to 쿼리 파라미터 추가
    // 사용자가 로그인 후 다시 이 페이지로 돌아올 수 있도록 합니다.
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
// app/api/contact/route.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { first_name, last_name, email, phone, interests, message } = await request.json();

  const cookieStore = cookies();

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

  // 서버 측 유효성 검사 (기본적인 필수 필드 확인)
  if (!first_name || !last_name || !email) {
    return NextResponse.json({ error: 'First name, Last name, and Email are required.' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('contact_forms')
      .insert([
        {
          first_name,
          last_name,
          email,
          phone,
          interests: interests || [], // interests가 없을 경우 빈 배열로 저장
          message,
        },
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save contact form data.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Contact form submitted successfully!' }, { status: 200 });
  } catch (err) {
    console.error('API catch error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
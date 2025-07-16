// app/api/contact/route.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 변경: 클라이언트에서 보내는 필드명에 맞춰 구조 분해
  const { first_name, last_name, email, phone, age_group, interests, message, receive_updates, type, subject } = await request.json();

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

  // 서버 측 유효성 검사 (필수 필드 확인)
  if (!first_name || !last_name || !email || !age_group || !interests || interests.length === 0 || !message) {
    return NextResponse.json({ error: 'First name, Last name, Email, Age Group, Interests, and Message are required.' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('contact_forms')
      .insert([
        {
          first_name,
          last_name,
          email,
          phone: phone || null, // phone이 없을 경우 null
          age_group, // 추가
          interests: interests || [],
          message,
          receive_updates: receive_updates || false, // 추가
          type: type || null, // 추가
          subject: subject || null, // 추가
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

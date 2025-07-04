// app/thanks/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr"; 
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import ThanksPageClient from "@/components/thanks-page-client";

export const revalidate = 60; 

// Next.js PageProps 타입을 정의하여 searchParams의 타입을 명확히 합니다.
// Next.js 13의 App Router에서 searchParams는 이미 해결된 객체로 전달됩니다.
interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined }; // Promise<any> 제거
}

async function fetchThanksContentAndPosts(searchParams: { [key: string]: string | string[] | undefined }) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          // 이 함수는 데이터를 읽기만 하므로 set/remove는 필요하지 않습니다.
        },
        remove: (name: string, options: CookieOptions) => {
          // 이 함수는 데이터를 읽기만 하므로 set/remove는 필요하지 않습니다.
        },
      },
    }
  );

  const { data: contentData, error: contentError } = await supabase
    .from("content")
    .select("*")
    .eq("page", "thanks");

  const contentMap: Record<string, any> = {};
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  if (contentError) {
    console.error("Error fetching Thanks page content:", contentError);
  }

  // searchParams는 이미 해결된 객체로 전달되므로 Promise.resolve()가 필요 없습니다.
  const { time, role, date, sort, timezoneOffset } = searchParams; // Promise.resolve 제거

  const timeFilter = time as string || 'latest';
  const roleFilter = role as string || 'all';
  const dateFilter = date as string;
  const sortBy = sort as string || 'created_at_desc';
  const clientTimezoneOffset = timezoneOffset ? parseInt(timezoneOffset as string) : null;

  let query = supabase
    .from("thanks_posts")
    .select('*, thanks_reactions(*), thanks_comments(*), author:users(role)');

  if (roleFilter !== 'all') {
    query = query.filter('author.role', 'eq', roleFilter);
  }

  if (dateFilter) {
    const year = parseInt(dateFilter.substring(0, 4));
    const month = parseInt(dateFilter.substring(5, 7)) - 1;
    const day = parseInt(dateFilter.substring(8, 10));

    let startOfDayUTC: string;
    let endOfDayUTC: string;

    if (clientTimezoneOffset !== null) {
      const startOfLocalDay = new Date(year, month, day, 0, 0, 0);
      startOfLocalDay.setMinutes(startOfLocalDay.getMinutes() - clientTimezoneOffset);
      startOfDayUTC = startOfLocalDay.toISOString();

      const endOfLocalDay = new Date(year, month, day, 23, 59, 59, 999);
      endOfLocalDay.setMinutes(endOfLocalDay.getMinutes() - clientTimezoneOffset);
      endOfDayUTC = endOfLocalDay.toISOString();

    } else {
      const selectedDateUTC = new Date(Date.UTC(year, month, day));
      startOfDayUTC = selectedDateUTC.toISOString();
      selectedDateUTC.setUTCDate(selectedDateUTC.getUTCDate() + 1);
      selectedDateUTC.setUTCMilliseconds(selectedDateUTC.getUTCMilliseconds() - 1);
      endOfDayUTC = selectedDateUTC.toISOString();
    }

    query = query.gte('created_at', startOfDayUTC).lte('created_at', endOfDayUTC);
  }

  if (sortBy === 'created_at_desc') {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === 'created_at_asc') {
    query = query.order("created_at", { ascending: true });
  }

  const { data: thanksPostsData, error: thanksPostsError } = await query;

  if (thanksPostsError) {
    console.error("Error fetching Thanks posts:", thanksPostsError);
  }

  const processedThanksPosts = thanksPostsData?.map(post => ({
    ...post,
    author_role: post.author ? (post.author as { role: string | null }).role : null,
  })) || [];


  return {
    content: contentMap,
    thanksPosts: processedThanksPosts,
  };
}

export default async function ThanksPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();

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

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { content, thanksPosts } = await fetchThanksContentAndPosts(searchParams || {});

  return (
    <>
      <Header />
      <ThanksPageClient initialContent={content} initialThanksPosts={thanksPosts} /> 
      <Footer />
    </>
  );
}

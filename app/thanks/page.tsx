// app/thanks/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ThanksPageClient from "@/components/thanks-page-client";
import { format } from "date-fns"; // format 함수 임포트
import { toZonedTime, formatInTimeZone } from 'date-fns-tz'; // toZonedTime, formatInTimeZone 임포트

// 폴란드 시간대 정의
const POLAND_TIMEZONE = 'Europe/Warsaw';

async function fetchThanksContentAndPosts(searchParams: Record<string, string | string[]>) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
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

  const { role, date, sort, timezoneOffset } = searchParams;

  // 기본값 설정: 역할은 'all', 정렬은 'created_at_desc' (최신순)
  const roleFilter = (Array.isArray(role) ? role[0] : role) || "all";
  const sortBy = (Array.isArray(sort) ? sort[0] : sort) || "created_at_desc";

  // 날짜 필터 기본값 설정: searchParams에 없으면 오늘 폴란드 날짜로 설정
  let dateFilter = Array.isArray(date) ? date[0] : date;
  if (!dateFilter) {
    const nowInPoland = toZonedTime(new Date(), POLAND_TIMEZONE);
    dateFilter = format(nowInPoland, 'yyyy-MM-dd'); // 'YYYY-MM-DD' 형식으로 설정
  }
  
  const clientTimezoneOffset = timezoneOffset
    ? parseInt(Array.isArray(timezoneOffset) ? timezoneOffset[0] : timezoneOffset)
    : null;

  let query = supabase
    .from("thanks_posts")
    .select("*, thanks_reactions(*), thanks_comments(*), author:users(role)");

  // 이전의 roleFilter에 따른 쿼리 필터링 제거 (Node.js 레벨에서 필터링)
  // if (roleFilter !== "all") {
  //   query = query.filter("author.role", "eq", roleFilter);
  // }

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
      // 클라이언트 타임존 오프셋이 없으면, 단순히 YYYY-MM-DD를 UTC 자정으로 간주
      const selectedDateUTC = new Date(Date.UTC(year, month, day));
      startOfDayUTC = selectedDateUTC.toISOString();
      selectedDateUTC.setUTCDate(selectedDateUTC.getUTCDate() + 1);
      selectedDateUTC.setUTCMilliseconds(selectedDateUTC.getUTCMilliseconds() - 1);
      endOfDayUTC = selectedDateUTC.toISOString();
    }

    query = query.gte("created_at", startOfDayUTC).lte("created_at", endOfDayUTC);
  }

  if (sortBy === "created_at_desc") {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === "created_at_asc") {
    query = query.order("created_at", { ascending: true });
  }

  const { data: thanksPostsData, error: thanksPostsError } = await query;

  if (thanksPostsError) {
    console.error("Error fetching Thanks posts:", thanksPostsError);
  }

  let processedThanksPosts = thanksPostsData;

  // ✅ 추가: 서버 측에서 역할 필터링 적용
  if (roleFilter !== "all" && processedThanksPosts) {
    processedThanksPosts = processedThanksPosts.filter(post => post.author && (post.author as { role: string | null }).role === roleFilter);
  }

  const finalThanksPosts =
    processedThanksPosts?.map((post) => ({
      ...post,
      author_role: post.author ? (post.author as { role: string | null }).role : null,
    })) || [];

  return {
    content: contentMap,
    thanksPosts: finalThanksPosts,
  };
}

export default async function ThanksPageWrapper({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name, options) => {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { content, thanksPosts } = await fetchThanksContentAndPosts(searchParams ?? {});

  return (
    <>
      <Header />
      <ThanksPageClient initialContent={content} initialThanksPosts={thanksPosts} />
      <Footer />
    </>
  );
}
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

  const roleFilter = (Array.isArray(role) ? role[0] : role) || "all";
  const sortBy = (Array.isArray(sort) ? sort[0] : sort) || "created_at_desc";

  let dateFilter = Array.isArray(date) ? date[0] : date;
  if (!dateFilter) {
    const nowInPoland = toZonedTime(new Date(), POLAND_TIMEZONE);
    dateFilter = format(nowInPoland, 'yyyy-MM-dd');
  }
  
  const clientTimezoneOffset = timezoneOffset
    ? parseInt(Array.isArray(timezoneOffset) ? timezoneOffset[0] : timezoneOffset)
    : null;

  // category 컬럼을 select 쿼리에 추가
  let query = supabase
    .from("thanks_posts")
    .select("*, thanks_reactions(*), thanks_comments(*), author:users(role)"); // author:users(role)도 유지

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

  // 역할(이제 감사 카테고리) 필터링 로직 수정: post.author.role 대신 post.category 사용
  if (roleFilter !== "all" && processedThanksPosts) {
    processedThanksPosts = processedThanksPosts.filter(post => post.category === roleFilter);
  }

  const finalThanksPosts =
    processedThanksPosts?.map((post) => ({
      ...post,
      // author_role은 계속 필요할 수 있으므로, post.author가 있다면 가져옵니다.
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
      <ThanksPageClient initialContent={content} initialThanksPosts={thanksPosts} />
    </>
  );
}
// app/thanks/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr"; 
import { cookies } from "next/headers";
import ThanksPageClient from "@/components/thanks-page-client";

// 페이지 전체의 재검증 주기 설정 (예: 60초마다 자동으로 재검증)
export const revalidate = 60; 

// 감사 게시물 및 관련 데이터를 가져오는 함수
async function fetchThanksContentAndPosts(searchParams: { [key: string]: string | string[] | undefined }) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          cookieStore.set({ name, value: '', ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 'thanks' 페이지의 content 데이터 가져오기
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

  // searchParams의 속성에 접근하기 전에 완전히 로드되도록 합니다.
  const { time, role, date, sort, timezoneOffset } = await Promise.resolve(searchParams);

  const timeFilter = time as string || 'latest';
  const roleFilter = role as string || 'all';
  const dateFilter = date as string;
  const sortBy = sort as string || 'created_at_desc';
  const clientTimezoneOffset = timezoneOffset ? parseInt(timezoneOffset as string) : null; // 클라이언트 시간대 오프셋 (분 단위)

  // thanks_posts, thanks_reactions, thanks_comments, author_role 데이터를 함께 가져오기
  let query = supabase
    .from("thanks_posts")
    .select('*, thanks_reactions(*), thanks_comments(*), author:users(role)');

  // 역할 필터 적용
  if (roleFilter !== 'all') {
    query = query.filter('author.role', 'eq', roleFilter);
  }

  // 날짜 필터 적용: 클라이언트의 시간대 오프셋을 고려하여 UTC 범위로 변환
  if (dateFilter) {
    const year = parseInt(dateFilter.substring(0, 4));
    const month = parseInt(dateFilter.substring(5, 7)) - 1; // 월은 0부터 시작
    const day = parseInt(dateFilter.substring(8, 10));

    let startOfDayUTC: string;
    let endOfDayUTC: string;

    if (clientTimezoneOffset !== null) {
      // 클라이언트 시간대 오프셋이 제공되면 이를 사용하여 UTC 시간 계산
      // getTimezoneOffset()은 로컬 시간과 UTC의 차이를 분 단위로 반환합니다.
      // 예를 들어, KST(UTC+9)는 -540을 반환합니다.
      // Date.UTC는 항상 UTC를 기준으로 Date 객체를 생성합니다.
      // 따라서, 로컬 날짜의 자정을 UTC로 변환하려면 로컬 오프셋만큼 UTC 시간을 더해야 합니다.
      const startOfLocalDay = new Date(year, month, day, 0, 0, 0);
      startOfLocalDay.setMinutes(startOfLocalDay.getMinutes() - clientTimezoneOffset); // 오프셋 적용
      startOfDayUTC = startOfLocalDay.toISOString();

      const endOfLocalDay = new Date(year, month, day, 23, 59, 59, 999);
      endOfLocalDay.setMinutes(endOfLocalDay.getMinutes() - clientTimezoneOffset); // 오프셋 적용
      endOfDayUTC = endOfLocalDay.toISOString();

    } else {
      // 클라이언트 시간대 오프셋이 없으면 서버의 기본 UTC 기준으로 처리
      // 이 경우, 사용자가 캘린더에서 선택한 날짜가 서버의 UTC 시간 기준으로 해석됩니다.
      const selectedDateUTC = new Date(Date.UTC(year, month, day));
      startOfDayUTC = selectedDateUTC.toISOString();
      selectedDateUTC.setUTCDate(selectedDateUTC.getUTCDate() + 1);
      selectedDateUTC.setUTCMilliseconds(selectedDateUTC.getUTCMilliseconds() - 1);
      endOfDayUTC = selectedDateUTC.toISOString();
    }

    query = query.gte('created_at', startOfDayUTC).lte('created_at', endOfDayUTC);
  }

  // 정렬 기준 적용
  if (sortBy === 'created_at_desc') {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === 'created_at_asc') {
    query = query.order("created_at", { ascending: true });
  }

  const { data: thanksPostsData, error: thanksPostsError } = await query;

  if (thanksPostsError) {
    console.error("Error fetching Thanks posts:", thanksPostsError);
  }

  // Supabase 조인 결과에서 author 객체를 ThankPost 인터페이스에 맞게 변환
  const processedThanksPosts = thanksPostsData?.map(post => ({
    ...post,
    author_role: post.author ? (post.author as { role: string | null }).role : null,
  })) || [];


  return {
    content: contentMap,
    thanksPosts: processedThanksPosts, // 변환된 데이터를 반환
  };
}

// Thanks 페이지 컴포넌트
export default async function ThanksPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { content, thanksPosts } = await fetchThanksContentAndPosts(searchParams);

  return (
    <>
      <Header />
      <ThanksPageClient initialContent={content} initialThanksPosts={thanksPosts} /> 
      <Footer />
    </>
  );
}

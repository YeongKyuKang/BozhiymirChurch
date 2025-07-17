import WordPostsClient from "./word-posts-client";
import { Suspense } from "react";

// 이 페이지는 이제 서버에서 렌더링되지 않는 클라이언트 컴포넌트를
// Suspense 바운더리로 감싸서 안전하게 렌더링합니다.
export default function WordPostsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WordPostsClient />
    </Suspense>
  );
}
"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { createThanksPost, getThanksPageData } from "@/app/thanks/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Heart, Send, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface ThanksPageClientProps {
  initialContent: Record<string, any>;
  initialPosts: any[];
  initialTotalPages: number;
}

export default function ThanksPageClient({ 
  initialContent, 
  initialPosts, 
  initialTotalPages 
}: ThanksPageClientProps) {
  const { user, userProfile } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 페이지네이션 및 리스트 상태
  const [posts, setPosts] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  // 비동기 페이지 변경 함수 (새로고침 없이 리스트만 교체)
  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    const result = await getThanksPageData(page);
    setPosts(result.posts);
    setTotalPages(result.totalPages);
    setCurrentPage(page);
    setIsLoading(false);
    
    // 리스트 상단으로 부드럽게 스크롤
    const listElement = document.getElementById('thanks-list');
    if (listElement) {
      listElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 글 등록 핸들러
  const handleSubmit = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    if (!content.trim()) return alert("내용을 입력해주세요.");

    setIsSubmitting(true);
    // 닉네임과 함께 등록 (Server Action 호출)
    const result = await createThanksPost(content, user.id, userProfile?.nickname || "익명");
    
    if (result.success) {
      setContent("");
      alert("감사가 등록되었습니다!");
      // 1페이지로 리스트 갱신 (캐시 무효화 후 최신 데이터 가져옴)
      handlePageChange(1);
    } else {
      alert("오류 발생: " + result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20">
      {/* Hero Section */}
      <section className="py-16 bg-white border-b mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-4 text-slate-900 italic">
            {initialContent?.hero?.title || "Thanks & Gratitude"}
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            {initialContent?.hero?.description || "오늘 하루 하나님께 감사한 제목들을 자유롭게 나누어보세요."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-3xl">
        {/* 작성 섹션 (다시 추가됨) */}
        <div className="mb-16">
          {user ? (
            <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
                    {userProfile?.nickname?.charAt(0) || "U"}
                  </div>
                  <span className="font-bold text-slate-700 text-lg">
                    {userProfile?.nickname}님, 오늘의 감사는 무엇인가요?
                  </span>
                </div>
                <Textarea 
                  placeholder="하나님께 드리는 감사의 고백을 적어보세요..." 
                  className="min-h-[140px] rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-lg p-5"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="rounded-full px-10 py-6 bg-blue-600 hover:bg-blue-700 font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95"
                  >
                    <Send className="w-5 h-4 mr-2" />
                    {isSubmitting ? "나누는 중..." : "나누기"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-[32px] text-center shadow-xl">
              <p className="text-white font-bold text-lg mb-2 text-balance">
                로그인하시면 감사 제목을 함께 나눌 수 있습니다. 🙏
              </p>
            </div>
          )}
        </div>

        {/* 리스트 섹션 시작 지점 (스크롤용 ID) */}
        <div id="thanks-list" className="flex items-center gap-2 mb-8 px-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Recent Gratitude</h2>
        </div>

        {/* 리스트 본문 */}
        <div className={`space-y-6 transition-all duration-500 ${isLoading ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'}`}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 transition-all hover:shadow-xl group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      {post.author_nickname?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{post.author_nickname}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {format(new Date(post.created_at), 'yyyy. MM. dd')}
                      </p>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-slate-50 text-slate-200 group-hover:text-pink-500 transition-colors">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-[17px] font-medium">
                  {post.content}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-400 font-bold">
              아직 등록된 감사가 없습니다. 첫 번째 감사를 나눠보세요!
            </div>
          )}
        </div>

        {/* 페이지네이션 UI */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1 || isLoading}
              onClick={() => handlePageChange(currentPage - 1)}
              className="rounded-2xl w-12 h-12 border-slate-200"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <Button
                  key={num}
                  variant={currentPage === num ? "default" : "outline"}
                  onClick={() => handlePageChange(num)}
                  disabled={isLoading}
                  className={`w-12 h-12 rounded-2xl font-black text-base transition-all ${
                    currentPage === num 
                      ? "bg-blue-600 shadow-lg shadow-blue-200 scale-110" 
                      : "text-slate-400 border-slate-200 hover:bg-white hover:text-blue-600"
                  }`}
                >
                  {num}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
              className="rounded-2xl w-12 h-12 border-slate-200"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
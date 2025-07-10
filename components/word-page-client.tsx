// components/word-page-client.tsx
"use client";

import * as React from "react";
// ✅ 업데이트: 필요한 모든 React 훅들을 명시적으로 임포트합니다.
import { useState, useEffect, useRef, useCallback } from "react"; 
// ✅ 업데이트: next/navigation 관련 훅들을 임포트합니다.
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; 
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
// ✅ 업데이트: 필요한 모든 lucide-react 아이콘들을 정확히 임포트합니다.
import { Settings, Save, X, MessageCircle, Heart, Download, BookOpen, Calendar as CalendarIcon, Frown, ImageIcon } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import EditableText from "@/components/editable-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea"; 
import { Calendar } from "@/components/ui/calendar"; 
// ✅ 업데이트: date-fns에서 필요한 모든 함수들을 임포트합니다.
import { format, isFuture, isPast, startOfDay, subDays } from "date-fns"; 
import html2canvas from 'html2canvas'; // html2canvas 임포트


interface WordPost {
  id: string;
  title: string; 
  content: string; 
  author_id: string;
  author_nickname: string;
  author_profile_picture_url?: string;
  created_at: string;
  likes: { user_id: string }[];
  comments: { id: string; content: string; author_nickname: string; created_at: string }[];
  post_date: string;
  image_url?: string; // 이미지 URL 필드 추가
  imageContainerRef?: React.RefObject<HTMLDivElement>; // HTML2Canvas를 위한 ref 추가
}

interface WordPageClientProps {
  initialContent: Record<string, any>;
  initialWordPosts: WordPost[];
}

export default function WordPageClient({ initialContent, initialWordPosts }: WordPageClientProps) {
  const { user, userProfile, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [wordPosts, setWordPosts] = useState<WordPost[]>(
    // initialWordPosts가 변경될 때마다 ref 객체도 새로 생성하여 할당합니다.
    initialWordPosts.map(post => ({
      ...post,
      imageContainerRef: React.createRef<HTMLDivElement>() 
    }))
  );
  const [newCommentContent, setNewCommentContent] = useState<string>(""); // 새 댓글 내용 상태
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false); // 댓글 제출 중 상태
  const initialDateFromParams = searchParams.get('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDateFromParams ? new Date(initialDateFromParams) : new Date() 
  );

  useEffect(() => {
    // initialWordPosts가 변경될 때마다 ref 객체도 새로 생성하여 할당합니다.
    setWordPosts(initialWordPosts.map(post => ({
      ...post,
      imageContainerRef: React.createRef<HTMLDivElement>() 
    })));
    // URL에 날짜 파라미터가 없으면, 오늘 날짜로 selectedDate 설정 (최초 진입 시)
    if (!initialDateFromParams) {
      setSelectedDate(new Date());
    }
  }, [initialWordPosts, initialDateFromParams]);

  // createQueryString 헬퍼 함수
  const createQueryString = useCallback(
    (name: string, value: string | number | null | undefined) => { // value 타입에 number 추가
      const params = new URLSearchParams(searchParams.toString());
      if (value !== null && value !== undefined && value !== '') { // null, undefined, 빈 문자열 체크
        params.set(name, String(value)); // 숫자를 문자열로 변환하여 저장
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleContentChange = (section: string, key: string, value: string) => {
    setChangedContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    let updateCount = 0;
    let revalidated = false;

    for (const section in changedContent) {
      for (const key in changedContent[section]) {
        const value = changedContent[section][key];
        const { error } = await supabase.from('content').upsert({
          page: 'word', 
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for word.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/word`); 
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Word page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false);
    setChangedContent({});

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 말씀 게시판 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 말씀 게시판 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
    } else {
        alert("변경된 내용이 없거나 저장에 실패했습니다.");
    }
  };

  const handleCancelAll = () => {
    if (confirm("모든 변경 사항을 취소하시겠습니까?")) {
      setChangedContent({});
      setIsPageEditing(false);
    }
  };

  // 좋아요 처리 함수
  const handleLike = async (postId: string) => {
    if (!user) {
      alert("로그인해야 좋아요를 누를 수 있습니다.");
      return;
    }

    const { data: existingLike, error: fetchError } = await supabase
      .from('word_post_likes') 
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { 
      console.error("Error fetching existing like:", fetchError.message);
      return;
    }

    if (existingLike) {
      const { error } = await supabase
        .from('word_post_likes')
        .delete()
        .eq('id', existingLike.id);
      if (error) {
        console.error("Error unliking post:", error.message);
        return;
      }
      setWordPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: (post.likes ?? []).filter(l => l.user_id !== user.id) } 
            : post
        )
      );
    } else {
      const { error } = await supabase.from('word_post_likes').insert({
        post_id: postId,
        user_id: user.id,
      });
      if (error) {
        console.error("Error liking post:", error.message);
        return;
      }
      setWordPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: [...(post.likes ?? []), { user_id: user.id }] } 
            : post
        )
      );
    }
  };

  // ✅ 추가: 다운로드 기능
  const handleDownload = async (post: WordPost) => {
    // 캡처할 요소는 이제 post.imageContainerRef입니다.
    if (!post.imageContainerRef || !post.imageContainerRef.current) { 
        alert("다운로드할 카드 요소를 찾을 수 없습니다.");
        return;
    }

    try {
        const capturedCanvas = await html2canvas(post.imageContainerRef.current, { 
            scrollX: 0,
            scrollY: -window.scrollY, 
            useCORS: true, 
            scale: 3 // ✅ 수정: 캡처 스케일을 3으로 조정 (성능과 품질의 균형)
        });

        const targetWidth = 1080; 
        const targetHeight = 1920; 

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = targetWidth;
        finalCanvas.height = targetHeight;
        const ctx = finalCanvas.getContext('2d');

        if (!ctx) {
            throw new Error("Failed to get 2D context from canvas");
        }

        ctx.imageSmoothingEnabled = false; // 이미지 스무딩 비활성화 유지 (글자 선명도)

        const aspectRatio = capturedCanvas.width / capturedCanvas.height;
        let drawWidth = targetWidth;
        let drawHeight = targetHeight;

        if (aspectRatio > targetWidth / targetHeight) { 
            drawHeight = targetWidth / aspectRatio;
        } else { 
            drawWidth = targetHeight * aspectRatio;
        }

        const dx = (targetWidth - drawWidth) / 2;
        const dy = (targetHeight - drawHeight) / 2;

        ctx.drawImage(capturedCanvas, dx, dy, drawWidth, drawHeight);


        const image = finalCanvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = image;
        link.download = `${post.title.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${targetWidth}x${targetHeight}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href); 
        
        alert(`"${post.title}" 말씀 카드가 이미지 (${targetWidth}x${targetHeight})로 다운로드되었습니다!`);

    } catch (error) {
        console.error("말씀 카드 이미지 다운로드 중 오류 발생:", error);
        alert("말씀 카드 이미지 다운로드에 실패했습니다. 다시 시도해 주세요. (CORS 문제일 수 있습니다)");
    }
  };

  const handleMarkAsRead = (postId: string) => {
    alert(`"${postId}" 말씀 카드에 대한 읽음 표시 기능은 백엔드 구현이 필요합니다. (현재는 알림만 표시)`);
  };

  // ✅ 추가: 댓글 작성 기능
  const handleAddComment = async (postId: string) => {
    if (!user || !userProfile?.id || !userProfile?.nickname) {
      alert("로그인해야 댓글을 작성할 수 있습니다.");
      return;
    }
    if (!userProfile.can_comment && userRole !== 'admin') {
      alert("댓글을 작성할 권한이 없습니다. 관리자에게 문의하세요.");
      return;
    }
    if (!newCommentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const { data, error } = await supabase.from('word_comments').insert({
        post_id: postId,
        author_id: user.id,
        comment: newCommentContent,
        author_nickname: userProfile.nickname,
      }).select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setWordPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { ...post, comments: [...(post.comments ?? []), data[0]] } 
              : post
          )
        );
        setNewCommentContent(""); 
      }
    } catch (error: any) {
      console.error("Error adding comment:", error);
      alert(`댓글 작성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    router.push(pathname + '?' + createQueryString('date', dateString));
  };

  // 달력에서 선택 불가능한 날짜를 설정하는 함수 (미래 날짜 및 5일 이전 과거 날짜)
  const getDisabledDays = useCallback(() => { 
    const today = new Date(); 
    const startOfToday = startOfDay(today);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5); 
    const startOfFiveDaysAgo = startOfDay(fiveDaysAgo);

    const futureDates = { from: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), to: new Date(2100, 0, 1) }; 
    const pastBeyondFiveDays = { from: new Date(1900, 0, 1), to: startOfDay(new Date(fiveDaysAgo.getFullYear(), fiveDaysAgo.getMonth(), fiveDaysAgo.getDate() - 1)) }; 
    
    return [
      futureDates,
      pastBeyondFiveDays
    ];
  }, []);

  const fiveDaysAgoClientSide = startOfDay(new Date( 
    new Date().getFullYear(), 
    new Date().getMonth(), 
    new Date().getDate() - 5
  ));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 전역 편집 모드 버튼 */}
      {userRole === 'admin' && (
        <div className="fixed top-24 right-8 z-50 flex flex-col space-y-2">
          {!isPageEditing ? (
            <Button variant="outline" size="icon" onClick={() => setIsPageEditing(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={handleSaveAll} disabled={isSavingAll}>
                {isSavingAll ? <span className="animate-spin text-blue-500">🔄</span> : <Save className="h-5 w-5 text-green-600" />}
              </Button>
              <Button variant="outline" size="icon" onClick={handleCancelAll} disabled={isSavingAll}>
                <X className="h-5 w-5 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 px-4 pt-32 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <EditableText
              page="word" 
              section="main"
              contentKey="title"
              initialValue={initialContent?.main?.title || "Daily Word"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            <EditableText
              page="word" 
              section="main"
              contentKey="description"
              initialValue={initialContent?.main?.description || "Receive daily scripture and reflection."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-xl text-gray-600"
            />
          </div>
        </div>
      </section>

      {/* Word Posts List and Calendar */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl space-y-8 flex flex-col items-center">
          {/* 선택된 날짜 표시 및 지우기 카드 */}
          {selectedDate && (
            <Card className="shadow-md border bg-white p-4 mb-6 flex items-center justify-between w-full">
              <div className="flex items-center text-lg font-semibold text-gray-800">
                <CalendarIcon className="h-5 w-5 mr-3 text-blue-600" />
                선택된 날짜: {format(selectedDate, 'yyyy년 MM월 dd일 (EEE)')}
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDateSelect(undefined)}>
                날짜 선택 지우기
              </Button>
            </Card>
          )}

          {/* 새로운 그리드 컨테이너: 말씀 카드와 달력을 나란히 배치 */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto] gap-8 items-start"> 
            {/* 말씀 게시물 목록 컨테이너 (좌측 컬럼) */}
            <div className="w-full space-y-8">
              {wordPosts.length === 0 ? (
                <Card className="shadow-sm rounded-lg border bg-card text-card-foreground p-6 text-center py-12 w-full max-w-md mx-auto"> 
                  <Frown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 font-medium">
                    {selectedDate && !isFuture(selectedDate) && !isPast(selectedDate, { compareDate: fiveDaysAgoClientSide }) 
                      ? `${format(selectedDate, 'yyyy년 MM월 dd일')}의 말씀이 없습니다.`
                      : "현재 표시할 수 있는 말씀 게시물이 없습니다."}
                  </p>
                  {userRole === 'admin' && (
                    <p className="text-md text-gray-500 mt-2">관리자님, 새로운 말씀을 작성해주세요!</p>
                  )}
                </Card>
              ) : (
                wordPosts.map(post => (
                  // ✅ 수정: Card 컴포넌트에 ref 할당 및 이미지 렌더링 방식 변경
                  <Card key={post.id} ref={post.imageContainerRef} className="relative shadow-sm rounded-lg border bg-card text-card-foreground hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full max-w-md mx-auto"> 
                    {post.image_url ? (
                      // ✅ 수정: 말씀 카드 이미지 컨테이너 비율을 9:16으로 변경 및 max-h 제한
                      <div className="relative w-full aspect-[9/16] max-h-[80vh] flex items-center justify-center bg-gray-200 overflow-hidden"> {/* max-h-[80vh] 추가 및 overflow-hidden */}
                        {/* 이미지 배경 */}
                        <img
                          src={post.image_url}
                          alt={`말씀카드 - ${post.title}`}
                          className="absolute inset-0 w-full h-full object-contain" 
                          onError={(e) => e.currentTarget.src = "/placeholder.svg"} 
                        />
                        {/* 텍스트 오버레이 */}
                        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center p-4 text-white text-center"> 
                          <CardTitle className="text-4xl font-extrabold mb-2 break-words"> 
                            {post.title}
                          </CardTitle>
                          <CardDescription className="text-2xl leading-relaxed break-words"> 
                            {post.content}
                          </CardDescription>
                        </div>
                      </div>
                    ) : (
                      // image_url이 없을 경우 기존 방식대로 렌더링
                      <>
                        <CardHeader>
                          <CardTitle className="text-xl font-semibold">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        </CardContent>
                      </>
                    )}

                    {/* 좋아요, 다운로드, 읽음 버튼 */}
                    <div className="flex justify-between items-center px-6 pb-4 pt-0">
                      <div className="flex space-x-2"> 
                        <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)} disabled={!user} className="flex items-center space-x-1">
                          <Heart className={`h-4 w-4 ${(post.likes ?? []).some(l => l.user_id === user?.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                          <span>{(post.likes ?? []).length}</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(post)} className="flex items-center space-x-1"> 
                          <Download className="h-4 w-4 text-gray-500" />
                          <span>다운로드 (이미지)</span> 
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(post.id)} disabled={!user} className="flex items-center space-x-1"> 
                          <BookOpen className="h-4 w-4 text-gray-500" />
                          <span>읽음</span>
                        </Button>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MessageCircle className="h-4 w-4" />
                        <span>{(post.comments ?? []).length}</span>
                      </div>
                    </div>
                    {/* 댓글 목록 및 작성 폼 */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">댓글 ({(post.comments ?? []).length})</h4>
                        {(post.comments ?? []).length === 0 ? (
                            <p className="text-sm text-gray-500 mb-4">아직 댓글이 없습니다. 첫 댓글을 남겨주세요!</p>
                        ) : (
                            <div className="space-y-4 mb-4 max-h-48 overflow-y-auto pr-2">
                                {(post.comments ?? []).map(comment => (
                                    <div key={comment.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                                        <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={post.author_profile_picture_url || "/placeholder.svg"} alt={post.author_nickname} />
                                                <AvatarFallback className="text-xs">{comment.author_nickname?.charAt(0) || "U"}</AvatarFallback>
                                            </Avatar>
                                            {comment.author_nickname}
                                            <span className="ml-2 text-xs text-gray-500">
                                                {new Date(comment.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {user && (userProfile?.can_comment || userRole === 'admin') ? (
                            <div className="mt-4">
                                <Textarea
                                    value={newCommentContent}
                                    onChange={(e) => setNewCommentContent(e.target.value)}
                                    placeholder="댓글을 작성하세요..."
                                    rows={3}
                                    className="mb-2"
                                    disabled={isSubmittingComment}
                                />
                                <Button
                                    onClick={() => handleAddComment(post.id)}
                                    disabled={isSubmittingComment || !newCommentContent.trim()}
                                    className="w-full"
                                    >
                                    {isSubmittingComment ? "댓글 작성 중..." : "댓글 제출"}
                                </Button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 mt-4 text-center">
                                댓글을 작성하려면 <a href="/login" className="text-blue-600 hover:underline">로그인</a>하시거나,
                                댓글 작성 권한이 필요합니다.
                            </p>
                        )}
                    </div>
                  </Card>
                ))
              )}
            </div> {/* 말씀 게시물 목록 컨테이너 끝 */}

            {/* 달력 카드 (우측 컬럼) */}
            <div className="w-full md:w-auto flex justify-center"> {/* flex justify-center to center calendar within its column */}
                <Card className="shadow-sm rounded-lg border bg-card text-card-foreground p-6 hover:shadow-lg transition-shadow duration-300 max-w-[300px] mx-auto"> 
                    <CardHeader className="mb-4">
                        <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                            <CalendarIcon className="h-6 w-6 mr-3 text-blue-600" /> 
                            말씀 달력
                        </CardTitle>
                        <CardDescription>날짜를 선택하여 해당 날짜의 말씀을 확인하세요.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        disabled={getDisabledDays()} 
                      />
                    </CardContent>
                    {selectedDate && (
                        <div className="text-center mt-4">
                            <Button variant="ghost" onClick={() => handleDateSelect(undefined)}>
                                선택된 날짜 지우기
                            </Button>
                        </div>
                    )}
                </Card>
            </div> {/* 달력 카드 끝 */}
          </div> {/* 새로운 그리드 컨테이너 끝 */}
        </div> {/* container mx-auto 끝 */}
      </section>
    </div>
  );
}
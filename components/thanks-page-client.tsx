// yeongkyukang/bozhiymirchurch/BozhiymirChurch-4d2cde288530ef711b8ef2d2cc649e1ca337c00c/components/thanks-page-client.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X, PlusCircle, MessageCircle, ThumbsUp, Heart, Laugh, Smile, Frown, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EditableText from "@/components/editable-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ThankPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  author_profile_picture_url?: string;
  author_role?: string | null;
  created_at: string;
  likes: { user_id: string; reaction_type: string }[];
  comments: { id: string; content: string; author_nickname: string; created_at: string }[];
  author?: { role: string | null } | null;
}

interface ThanksPageClientProps {
  initialContent: Record<string, any>;
  initialThanksPosts: ThankPost[];
}

const POSTS_PER_LOAD = 4;

export default function ThanksPageClient({ initialContent, initialThanksPosts }: ThanksPageClientProps) {
  const { user, userProfile, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [thanksPosts, setThanksPosts] = useState<ThankPost[]>(initialThanksPosts);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [postsToShow, setPostsToShow] = useState(POSTS_PER_LOAD);
  const [timezoneOffset, setTimezoneOffset] = useState<number | null>(null); // 사용자 시간대 오프셋 상태

  // 필터 및 정렬 상태
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(searchParams.get('time') || 'latest');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState(searchParams.get('role') || 'all');
  const [selectedSortBy, setSelectedSortBy] = useState(searchParams.get('sort') || 'created_at_desc');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.get('date') ? new Date(searchParams.get('date') as string) : undefined
  );

  // 사용자 시간대 오프셋 감지
  useEffect(() => {
    // 클라이언트 측에서만 실행되도록 확인
    if (typeof window !== 'undefined') {
      // getTimezoneOffset()은 로컬 시간과 UTC의 차이를 분 단위로 반환 (예: KST는 -540)
      setTimezoneOffset(new Date().getTimezoneOffset());
    }
  }, []);

  // URL 쿼리 파라미터 변경 핸들러
  const createQueryString = useCallback(
    (name: string, value: string | number) => { // value 타입에 number 추가
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

  useEffect(() => {
    setThanksPosts(initialThanksPosts);
    setPostsToShow(POSTS_PER_LOAD);
  }, [initialThanksPosts]);

  const handleTimeFilterChange = (value: string) => {
    setSelectedTimeFilter(value);
    router.push(pathname + '?' + createQueryString('time', value));
  };

  const handleRoleFilterChange = (value: string) => {
    setSelectedRoleFilter(value);
    router.push(pathname + '?' + createQueryString('role', value));
  };

  const handleSortByChange = (value: string) => {
    setSelectedSortBy(value);
    router.push(pathname + '?' + createQueryString('sort', value));
  };

  // 날짜 필터 변경 핸들러 (시간대 오프셋 포함)
  const handleDateFilterChange = (date: Date | undefined) => {
    setSelectedDate(date);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    
    let newQueryString = createQueryString('date', dateString);
    if (timezoneOffset !== null) {
      newQueryString = createQueryString('timezoneOffset', timezoneOffset); // 시간대 오프셋 추가
      router.push(pathname + '?' + newQueryString);
    } else {
      router.push(pathname + '?' + newQueryString);
    }
  };

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
          page: 'thanks',
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for thanks.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/thanks`);
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Thanks page revalidated successfully!");
        }
      }
      catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false);
    setChangedContent({});

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 감사 게시판 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 감사 게시판 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
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

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile?.id || !newPostTitle || !newPostContent) {
      alert("로그인해야 게시물을 작성할 수 있으며, 제목과 내용을 입력해야 합니다.");
      return;
    }

    setIsSubmittingPost(true);
    try {
      const { data, error } = await supabase.from('thanks_posts').insert({
        title: newPostTitle,
        content: newPostContent,
        author_id: user.id,
        author_nickname: userProfile.nickname || user.email,
        author_profile_picture_url: userProfile.profile_picture_url,
        author_role: userProfile.role,
      }).select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setThanksPosts(prev => [
          { ...data[0], likes: [], comments: [], author_role: userProfile.role || null },
          ...prev,
        ]);
        setNewPostTitle("");
        setNewPostContent("");
        setShowNewPostForm(false);
        alert("감사 제목이 성공적으로 작성되었습니다!");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error adding thank post:", error.message);
      alert(`감사 제목 작성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    if (!user) {
      alert("로그인해야 공감할 수 있습니다.");
      return;
    }

    const { data: existingLike, error: fetchError } = await supabase
      .from('thanks_reactions')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching existing like:", fetchError.message);
      return;
    }

    if (existingLike) {
      if (existingLike.reaction_type === reactionType) {
        const { error } = await supabase
          .from('thanks_reactions')
          .delete()
          .eq('id', existingLike.id);
        if (error) {
          console.error("Error unliking post:", error.message);
          return;
        }
        setThanksPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { ...post, likes: (post.likes || []).filter(l => l.user_id !== user.id) }
              : post
          )
        );
      } else {
        const { error } = await supabase
          .from('thanks_reactions')
          .update({ reaction_type: reactionType, updated_at: new Date().toISOString() })
          .eq('id', existingLike.id);
        if (error) {
          console.error("Error updating like type:", error.message);
          return;
        }
        setThanksPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { ...post, likes: (post.likes || []).map(l => l.user_id === user.id ? { ...l, reaction_type: reactionType } : l) }
              : post
          )
        );
      }
    } else {
      const { error } = await supabase.from('thanks_reactions').insert({
        post_id: postId,
        user_id: user.id,
        reaction_type: reactionType,
      });
      if (error) {
        console.error("Error liking post:", error.message);
        return;
      }
      setThanksPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: [...(post.likes || []), { user_id: user.id, reaction_type: reactionType }] }
            : post
        )
      );
    }
    router.refresh();
  };

  const renderReactionButtons = (post: ThankPost) => {
    const currentLikes = post.likes || [];
    const userReaction = currentLikes.find(l => l.user_id === user?.id);
    const getReactionCount = (type: string) => currentLikes.filter(l => l.reaction_type === type).length;

    const ReactionButton = ({ type, icon: Icon, label }: { type: string; icon: React.ElementType; label: string }) => (
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center space-x-1 ${userReaction?.reaction_type === type ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'}`}
        onClick={() => handleReaction(post.id, type)}
        disabled={!user}
      >
        <Icon className="h-4 w-4" />
        <span>{getReactionCount(type)}</span>
      </Button>
    );

    return (
      <div className="flex flex-wrap gap-x-2 gap-y-1 justify-start">
        <ReactionButton type="heart" icon={Heart} label="Heart" />
        <ReactionButton type="thumbs_up" icon={ThumbsUp} label="Thumbs Up" />
        <ReactionButton type="laugh" icon={Laugh} label="Laugh" />
        <ReactionButton type="smile" icon={Smile} label="Smile" />
        <ReactionButton type="frown" icon={Frown} label="Frown" />
      </div>
    );
  };

  const handleLoadMore = () => {
    setPostsToShow(prev => prev + POSTS_PER_LOAD);
  };

  const displayedPosts = thanksPosts.slice(0, postsToShow);
  const hasMorePosts = thanksPosts.length > postsToShow;

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
              page="thanks"
              section="main"
              contentKey="title"
              initialValue={initialContent?.main?.title || "Thanks Board"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            <EditableText
              page="thanks"
              section="main"
              contentKey="description"
              initialValue={initialContent?.main?.description || "Share your gratitude and blessings with our community."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-xl text-gray-600"
            />
          </div>
        </div>
      </section>

      {/* 필터 및 정렬 옵션 */}
      <section className="py-4 px-4">
        <div className="container mx-auto max-w-2xl flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* 정렬 기준 */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <label htmlFor="sort-by" className="text-gray-700 text-sm font-medium whitespace-nowrap">정렬:</label>
            <Select value={selectedSortBy} onValueChange={handleSortByChange}>
              <SelectTrigger id="sort-by" className="w-full sm:w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at_desc">최신순</SelectItem>
                <SelectItem value="created_at_asc">오래된순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 작성자 역할별 필터 */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <label htmlFor="role-filter" className="text-gray-700 text-sm font-medium whitespace-nowrap">작성자:</label>
            <Select value={selectedRoleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger id="role-filter" className="w-full sm:w-[180px]">
                <SelectValue placeholder="작성자 역할" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="admin">관리자</SelectItem>
                <SelectItem value="user">멤버</SelectItem>
                <SelectItem value="child">어린이</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 날짜 필터 */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <label htmlFor="date-filter" className="text-gray-700 text-sm font-medium whitespace-nowrap">날짜:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[180px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateFilterChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <Button variant="ghost" size="icon" onClick={() => handleDateFilterChange(undefined)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* New Post Form */}
      {user && (userProfile?.can_comment || userRole === 'admin') && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-2xl">
            <Button onClick={() => setShowNewPostForm(!showNewPostForm)} className="mb-4 w-full">
              {showNewPostForm ? "감사 제목 작성 취소" : <><PlusCircle className="mr-2 h-5 w-5" /> 감사 제목 작성</>}
            </Button>
            {showNewPostForm && (
              <Card className="shadow-sm rounded-lg border bg-card text-card-foreground p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-bold mb-4">새 감사 제목 작성</h2>
                <form onSubmit={handleAddPost} className="space-y-4">
                  <div>
                    <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                    <Input
                      id="postTitle"
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="감사 제목을 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                    <Textarea
                      id="postContent"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="감사 내용을 입력하세요"
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isSubmittingPost}>
                    {isSubmittingPost ? "작성 중..." : "감사 제목 제출"}
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Thanks Posts List */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {displayedPosts.length === 0 && thanksPosts.length === 0 ? (
            <p className="text-center text-gray-600">아직 작성된 감사 제목이 없습니다. 첫 감사 제목을 작성해보세요!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedPosts.map(post => (
                <Card key={post.id} className="shadow-sm rounded-lg border bg-card text-card-foreground relative hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar>
                        <AvatarImage src={post.author_profile_picture_url || "/placeholder.svg"} alt={post.author_nickname} />
                        <AvatarFallback>{post.author_nickname?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {post.author_nickname} ({post.author_role || '알 수 없음'}) • {new Date(post.created_at).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t pt-4">
                    {renderReactionButtons(post)}
                    <div className="flex items-center space-x-4 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{(post.comments || []).length}</span>
                      </div>
                    </div>
                  </CardFooter>
                  {/* TODO: 댓글 목록 및 댓글 작성 폼 추가 (후순위) */}
                </Card>
              ))}
            </div>
          )}
          {/* 더보기 버튼 */}
          {hasMorePosts && (
            <div className="text-center mt-6">
              <Button onClick={handleLoadMore} variant="outline">
                더보기
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
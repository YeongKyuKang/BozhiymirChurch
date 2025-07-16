// components/thanks-page-client.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Settings, Save, X, Heart, MessageCircle, Loader2, CheckCircle, XCircle,
  ThumbsUp, Smile, Zap, Frown, PlusCircle, ChevronDown, Edit3, CalendarIcon, Bookmark
} from "lucide-react";
import { format } from "date-fns";
import EditableText from "@/components/editable-text";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface ThanksPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  created_at: string;
  updated_at: string;
  author_profile_picture_url: string | null;
  author_role: string | null;
}

interface ThanksComment {
  id: string;
  post_id: string;
  author_id: string;
  author_nickname: string;
  comment: string;
  created_at: string;
}

interface ThanksReaction {
  id: string;
  user_id: string;
  post_id: string;
  reaction_type: string;
  created_at: string;
}

interface ThanksPageClientProps {
  initialContent: Record<string, any>;
  initialThanksPosts: ThanksPost[];
}

const POSTS_PER_LOAD = 6;

export default function ThanksPageClient({ initialContent, initialThanksPosts }: ThanksPageClientProps) {
  const { user, userProfile, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [thanksPosts, setThanksPosts] = useState<ThanksPost[]>(initialThanksPosts);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<string>("answered_prayer");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [comments, setComments] = useState<Record<string, ThanksComment[]>>({});
  const [newCommentContent, setNewCommentContent] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});

  const [reactions, setReactions] = useState<Record<string, ThanksReaction[]>>({});

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const initialRoleFilter = searchParams.get('role') || 'all';
  const initialSortBy = searchParams.get('sort') || 'created_at_desc';
  const initialDateFilter = searchParams.get('date') ? new Date(searchParams.get('date') as string) : undefined;

  const [selectedRoleFilter, setSelectedRoleFilter] = useState(initialRoleFilter);
  const [selectedSortBy, setSelectedSortBy] = useState(initialSortBy);
  const [selectedDateFilter, setSelectedDateFilter] = useState<Date | undefined>(initialDateFilter);
  const [timezoneOffset, setTimezoneOffset] = useState<number | null>(null);

  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_LOAD);

  // 감사 게시물용 새로운 카테고리 정의
  const thanksPostCategories = [
    { key: "all", labelKey: "all_posts", defaultLabel: "모든 게시물" }, // '모든 게시물' 옵션 추가
    { key: "answered_prayer", labelKey: "category_answered_prayer", defaultLabel: "응답받은 기도" },
    { key: "personal_testimony", labelKey: "category_personal_testimony", defaultLabel: "개인 간증" },
    { key: "church_support", labelKey: "category_church_support", defaultLabel: "교회 공동체 지원" },
    { key: "blessing", labelKey: "category_blessing", defaultLabel: "일상의 축복" },
    { key: "ministry_impact", labelKey: "category_ministry_impact", defaultLabel: "사역의 열매" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimezoneOffset(new Date().getTimezoneOffset());
    }
  }, []);

  useEffect(() => {
    setThanksPosts(initialThanksPosts);
    setVisiblePostsCount(POSTS_PER_LOAD);
    const initialComments: Record<string, ThanksComment[]> = {};
    const initialReactions: Record<string, ThanksReaction[]> = {};
    initialThanksPosts.forEach(post => {
      initialComments[post.id] = [];
      initialReactions[post.id] = [];
    });
    setComments(initialComments);
    setReactions(initialReactions);
  }, [initialThanksPosts]);

  const fetchCommentsAndReactions = useCallback(async (postId: string) => {
    const { data: commentsData, error: commentsError } = await supabase
      .from('thanks_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
    } else {
      setComments(prev => ({ ...prev, [postId]: commentsData || [] }));
    }

    const { data: reactionsData, error: reactionsError } = await supabase
      .from('thanks_reactions')
      .select('*')
      .eq('post_id', postId);
    if (reactionsError) {
      console.error("Error fetching reactions:", reactionsError);
    } else {
      setReactions(prev => ({ ...prev, [postId]: reactionsData || [] }));
    }
  }, []);

  useEffect(() => {
    thanksPosts.forEach(post => {
      fetchCommentsAndReactions(post.id);
    });
  }, [thanksPosts, fetchCommentsAndReactions]);

  const createQueryString = useCallback(
    (name: string, value: string | number | null | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value !== null && value !== undefined && value !== "") {
        params.set(name, String(value));
      } else {
        params.delete(name);
      }
      if (name !== 'timezoneOffset' && timezoneOffset !== null) {
        params.set('timezoneOffset', String(timezoneOffset));
      }
      return params.toString();
    },
    [searchParams, timezoneOffset]
  );

  const handleFilterChange = useCallback((filterName: string, value: string | Date | undefined) => {
    let newQueryString = searchParams.toString();
    if (filterName === 'role') {
      setSelectedRoleFilter(value as string);
      newQueryString = createQueryString('role', value as string);
    } else if (filterName === 'sort') {
      setSelectedSortBy(value as string);
      newQueryString = createQueryString('sort', value as string);
    } else if (filterName === 'date') {
      setSelectedDateFilter(value as Date | undefined);
      const dateString = value ? format(value as Date, 'yyyy-MM-dd') : '';
      newQueryString = createQueryString('date', dateString);
    }
    router.push(`${pathname}?${newQueryString}`);
  }, [createQueryString, pathname, router, searchParams]);

  const handleContentChange = (section: string, key: string, value: string) => {
    setChangedContent((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }));
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    let updateCount = 0;
    let revalidated = false;

    for (const section in changedContent) {
      for (const key in changedContent[section]) {
        const value = changedContent[section][key];
        const { error } = await supabase.from("content").upsert({
          page: "thanks",
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString(),
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
        const revalidateResponse = await fetch(
          `/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/thanks`,
        );
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          throw new Error(errorData.message || "재검증 실패");
        }
        revalidated = true;
      } catch (error) {
        console.error("재검증 중 오류 발생:", error);
        alert("콘텐츠 업데이트는 성공했지만 페이지 재검증에 실패했습니다. 수동으로 새로고침해야 할 수 있습니다.");
      }
    }

    setChangedContent({});
    setIsPageEditing(false);
    setIsSavingAll(false);

    if (updateCount > 0) {
      alert(`콘텐츠가 성공적으로 업데이트되었습니다.${revalidated ? "" : " (재검증 실패)"}`);
      router.refresh();
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

  const isAdmin = userRole === "admin";

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPost(true);
    setMessage(null);

    if (!user || !userProfile) {
      setMessage({ type: 'error', text: "로그인 후 게시물을 작성할 수 있습니다." });
      setIsSubmittingPost(false);
      return;
    }
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setMessage({ type: 'error', text: "제목과 내용을 입력해주세요." });
      setIsSubmittingPost(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('thanks_posts')
        .insert({
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory,
          author_id: user.id,
          author_nickname: userProfile.nickname || user.email || '익명',
          author_profile_picture_url: userProfile.profile_picture_url,
          author_role: userProfile.role,
        })
        .select()
        .single();

      if (error) {
        console.error("Error submitting thanks post:", error);
        setMessage({ type: 'error', text: `게시물 작성에 실패했습니다: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: "감사 게시물이 성공적으로 작성되었습니다!" });
        handleFilterChange('sort', 'created_at_desc');
        handleFilterChange('role', 'all');
        handleFilterChange('date', undefined);
        setIsWriteModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error("Unexpected error during post submission:", err);
      setMessage({ type: 'error', text: "게시물 작성 중 예상치 못한 오류가 발생했습니다." });
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("정말로 이 감사 게시물을 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from('thanks_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error("Error deleting thanks post:", error);
        alert(`게시물 삭제에 실패했습니다: ${error.message}`);
      } else {
        alert("게시물이 성공적으로 삭제되었습니다!");
        router.refresh();
      }
    } catch (err) {
      console.error("Unexpected error during post deletion:", err);
      alert("게시물 삭제 중 예상치 못한 오류가 발생했습니다.");
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    setIsSubmittingComment(prev => ({ ...prev, [postId]: true }));
    setMessage(null);

    if (!user || !userProfile) {
      setMessage({ type: 'error', text: "로그인 후 댓글을 작성할 수 있습니다." });
      setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
      return;
    }
    if (!newCommentContent[postId]?.trim()) {
      setMessage({ type: 'error', text: "댓글 내용을 입력해주세요." });
      setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
      return;
    }

    if (!userProfile.can_comment && userRole !== 'admin') {
      setMessage({ type: 'error', text: "댓글을 작성할 권한이 없습니다." });
      setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('thanks_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          author_nickname: userProfile.nickname || user.email || '익명',
          comment: newCommentContent[postId],
        })
        .select()
        .single();

      if (error) {
        console.error("Error submitting comment:", error);
        setMessage({ type: 'error', text: `댓글 작성에 실패했습니다: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: "댓글이 성공적으로 작성되었습니다!" });
        setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), data] }));
        setNewCommentContent(prev => ({ ...prev, [postId]: "" }));
      }
    } catch (error: any) {
      console.error("Unexpected error during comment submission:", error);
      setMessage({ type: 'error', text: `댓글 작성 중 예상치 못한 오류가 발생했습니다: ${error.message}` });
    } finally {
      setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    if (!user) {
      setMessage({ type: 'error', text: "로그인 후 반응을 남길 수 있습니다." });
      return;
    }

    const existingReaction = reactions[postId]?.find(r => r.user_id === user.id && r.reaction_type === reactionType);

    try {
      if (existingReaction) {
        const { error } = await supabase
          .from('thanks_reactions')
          .delete()
          .eq('id', existingReaction.id);
        if (error) throw error;
        setReactions(prev => ({
          ...prev,
          [postId]: prev[postId]?.filter(r => r.id !== existingReaction.id) || []
        }));
      } else {
        const { data, error } = await supabase
          .from('thanks_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType,
          })
          .select()
          .single();
        if (error) throw error;
        setReactions(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data]
        }));
      }
    } catch (error: any) {
      console.error("Error handling reaction:", error);
      setMessage({ type: 'error', text: `반응 처리 실패: ${error.message}` });
    }
  };

  const getReactionCounts = (postId: string) => {
    const counts: Record<string, number> = {};
    reactions[postId]?.forEach(r => {
      counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
    });
    return counts;
  };

  const hasUserReacted = (postId: string, reactionType: string) => {
    return reactions[postId]?.some(r => r.user_id === user?.id && r.reaction_type === reactionType);
  };

  const reactionEmojis: Record<string, string> = {
    'like': '👍',
    'heart': '❤️',
    'amen': '🙌',
    'smile': '😊',
  };

  const handleLoadMore = () => {
    setVisiblePostsCount(prevCount => prevCount + POSTS_PER_LOAD);
  };

  // 감사 카테고리 필터 옵션으로 변경 (기존 filterOptions 대체)
  const filterOptions = thanksPostCategories; // thanksPostCategories를 직접 사용합니다.

  const sortOptions = [
    { value: "created_at_desc", labelKey: "latest_sort", defaultLabel: "최신순" },
    { value: "created_at_asc", labelKey: "oldest_sort", defaultLabel: "오래된순" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-8 pt-16">
      {/* Admin Controls */}
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
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500 py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-3">
            <span className="text-3xl md:text-4xl">🙏</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-4">
            <EditableText
              page="thanks"
              section="main"
              contentKey="title"
              initialValue={initialContent?.main?.title || "감사 게시판"}
              onContentChange={(section: string, key: string, value: string) =>
                handleContentChange("main", "title", value)
              }
              isEditingPage={isPageEditing}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-3xl mx-auto leading-relaxed">
            <EditableText
              page="thanks"
              section="main"
              contentKey="description"
              initialValue={
                initialContent?.main?.description ||
                "하나님께 드리는 감사와 은혜를 나누는 공간입니다. 당신의 간증을 공유해주세요."
              }
              onContentChange={(section: string, key: string, value: string) =>
                handleContentChange("main", "description", value)
              }
              isEditingPage={isPageEditing}
              tag="span"
              className="text-sm md:text-base text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Filters and New Post Button Section */}
      <section className="py-8 bg-gray-100 border-b border-gray-200 text-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 text-center mb-6">
            <EditableText
              page="thanks"
              section="filters"
              contentKey="filter_heading"
              initialValue={initialContent?.filters?.filter_heading || "게시물 필터링 및 정렬"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-xl md:text-2xl font-extrabold text-blue-900"
            />
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            {/* 감사 카테고리 필터 */}
            <Select value={selectedRoleFilter} onValueChange={(value) => handleFilterChange('role', value)}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base">
                <SelectValue placeholder={initialContent?.filters?.all_posts || "모든 감사 카테고리"} />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(option => (
                  <SelectItem key={option.key} value={option.key}> {/* value={option.key}로 수정 */}
                    <EditableText
                      page="thanks"
                      section="filters"
                      contentKey={option.labelKey}
                      initialValue={initialContent?.filters?.[option.labelKey] || option.defaultLabel}
                      isEditingPage={isPageEditing}
                      onContentChange={handleContentChange}
                      tag="span"
                      className="inline"
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 정렬 기준 필터 */}
            <Select value={selectedSortBy} onValueChange={(value) => handleFilterChange('sort', value)}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base">
                <SelectValue placeholder={initialContent?.filters?.latest_sort || "최신순"} />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <EditableText
                      page="thanks"
                      section="filters"
                      contentKey={option.labelKey}
                      initialValue={initialContent?.filters?.[option.labelKey] || option.defaultLabel}
                      isEditingPage={isPageEditing}
                      onContentChange={handleContentChange}
                      tag="span"
                      className="inline"
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 날짜 필터 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[180px] justify-start text-left font-normal h-10 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base",
                    !selectedDateFilter && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-700" />
                  {selectedDateFilter ? format(selectedDateFilter, "yyyy년 MM월 dd일") : <span>날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border border-gray-200 rounded-md shadow-lg">
                <Calendar mode="single" selected={selectedDateFilter} onSelect={(date) => handleFilterChange('date', date)} initialFocus />
              </PopoverContent>
            </Popover>
            {selectedDateFilter && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFilterChange('date', undefined)}
                className="text-blue-700 hover:bg-blue-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg shadow-md"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> 감사 게시물 작성
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-900">감사 게시물 작성</DialogTitle>
                <DialogDescription className="text-gray-700">하나님께 감사한 일들을 나누어 주세요.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePostSubmit} className="space-y-4 py-4">
                {message && (
                  <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'error' ? 'bg-red-900 text-white border-red-700' : 'bg-green-900 text-white border-green-700'}>
                    {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    <AlertTitle>{message.type === 'error' ? "오류!" : "성공!"}</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="newPostCategory" className="text-blue-900 font-semibold">카테고리</Label>
                  {/* 감사 게시물용 카테고리로 변경 */}
                  <Select value={newPostCategory} onValueChange={(value: string) => setNewPostCategory(value)}>
                    <SelectTrigger className="mt-1 h-10 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {thanksPostCategories.slice(1).map(cat => ( // '모든 게시물' 옵션 제외
                        <SelectItem key={cat.key} value={cat.key}>
                          <EditableText
                            page="thanks"
                            section="categories"
                            contentKey={cat.labelKey}
                            initialValue={initialContent?.categories?.[cat.labelKey] || cat.defaultLabel}
                            isEditingPage={isPageEditing}
                            onContentChange={handleContentChange}
                            tag="span"
                            className="inline"
                          />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="newPostTitle" className="text-blue-900 font-semibold">제목</Label>
                  <Textarea
                    id="newPostTitle"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="감사 게시물의 제목을 입력하세요."
                    rows={1}
                    required
                    className="mt-1 border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                  />
                </div>
                <div>
                  <Label htmlFor="newPostContent" className="text-blue-900 font-semibold">내용</Label>
                  <Textarea
                    id="newPostContent"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="감사한 내용을 자세히 작성해주세요."
                    rows={5}
                    required
                    className="mt-1 border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmittingPost} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">
                    {isSubmittingPost ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    게시물 작성
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* 감사 게시물 목록 */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-8">
            <EditableText
              page="thanks"
              section="posts_list"
              contentKey="title"
              initialValue={initialContent?.posts_list?.title || "모든 감사 게시물"}
              onContentChange={(section: string, key: string, value: string) =>
                handleContentChange("posts_list", "title", value)
              }
              isEditingPage={isPageEditing}
              tag="span"
              className="text-2xl md:text-3xl font-bold text-center text-blue-900"
            />
          </h2>
          {thanksPosts.length === 0 ? (
            <p className="text-gray-600 text-base text-center mt-10">아직 감사 게시물이 없습니다. 첫 게시물을 작성해주세요!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {thanksPosts.slice(0, visiblePostsCount).map((post) => (
                <Card key={post.id} className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 min-h-[280px]">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={post.author_profile_picture_url || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author_nickname}`} alt={post.author_nickname} />
                        <AvatarFallback>{post.author_nickname?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-bold text-blue-900">{post.author_nickname}</CardTitle>
                        <CardDescription className="text-xs text-gray-600">
                          {format(new Date(post.created_at), 'yyyy년 MM월 dd일 HH:mm')}
                          {post.created_at !== post.updated_at && " (수정됨)"}
                        </CardDescription>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-blue-900 mb-2 line-clamp-2">{post.title}</h3>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4 max-h-[60px] overflow-y-auto">{post.content}</p>

                    {/* 반응 섹션 */}
                    <div className="flex items-center space-x-0.5 border-t border-b border-blue-100 py-1.5 my-2">
                      {Object.entries(reactionEmojis).map(([type, emoji]) => (
                        <Button
                          key={type}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReaction(post.id, type)}
                          className={`flex items-center text-gray-600 hover:text-blue-700 text-xxs ${hasUserReacted(post.id, type) ? 'bg-blue-100 text-blue-700' : ''}`}
                        >
                          <span className="text-sm mr-0.5">{emoji}</span>
                          <span className="text-xxs">{getReactionCounts(post.id)[type] || 0}</span>
                        </Button>
                      ))}
                    </div>

                    {/* 댓글 목록 */}
                    <div className="mt-3 space-y-2 max-h-[80px] overflow-y-auto">
                      <h4 className="text-sm font-semibold text-blue-800">댓글 ({comments[post.id]?.length || 0})</h4>
                      {comments[post.id]?.map(comment => (
                        <div key={comment.id} className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author_nickname}`} alt={comment.author_nickname} />
                              <AvatarFallback className="text-xs">{comment.author_nickname?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-blue-800 text-xs">{comment.author_nickname}</span>
                            <span className="text-xxs text-gray-500">
                              {format(new Date(comment.created_at), 'yyyy년 MM월 dd일 HH:mm')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 ml-7 whitespace-pre-wrap">{comment.comment}</p>
                        </div>
                      ))}
                    </div>

                    {/* 댓글 작성 폼 */}
                    {user && userProfile?.can_comment && (
                      <div className="mt-3">
                        <Textarea
                          value={newCommentContent[post.id] || ""}
                          onChange={(e) => setNewCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="댓글을 입력하세요."
                          rows={1}
                          className="mt-1 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-sm"
                        />
                        <Button
                          onClick={() => handleCommentSubmit(post.id)}
                          disabled={isSubmittingComment[post.id]}
                          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1.5 px-2 rounded-lg"
                        >
                          <MessageCircle className="mr-1 h-3 w-3" />
                          댓글 작성
                        </Button>
                      </div>
                    )}

                    {/* 관리자용 삭제 버튼 */}
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="mt-3 bg-red-600 hover:bg-red-700 text-white w-full"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> 게시물 삭제
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {thanksPosts.length > visiblePostsCount && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg"
              >
                <ChevronDown className="h-5 w-5 mr-2" />
                더보기
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Scripture Section */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold mb-6">
            <EditableText
              page="thanks"
              section="scripture"
              contentKey="title"
              initialValue={initialContent?.scripture?.title || "God Hears Our Prayers"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-white"
            />
          </h2>
          <Card className="max-w-5xl mx-auto shadow-2xl border border-gray-600 bg-white/10 backdrop-blur-sm">
            <CardContent className="p-5">
              <blockquote className="text-base italic text-yellow-300 mb-4 leading-relaxed">
                <EditableText
                  page="thanks"
                  section="scripture"
                  contentKey="quote"
                  initialValue={
                    initialContent?.scripture?.quote ||
                    "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
                  }
                  isEditingPage={isPageEditing}
                  onContentChange={handleContentChange}
                  tag="span"
                  className="text-base italic text-yellow-300"
                  isTextArea={true}
                />
              </blockquote>
              <p className="text-sm font-semibold text-white mb-4">
                <EditableText
                  page="thanks"
                  section="scripture"
                  contentKey="reference"
                  initialValue={initialContent?.scripture?.reference || "Philippians 4:6"}
                  isEditingPage={isPageEditing}
                  onContentChange={handleContentChange}
                  tag="span"
                  className="text-sm font-semibold text-white"
                />
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
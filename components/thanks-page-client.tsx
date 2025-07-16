// components/thanks-page-client.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Settings, Save, X, Heart, MessageCircle, Loader2, CheckCircle, XCircle,
  ThumbsUp, Smile, Zap, Frown, PlusCircle, ChevronDown, Edit3
} from "lucide-react";
import { format } from "date-fns";
import EditableText from "@/components/editable-text";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

// ThanksPost 및 ThanksComment 타입 정의 (lib/supabase.ts에서 가져올 수도 있음)
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

const POSTS_PER_LOAD = 6; // 한 번에 로드할 게시물 수

export default function ThanksPageClient({ initialContent, initialThanksPosts }: ThanksPageClientProps) {
  const { user, userProfile, userRole, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [thanksPosts, setThanksPosts] = useState<ThanksPost[]>(initialThanksPosts);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 댓글 상태 관리 (각 게시물 ID에 대한 댓글 목록)
  const [comments, setComments] = useState<Record<string, ThanksComment[]>>({});
  const [newCommentContent, setNewCommentContent] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});

  // 반응 상태 관리 (각 게시물 ID에 대한 반응 목록)
  const [reactions, setReactions] = useState<Record<string, ThanksReaction[]>>({});

  // "더보기" 기능을 위한 상태
  const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_LOAD);

  // 게시물 작성 모달 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // 초기 로드 시 댓글 및 반응 가져오기
  useEffect(() => {
    setThanksPosts(initialThanksPosts);
    // 모든 게시물에 대한 댓글 및 반응 초기화
    const initialComments: Record<string, ThanksComment[]> = {};
    const initialReactions: Record<string, ThanksReaction[]> = {};
    initialThanksPosts.forEach(post => {
      initialComments[post.id] = []; // 초기에는 빈 배열
      initialReactions[post.id] = []; // 초기에는 빈 배열
    });
    setComments(initialComments);
    setReactions(initialReactions);
  }, [initialThanksPosts]);

  const fetchCommentsAndReactions = useCallback(async (postId: string) => {
    // 댓글 가져오기
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

    // 반응 가져오기
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

  // 모든 게시물에 대해 댓글 및 반응 로드
  useEffect(() => {
    thanksPosts.forEach(post => {
      fetchCommentsAndReactions(post.id);
    });
  }, [thanksPosts, fetchCommentsAndReactions]);

  // 관리자 권한 확인
  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'admin')) {
      // router.push('/'); // 관리자가 아니면 홈으로 리다이렉트 (필요시 활성화)
    }
  }, [authLoading, user, userRole, router]);

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

  // 감사 게시물 제출 핸들러
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
        setThanksPosts(prev => [data, ...prev]); // 최신 게시물을 목록 맨 앞에 추가
        setNewPostTitle("");
        setNewPostContent("");
        setIsWriteModalOpen(false); // 게시물 작성 후 모달 닫기
        // 페이지 재검증
        try {
          await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/thanks`);
        } catch (revalidateError) {
          console.error("Revalidation failed after post submit:", revalidateError);
        }
      }
    } catch (err) {
      console.error("Unexpected error during post submission:", err);
      setMessage({ type: 'error', text: "게시물 작성 중 예상치 못한 오류가 발생했습니다." });
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // 감사 게시물 삭제 핸들러
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
        setThanksPosts(prev => prev.filter(post => post.id !== postId));
        // 페이지 재검증
        try {
          await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/thanks`);
        } catch (revalidateError) {
          console.error("Revalidation failed after post delete:", revalidateError);
        }
      }
    } catch (err) {
      console.error("Unexpected error during post deletion:", err);
      alert("게시물 삭제 중 예상치 못한 오류가 발생했습니다.");
    }
  };

  // 댓글 제출 핸들러
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

    // 사용자가 댓글을 달 수 있는 권한이 있는지 확인
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
    } catch (err) {
      console.error("Unexpected error during comment submission:", err);
      setMessage({ type: 'error', text: "댓글 작성 중 예상치 못한 오류가 발생했습니다." });
    } finally {
      setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  // 반응 추가/제거 핸들러
  const handleReaction = async (postId: string, reactionType: string) => {
    if (!user) {
      setMessage({ type: 'error', text: "로그인 후 반응을 남길 수 있습니다." });
      return;
    }

    const existingReaction = reactions[postId]?.find(r => r.user_id === user.id && r.reaction_type === reactionType);

    try {
      if (existingReaction) {
        // 이미 반응이 있으면 제거
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
        // 반응이 없으면 추가
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

  // 각 반응 타입별 개수 계산
  const getReactionCounts = (postId: string) => {
    const counts: Record<string, number> = {};
    reactions[postId]?.forEach(r => {
      counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
    });
    return counts;
  };

  // 사용자가 특정 반응을 이미 남겼는지 확인
  const hasUserReacted = (postId: string, reactionType: string) => {
    return reactions[postId]?.some(r => r.user_id === user?.id && r.reaction_type === reactionType);
  };

  // 반응 이모티콘 맵
  const reactionEmojis: Record<string, string> = {
    'like': '👍',
    'heart': '❤️',
    'amen': '🙌',
    'smile': '😊',
  };

  // "더보기" 버튼 클릭 핸들러
  const handleLoadMore = () => {
    setVisiblePostsCount(prevCount => prevCount + POSTS_PER_LOAD);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-8 pt-16">
      {/* Admin Controls */}
      {isAdmin && (
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
              <Button variant="outline" size="icon" onClick={handleCancelAll} className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent">
                <X className="h-5 w-5" />
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
              section="hero"
              contentKey="title"
              initialValue={initialContent?.hero?.title || "감사 게시판"}
              onContentChange={(section: string, key: string, value: string) =>
                handleContentChange("hero", "title", value)
              }
              isEditingPage={isPageEditing}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-3xl mx-auto leading-relaxed">
            <EditableText
              page="thanks"
              section="hero"
              contentKey="description"
              initialValue={
                initialContent?.hero?.description ||
                "하나님께 드리는 감사와 은혜를 나누는 공간입니다. 당신의 간증을 공유해주세요."
              }
              onContentChange={(section: string, key: string, value: string) =>
                handleContentChange("hero", "description", value)
              }
              isEditingPage={isPageEditing}
              tag="span"
              className="text-sm md:text-base text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* 감사 게시물 작성 버튼 섹션 */}
      <section className="py-8 bg-gray-100 border-b border-gray-200 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg shadow-md"
              >
                <Edit3 className="mr-2 h-5 w-5" /> 감사 게시물 작성
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
                  <Label htmlFor="postTitle" className="text-blue-900 font-semibold">제목</Label>
                  <Textarea
                    id="postTitle"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="감사 게시물의 제목을 입력하세요."
                    rows={1}
                    required
                    className="mt-1 border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                  />
                </div>
                <div>
                  <Label htmlFor="postContent" className="text-blue-900 font-semibold">내용</Label>
                  <Textarea
                    id="postContent"
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
                <Card key={post.id} className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 min-h-[280px]"> {/* 변경: min-h를 280px로 줄임 */}
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
                          {isSubmittingComment[post.id] ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <MessageCircle className="mr-1 h-3 w-3" />}
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
                        className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs"
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
    </div>
  );
}

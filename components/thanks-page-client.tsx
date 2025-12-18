"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Settings, Save, X, CheckCircle, XCircle,
  PlusCircle, CalendarIcon, Trash2, MessageCircle, Loader2,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import EditableText from "@/components/editable-text";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase";

// 타입 정의
type ThanksPost = Database['public']['Tables']['thanks_posts']['Row'] & {
  author?: { role: string } | null;
};
type ThanksComment = Database['public']['Tables']['thanks_comments']['Row'];
type ThanksReaction = Database['public']['Tables']['thanks_reactions']['Row'];

interface ThanksPageClientProps {
  initialContent: Record<string, any>;
  initialThanksPosts: ThanksPost[];
}

const ITEMS_PER_PAGE = 6; // 페이지당 보여줄 개수

export default function ThanksPageClient({ initialContent, initialThanksPosts }: ThanksPageClientProps) {
  // [수정] userProfile 제거, user 객체 하나만 사용
  const { user } = useAuth();
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 관리자 여부 확인
  const isAdmin = user?.role === 'admin';

  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [thanksPosts, setThanksPosts] = useState<ThanksPost[]>(initialThanksPosts || []);
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
  
  // [추가] 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);

  const thanksPostCategories = [
    { key: "all", labelKey: "all_posts", defaultLabel: "모든 게시물" },
    { key: "answered_prayer", labelKey: "category_answered_prayer", defaultLabel: "응답받은 기도" },
    { key: "personal_testimony", labelKey: "category_personal_testimony", defaultLabel: "개인 간증" },
    { key: "church_support", labelKey: "category_church_support", defaultLabel: "교회 공동체 지원" },
    { key: "blessing", labelKey: "category_blessing", defaultLabel: "일상의 축복" },
    { key: "ministry_impact", labelKey: "category_ministry_impact", defaultLabel: "사역의 열매" },
  ];

  const sortOptions = [
    { value: "created_at_desc", labelKey: "latest_sort", defaultLabel: "최신순" },
    { value: "created_at_asc", labelKey: "oldest_sort", defaultLabel: "오래된순" },
  ];

  // 초기 데이터 설정 및 페이지 리셋
  useEffect(() => {
    setThanksPosts(initialThanksPosts || []);
    setCurrentPage(1); // 필터링이나 데이터 변경 시 1페이지로 이동
  }, [initialThanksPosts]);

  // [수정] 현재 페이지에 해당하는 데이터 계산
  const totalPages = Math.ceil(thanksPosts.length / ITEMS_PER_PAGE);
  const currentPosts = thanksPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const fetchCommentsAndReactions = useCallback(async (postId: string) => {
    const [commentsRes, reactionsRes] = await Promise.all([
      supabase.from('thanks_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true }),
      supabase.from('thanks_reactions').select('*').eq('post_id', postId)
    ]);

    if (commentsRes.data) setComments(prev => ({ ...prev, [postId]: commentsRes.data || [] }));
    if (reactionsRes.data) setReactions(prev => ({ ...prev, [postId]: reactionsRes.data || [] }));
  }, []);

  useEffect(() => {
    if (thanksPosts.length > 0) {
      thanksPosts.forEach(post => {
        if (!comments[post.id] || !reactions[post.id]) fetchCommentsAndReactions(post.id);
      });
    }
  }, [thanksPosts, fetchCommentsAndReactions]);

  const handleFilterChange = useCallback((filterName: string, value: string | Date | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
        if (value instanceof Date) params.set(filterName, format(value, 'yyyy-MM-dd'));
        else params.set(filterName, value as string);
    } else {
        params.delete(filterName);
    }
    
    if (filterName === 'role') setSelectedRoleFilter(value as string);
    if (filterName === 'sort') setSelectedSortBy(value as string);
    if (filterName === 'date') setSelectedDateFilter(value as Date | undefined);

    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const handleContentChange = (section: string, key: string, value: string) => {
    setChangedContent((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [key]: value },
    }));
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    let updateCount = 0;
    for (const section in changedContent) {
      for (const key in changedContent[section]) {
        await supabase.from("content").upsert({
          page: "thanks", section, key, value: changedContent[section][key], updated_at: new Date().toISOString(),
        });
        updateCount++;
      }
    }
    if (updateCount > 0) {
      try { await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/thanks`); } catch(e) {}
      alert("업데이트 완료");
      router.refresh();
    }
    setChangedContent({});
    setIsPageEditing(false);
    setIsSavingAll(false);
  };

  // [수정] 무한 로딩 방지 및 User 객체 사용
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPost(true);
    setMessage(null);

    // 1. 유저 체크 (userProfile 제거)
    if (!user) {
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
        // 2. 작성 제한 체크 (DB 직접 조회)
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) throw new Error("유저 정보를 불러올 수 없습니다.");

        // 타입 안전하게 접근
        const userRecord = userData as any;
        const postCount = (userRecord?.last_post_date === todayStr) ? (userRecord?.thanks_posts_today || 0) : 0;

        if (postCount >= 2) throw new Error("하루 작성 제한(2회)을 초과했습니다.");

        // 3. 게시글 저장 (user 객체의 속성 사용)
        const { error } = await supabase.from('thanks_posts').insert({
            title: newPostTitle,
            content: newPostContent,
            category: newPostCategory,
            author_id: user.id,
            author_nickname: user.nickname || user.email?.split('@')[0] || '익명', // userProfile 대신 user 사용
            author_profile_picture_url: user.profile_picture_url,
            author_role: user.role
        });

        if (error) throw error;

        // 4. 카운트 업데이트
        await supabase.from('users').update({ 
          thanks_posts_today: postCount + 1, 
          last_post_date: todayStr 
        }).eq('id', user.id);
        
        setMessage({ type: 'success', text: "작성 완료!" });
        setNewPostTitle(""); 
        setNewPostContent(""); 
        setIsWriteModalOpen(false);
        router.refresh(); // 데이터 새로고침
        
    } catch (err: any) {
        console.error("Post Error:", err);
        setMessage({ type: 'error', text: err.message || "작성 중 오류가 발생했습니다." });
    } finally {
        // [중요] 반드시 로딩 상태 해제
        setIsSubmittingPost(false);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!user) return alert("로그인이 필요합니다.");
    if (!newCommentContent[postId]?.trim()) return;
    
    setIsSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
        const { data, error } = await supabase.from('thanks_comments').insert({
            post_id: postId,
            author_id: user.id,
            author_nickname: user.nickname || '익명',
            comment: newCommentContent[postId]
        }).select().single();
        
        if (error) throw error;
        setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), data] }));
        setNewCommentContent(prev => ({ ...prev, [postId]: "" }));
    } catch (e: any) {
        alert(e.message);
    } finally {
        setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleReaction = async (postId: string, type: string) => {
    if (!user) return alert("로그인이 필요합니다.");

    setReactions(prev => {
        const currentPostReactions = prev[postId] || [];
        const existing = currentPostReactions.find(r => r.user_id === user.id && r.reaction_type === type);

        if (existing) {
            supabase.from('thanks_reactions').delete().eq('id', existing.id).then();
            return {
                ...prev,
                [postId]: currentPostReactions.filter(r => r.id !== existing.id)
            };
        } else {
            const tempId = 'temp-' + Date.now();
            const temp: ThanksReaction = { 
                id: tempId, 
                post_id: postId, 
                user_id: user.id, 
                reaction_type: type,
                created_at: new Date().toISOString() 
            };

            supabase.from('thanks_reactions').insert({ 
                post_id: postId, 
                user_id: user.id, 
                reaction_type: type 
            }).select().single().then(({ data }) => {
                if (data) {
                    setReactions(innerPrev => ({
                        ...innerPrev,
                        [postId]: (innerPrev[postId] || []).map(r => r.id === tempId ? data : r)
                    }));
                }
            });

            return {
                ...prev,
                [postId]: [...currentPostReactions, temp]
            };
        }
    });
  };

  const handleDeletePost = async (postId: string) => {
      if(!confirm("삭제하시겠습니까?")) return;
      await supabase.from('thanks_posts').delete().eq('id', postId);
      router.refresh();
  };

  const reactionEmojis: Record<string, string> = { 'like': '👍', 'heart': '❤️', 'amen': '🙌', 'smile': '😊' };
  const getReactionCounts = (postId: string) => {
      const counts: Record<string, number> = {};
      reactions[postId]?.forEach(r => counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1);
      return counts;
  };

  // [추가] 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // window.scrollTo({ top: 0, behavior: 'smooth' }); // 필요 시 주석 해제하여 스크롤 이동
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="fixed top-24 right-8 z-50 flex flex-col space-y-2">
          {!isPageEditing ? (
            <Button variant="outline" size="icon" onClick={() => setIsPageEditing(true)} className="bg-white shadow-md">
              <Settings className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={handleSaveAll} disabled={isSavingAll} className="bg-white shadow-md">
                {isSavingAll ? <Loader2 className="animate-spin" /> : <Save className="h-5 w-5 text-green-600" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => {setChangedContent({}); setIsPageEditing(false);}} className="bg-white shadow-md">
                <X className="h-5 w-5 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Hero Section - [수정됨] 높이 축소 (1/3 수준) */}
      <div className="bg-[#0F172A] text-white py-10 border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2 animate-bounce">
            <span className="text-3xl md:text-4xl">🙏</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 italic tracking-tight">
            <EditableText
              page="thanks" section="main" contentKey="title"
              initialValue={initialContent?.main?.title || "GRACE SHARING"}
              onContentChange={(s, k, v) => handleContentChange("main", "title", v)}
              isEditingPage={isPageEditing} tag="span" className="text-white"
            />
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
            <EditableText
              page="thanks" section="main" contentKey="description"
              initialValue={initialContent?.main?.description || "Share your gratitude and testimonies with the community."}
              onContentChange={(s, k, v) => handleContentChange("main", "description", v)}
              isEditingPage={isPageEditing} tag="span" className="text-slate-400" isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Filters & Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white p-6 rounded-[24px] shadow-lg shadow-slate-100 border border-slate-100">
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
              <Select value={selectedRoleFilter} onValueChange={(v) => handleFilterChange('role', v)}>
                <SelectTrigger className="w-full md:w-[180px] rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {thanksPostCategories.map(cat => (
                    <SelectItem key={cat.key} value={cat.key}>{cat.defaultLabel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSortBy} onValueChange={(v) => handleFilterChange('sort', v)}>
                <SelectTrigger className="w-full md:w-[140px] rounded-xl border-slate-200 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.defaultLabel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-xl border-slate-200 bg-slate-50 text-slate-600 font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" /> 
                    {selectedDateFilter ? format(selectedDateFilter, "yyyy-MM-dd") : "Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl">
                  <Calendar mode="single" selected={selectedDateFilter} onSelect={(d) => handleFilterChange('date', d)} initialFocus />
                </PopoverContent>
              </Popover>
              {selectedDateFilter && (
                <Button variant="ghost" size="icon" onClick={() => handleFilterChange('date', undefined)} className="text-red-400 hover:bg-red-50 rounded-xl">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-blue-200 transition-all text-lg">
                  <PlusCircle className="mr-2 h-5 w-5" /> Share Grace
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl rounded-[32px] p-0 border-none shadow-2xl overflow-hidden">
                <DialogHeader className="bg-[#0F172A] p-8 text-white">
                  <DialogTitle className="text-2xl font-bold italic">Share Your Grace</DialogTitle>
                  <DialogDescription className="text-slate-400">오늘 하나님께서 주신 은혜를 나누어주세요.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePostSubmit} className="p-8 space-y-6 bg-white">
                  {message && (
                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                      <AlertTitle>{message.type === 'error' ? "Error" : "Success"}</AlertTitle>
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Category</Label>
                    <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {thanksPostCategories.slice(1).map(c => <SelectItem key={c.key} value={c.key}>{c.defaultLabel}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Title</Label>
                    <Input value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} className="h-12 rounded-xl border-slate-200 bg-slate-50" placeholder="제목을 입력하세요" maxLength={30} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Content</Label>
                    <Textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="min-h-[150px] rounded-xl border-slate-200 bg-slate-50 resize-none p-4" placeholder="내용을 입력하세요 (300자 이내)" maxLength={300} required />
                  </div>
                  <Button type="submit" disabled={isSubmittingPost} className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg">
                    {isSubmittingPost ? <Loader2 className="animate-spin" /> : "Post"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Posts Grid */}
          {thanksPosts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-slate-200">
              <p className="text-slate-400 text-lg">아직 게시물이 없습니다. 첫 은혜를 나누어주세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <Card key={post.id} className="group rounded-[32px] border-none shadow-lg shadow-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden flex flex-col h-full">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {thanksPostCategories.find(c => c.key === post.category)?.defaultLabel || post.category}
                      </Badge>
                      <span className="text-slate-400 text-xs font-medium">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={post.author_profile_picture_url || ""} />
                        <AvatarFallback className="bg-slate-100 text-slate-500 font-bold">{post.author_nickname?.slice(0,1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-bold text-slate-900">{post.author_nickname}</CardTitle>
                        {(post.author?.role === 'admin' || post.author_role === 'admin') && 
                          <span className="text-[10px] text-blue-600 font-black uppercase tracking-wider">ADMIN</span>
                        }
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 pt-2 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.content}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2">
                      {Object.entries(reactionEmojis).map(([type, emoji]) => {
                        const count = reactions[post.id]?.filter(r => r.reaction_type === type).length || 0;
                        const isReacted = reactions[post.id]?.some(r => r.user_id === user?.id && r.reaction_type === type);
                        return (
                          <button 
                            key={type} 
                            onClick={() => handleReaction(post.id, type)}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all",
                              isReacted ? "bg-blue-50 text-blue-600 ring-1 ring-blue-100" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                            )}
                          >
                            <span>{emoji}</span>
                            {count > 0 && <span className="text-xs">{count}</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Comments Preview */}
                    {comments[post.id]?.length > 0 && (
                      <div className="mt-4 bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageCircle className="h-3 w-3 text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">{comments[post.id].length} Comments</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          <span className="font-bold mr-1">{comments[post.id][0].author_nickname}:</span>
                          {comments[post.id][0].comment}
                        </p>
                      </div>
                    )}

                    {/* Comment Input */}
                    {user && (user.can_comment || isAdmin) && (
                      <div className="mt-4 flex gap-2">
                        <Input 
                          value={newCommentContent[post.id] || ""}
                          onChange={(e) => setNewCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="댓글 달기..."
                          className="h-9 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleCommentSubmit(post.id)}
                          disabled={isSubmittingComment[post.id]}
                          className="h-9 px-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {isAdmin && (
                        <Button variant="ghost" onClick={() => handleDeletePost(post.id)} className="mt-2 text-red-400 hover:text-red-600 hover:bg-red-50 w-full h-8 text-xs">
                            <Trash2 className="h-3 w-3 mr-1" /> 삭제
                        </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* [추가] 페이지네이션 컨트롤 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                disabled={currentPage === 1}
                className="rounded-full border-slate-200 hover:border-blue-300 hover:text-blue-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-10 h-10 rounded-full font-bold transition-all",
                      currentPage === page 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                        : "border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
                    )}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                disabled={currentPage === totalPages}
                className="rounded-full border-slate-200 hover:border-blue-300 hover:text-blue-600"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
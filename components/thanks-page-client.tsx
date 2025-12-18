"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, CalendarIcon, MessageCircle, Loader2, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase";

type ThanksPost = Database['public']['Tables']['thanks_posts']['Row'];
type ThanksComment = Database['public']['Tables']['thanks_comments']['Row'];
type ThanksReaction = Database['public']['Tables']['thanks_reactions']['Row'];

const ITEMS_PER_PAGE = 4;

export default function ThanksPageClient({ initialContent, initialThanksPosts }: { initialContent: any, initialThanksPosts: ThanksPost[] }) {
  const { user, userProfile, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [thanksPosts, setThanksPosts] = useState<ThanksPost[]>(initialThanksPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<string>("answered_prayer");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [comments, setComments] = useState<Record<string, ThanksComment[]>>({});
  const [reactions, setReactions] = useState<Record<string, ThanksReaction[]>>({});
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ThanksPost | null>(null);

  const categories = [
    { key: "all", label: t('thanks.filter_all') },
    { key: "answered_prayer", label: t('thanks.category_answered_prayer') },
    { key: "personal_testimony", label: t('thanks.category_personal_testimony') },
    { key: "church_support", label: t('thanks.category_church_support') },
    { key: "blessing", label: t('thanks.category_blessing') },
  ];

  const totalPages = Math.ceil(thanksPosts.length / ITEMS_PER_PAGE);
  const currentItems = thanksPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const fetchExtras = useCallback(async (postId: string) => {
    const { data: c } = await supabase.from('thanks_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    setComments(p => ({ ...p, [postId]: c || [] }));
    const { data: r } = await supabase.from('thanks_reactions').select('*').eq('post_id', postId);
    setReactions(p => ({ ...p, [postId]: r || [] }));
  }, []);

  useEffect(() => {
    setThanksPosts(initialThanksPosts);
    setCurrentPage(1);
    initialThanksPosts.forEach(post => fetchExtras(post.id));
  }, [initialThanksPosts, fetchExtras]);

  const handleFilter = (name: string, val: any) => {
    const params = new URLSearchParams(searchParams.toString());
    val ? params.set(name, name === 'date' ? format(val, 'yyyy-MM-dd') : val) : params.delete(name);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;
    if (newPostTitle.length > 20 || newPostContent.length > 300) return;

    setIsSubmittingPost(true);

    try {
      // 1. DB에서 최신 카운트 정보 조회
      const { data: latestUserData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw new Error("Could not verify user post limit.");

      const todayStr = new Date().toISOString().split('T')[0];
      // 타입 오류 방지를 위해 any 타입으로 캐스팅하여 접근
      const latestProfile = latestUserData as any;
      let postCountToday = latestProfile.thanks_posts_today || 0;
      const lastPostDate = latestProfile.last_post_date;

      if (lastPostDate !== todayStr) {
        postCountToday = 0;
      }

      if (postCountToday >= 2) {
        alert(t('thanks.error_limit_reached') || "You can only post twice a day.");
        setIsSubmittingPost(false);
        return;
      }

      // 2. 게시물 저장
      const { error: postError } = await supabase.from('thanks_posts').insert({
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        author_id: user.id,
        author_nickname: userProfile.nickname || 'Anonymous',
        author_profile_picture_url: userProfile.profile_picture_url,
        author_role: userProfile.role,
      });

      if (postError) throw postError;

      // 3. 유저 데이터 업데이트 (새로운 컬럼들)
      const updateData = {
        thanks_posts_today: postCountToday + 1,
        last_post_date: todayStr
      };

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 4. Context 상태 업데이트 (ts 에러 방지를 위해 as any 사용)
      if (updateUserProfile) {
        await updateUserProfile(updateData as any);
      }

      setIsWriteModalOpen(false);
      setNewPostTitle("");
      setNewPostContent("");
      router.refresh();
      alert(t('thanks.success_post') || "Post registered successfully!");

    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleReaction = async (postId: string, type: string) => {
    if (!user) return;
    const existing = reactions[postId]?.find(r => r.user_id === user.id && r.reaction_type === type);
    if (existing) {
      await supabase.from('thanks_reactions').delete().eq('id', existing.id);
      setReactions(p => ({ ...p, [postId]: p[postId].filter(r => r.id !== existing.id) }));
    } else {
      const { data } = await supabase.from('thanks_reactions').insert({ post_id: postId, user_id: user.id, reaction_type: type }).select().single();
      if (data) setReactions(p => ({ ...p, [postId]: [...(p[postId] || []), data] }));
    }
  };

  const emojiMap: Record<string, string> = { 'like': '👍', 'heart': '❤️', 'amen': '🙌' };

  return (
    <div className="min-h-screen bg-slate-50 py-12 pt-20 text-left">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-blue-900 italic uppercase tracking-tight">{t('thanks.title')}</h1>
          <p className="text-slate-400 mt-2">{t('thanks.description')}</p>
        </div>

        {/* 필터 및 작성 버튼 */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex gap-2">
            <Select value={searchParams.get('role') || 'all'} onValueChange={(v) => handleFilter('role', v)}>
              <SelectTrigger className="w-[160px] rounded-xl"><SelectValue placeholder={t('thanks.placeholder_category')} /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-xl"><CalendarIcon className="mr-2 h-4 w-4" /> {searchParams.get('date') || t('thanks.btn_date')}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-3xl"><Calendar mode="single" onSelect={(d) => handleFilter('date', d)} /></PopoverContent>
            </Popover>
          </div>

          <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
            <DialogTrigger asChild><Button className="bg-blue-600 rounded-xl px-8 font-bold text-white shadow-lg"><PlusCircle className="mr-2 h-5 w-5" /> {t('thanks.btn_write')}</Button></DialogTrigger>
            <DialogContent className="max-w-xl rounded-3xl overflow-hidden">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-900">{t('thanks.modal_title')}</DialogTitle>
                <DialogDescription>{t('thanks.modal_description')}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePostSubmit} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>{t('thanks.label_category')}</Label>
                  <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.slice(1).map(c => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{t('thanks.label_title')}</Label>
                    <span className={cn("text-[10px] font-bold", newPostTitle.length > 20 ? "text-red-500" : "text-slate-300")}>{newPostTitle.length} / 20</span>
                  </div>
                  <Textarea value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} placeholder={t('thanks.placeholder_title')} className="rounded-xl h-12 bg-slate-50 border-none p-3 font-medium" maxLength={20} required />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{t('thanks.label_content')}</Label>
                    <span className={cn("text-[10px] font-bold", newPostContent.length > 300 ? "text-red-500" : "text-slate-300")}>{newPostContent.length} / 300</span>
                  </div>
                  <Textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder={t('thanks.placeholder_content')} className="rounded-xl min-h-[150px] bg-slate-50 border-none p-3 font-medium" maxLength={300} required />
                </div>
                <Button type="submit" disabled={isSubmittingPost || newPostTitle.length > 20 || newPostContent.length > 300} className="w-full bg-blue-600 h-12 rounded-xl font-bold text-white">
                  {isSubmittingPost ? <Loader2 className="animate-spin" /> : t('thanks.btn_submit')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 게시물 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px] content-start">
          {currentItems.map((post) => (
            <Card 
              key={post.id} 
              className="rounded-3xl border-none shadow-sm bg-white overflow-hidden h-fit transition-all hover:shadow-md cursor-pointer group"
              onClick={() => setSelectedPost(post)}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12 rounded-2xl border-2 border-blue-50">
                  <AvatarImage src={post.author_profile_picture_url || ""} />
                  <AvatarFallback className="bg-blue-50 text-blue-400 font-bold">{post.author_nickname?.slice(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-slate-800 truncate">{post.author_nickname}</CardTitle>
                    <Badge className="bg-slate-50 text-slate-400 border-none text-[10px] uppercase font-bold shrink-0">{t(`thanks.cat_${post.category}`)}</Badge>
                  </div>
                  <CardDescription className="text-xs">{format(new Date(post.created_at), 'MMM dd, yyyy')}</CardDescription>
                </div>
                <Maximize2 className="h-4 w-4 text-slate-200 group-hover:text-blue-400 transition-colors shrink-0" />
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-bold text-blue-900 leading-tight whitespace-pre-wrap break-words">{post.title}</h3>
                <p className="text-slate-600 text-sm whitespace-pre-wrap line-clamp-3 leading-relaxed">{post.content}</p>
                <div className="flex gap-2 pt-4 border-t border-slate-50" onClick={(e) => e.stopPropagation()}>
                  {Object.entries(emojiMap).map(([type, emoji]) => (
                    <button key={type} onClick={() => handleReaction(post.id, type)} className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all",
                      reactions[post.id]?.some(r => r.user_id === user?.id && r.reaction_type === type) ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    )}>
                      <span>{emoji}</span>
                      <span className="text-xs">{reactions[post.id]?.filter(r => r.reaction_type === type).length || 0}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-8">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-xl">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button key={i} variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)} className={cn("w-10 h-10 rounded-xl font-bold", currentPage === i + 1 && "bg-blue-600 text-white")}>{i + 1}</Button>
            ))}
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-xl">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* 상세 팝업 */}
        <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
          <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-white flex flex-col">
            {selectedPost && (
              <>
                <div className="bg-blue-900 p-8 text-white shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12 rounded-xl border border-white/20">
                      <AvatarImage src={selectedPost.author_profile_picture_url || ""} />
                      <AvatarFallback className="bg-white/10 text-white font-bold">{selectedPost.author_nickname?.slice(0,1)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <h4 className="text-lg font-bold">{selectedPost.author_nickname}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                         <Badge className="bg-blue-600/30 text-blue-100 border-none text-[9px] uppercase font-bold">{t(`thanks.cat_${selectedPost.category}`)}</Badge>
                         <span className="text-blue-300 text-[10px]">{format(new Date(selectedPost.created_at), 'MMMM dd, yyyy HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                  <DialogTitle className="text-2xl md:text-3xl font-black italic tracking-tight leading-tight text-left whitespace-pre-wrap break-words">
                    {selectedPost.title}
                  </DialogTitle>
                </div>

                <div className="p-10 bg-white text-left">
                  <DialogDescription className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap font-medium line-clamp-none opacity-100 break-words overflow-visible">
                    {selectedPost.content}
                  </DialogDescription>
                  
                  <div className="flex gap-2 mt-12 pt-6 border-t border-slate-50 shrink-0">
                    {Object.entries(emojiMap).map(([type, emoji]) => (
                      <button key={type} onClick={() => handleReaction(selectedPost.id, type)} className={cn(
                        "flex items-center gap-2 px-5 py-2 rounded-xl text-base font-bold transition-all",
                        reactions[selectedPost.id]?.some(r => r.user_id === user?.id && r.reaction_type === type) ? "bg-blue-600 text-white shadow-md" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      )}>
                        <span>{emoji}</span>
                        <span className="text-xs">{reactions[selectedPost.id]?.filter(r => r.reaction_type === type).length || 0}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
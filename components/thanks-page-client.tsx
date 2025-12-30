"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, MessageCircle, PlusCircle, Trash2, Loader2, Sparkles, 
  ChevronLeft, ChevronRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko, enUS, ru } from "date-fns/locale";
import { cn } from "@/lib/utils";

// 타입 정의
interface ThanksPost {
  id: string;
  category: "grace" | "daily" | "family" | "church";
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  author_profile_picture_url: string | null;
  created_at: string;
}

interface ThanksPageClientProps {
  initialPosts: ThanksPost[];
}

const ITEMS_PER_PAGE = 6;

export default function ThanksPageClient({ initialPosts }: ThanksPageClientProps) {
  const { user, userRole } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [posts, setPosts] = useState<ThanksPost[]>(initialPosts || []);
  const [isMounted, setIsMounted] = useState(false);
  
  // 필터 및 페이지네이션
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // 작성 모달 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newPostCategory, setNewPostCategory] = useState<string>("grace");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 데이터 새로고침 함수
  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from('thanks_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setPosts(data as ThanksPost[]);
    }
  }, []);

  // 로케일 설정
  const getDateLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'ru': return ru;
      default: return ko;
    }
  };

  // 카테고리 정의
  const categories = [
    { id: "all", labelKey: "thanks.filter_all", color: "bg-slate-100 text-slate-700" },
    { id: "grace", labelKey: "thanks.category.grace", color: "bg-pink-100 text-pink-700" },
    { id: "daily", labelKey: "thanks.category.daily", color: "bg-green-100 text-green-700" },
    { id: "family", labelKey: "thanks.category.family", color: "bg-orange-100 text-orange-700" },
    { id: "church", labelKey: "thanks.category.church", color: "bg-blue-100 text-blue-700" },
  ];

  // 하루 3회 작성 제한 체크 함수
  const checkDailyLimit = async () => {
    if (!user) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 00:00:00

    const { count } = await supabase
      .from('thanks_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user.id)
      .gte('created_at', today.toISOString());

    return (count || 0) >= 3;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert(t('common.login_required'));

    // [수정] 제목과 내용 빈 값 체크
    if (!newPostTitle.trim() || !newPostContent.trim()) {
        return alert(t('thanks.alert.required_fields')); 
    }
    
    setIsSubmitting(true);

    try {
        // 1. 하루 3회 제한 확인
        const isLimitReached = await checkDailyLimit();
        if (isLimitReached) {
            alert(t('thanks.alert.daily_limit') || "Daily limit reached.");
            setIsSubmitting(false);
            return;
        }

        // 2. 글 작성
        const { error } = await supabase.from('thanks_posts').insert({
            category: newPostCategory,
            title: newPostTitle,
            content: newPostContent,
            author_id: user.id,
            author_nickname: user.nickname || user.email?.split('@')[0],
            author_profile_picture_url: user.profile_picture_url
        });

        if (!error) {
            alert(t('thanks.alert.success'));
            setIsWriteModalOpen(false);
            setNewPostTitle("");
            setNewPostContent("");
            
            // 3. 목록 즉시 갱신
            fetchPosts(); 
        } else {
            alert(t('common.error') + ": " + error.message);
        }
    } catch (err) {
        console.error(err);
        alert(t('common.error'));
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('common.confirm_delete'))) return;
    
    const { error } = await supabase.from('thanks_posts').delete().eq('id', id);
    if (!error) {
        fetchPosts();
    }
  };

  // 필터링 및 페이지네이션 로직
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") return posts;
    return posts.filter(p => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-[#0F172A] text-white py-10 border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2 animate-bounce">
            <span className="text-3xl md:text-4xl">✨</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 italic tracking-tight">
            {t('thanks.hero.title')}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
            {t('thanks.hero.desc')}
          </p>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white p-6 rounded-[24px] shadow-lg shadow-slate-100 border border-slate-100">
             <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
                <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setCurrentPage(1); }}>
                    <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(c => (
                            <SelectItem key={c.id} value={c.id}>{t(c.labelKey)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>

             <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-blue-200 transition-all text-lg">
                        <PlusCircle className="mr-2 h-5 w-5" /> {t('thanks.button.share')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl rounded-[32px] p-0 border-none shadow-2xl overflow-hidden">
                    <DialogHeader className="bg-[#0F172A] p-8 text-white">
                        <DialogTitle className="text-2xl font-bold italic">{t('thanks.modal.title')}</DialogTitle>
                        <DialogDescription className="text-slate-400">{t('thanks.modal.desc')}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="p-8 space-y-6 bg-white">
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">{t('thanks.modal.label.category')}</Label>
                            <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {categories.filter(c => c.id !== 'all').map(c => (
                                        <SelectItem key={c.id} value={c.id}>{t(c.labelKey)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">{t('thanks.modal.label.title')}</Label>
                            <Input 
                                value={newPostTitle} 
                                onChange={e => setNewPostTitle(e.target.value)} 
                                placeholder={t('thanks.modal.placeholder.title')} 
                                className="h-12 rounded-xl border-slate-200 bg-slate-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">{t('thanks.modal.label.content')}</Label>
                            <Textarea 
                                value={newPostContent} 
                                onChange={e => setNewPostContent(e.target.value)} 
                                placeholder={t('thanks.modal.placeholder.content')} 
                                rows={5}
                                className="min-h-[150px] rounded-xl border-slate-200 bg-slate-50 p-4"
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : t('thanks.modal.button.submit')}
                        </Button>
                    </form>
                </DialogContent>
             </Dialog>
          </div>

          {filteredPosts.length === 0 ? (
             <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-slate-200">
                <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400 text-lg">{t('thanks.list.empty')}</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map(post => {
                   const categoryInfo = categories.find(c => c.id === post.category);
                   return (
                   <Card key={post.id} className="group rounded-[32px] border-none shadow-lg shadow-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden flex flex-col h-full">
                       <CardHeader className="p-6 pb-2">
                           <div className="flex items-center justify-between mb-4">
                               <Badge variant="secondary" className={cn("border-none px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", categoryInfo?.color)}>
                                   {categoryInfo ? t(categoryInfo.labelKey) : post.category}
                               </Badge>
                               <span className="text-slate-400 text-xs font-medium">
                                   {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: getDateLocale() })}
                               </span>
                           </div>
                           <div className="flex items-center gap-3">
                               <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                   <AvatarImage src={post.author_profile_picture_url || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author_nickname}`} />
                                   <AvatarFallback className="bg-slate-100 text-slate-500 font-bold">{post.author_nickname?.[0]}</AvatarFallback>
                               </Avatar>
                               <div>
                                   <CardTitle className="text-base font-bold text-slate-900">{post.author_nickname}</CardTitle>
                               </div>
                           </div>
                       </CardHeader>
                       
                       <CardContent className="p-6 pt-2 flex-grow">
                           <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                               {post.title}
                           </h3>
                           <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-4 whitespace-pre-line">
                               {post.content}
                           </p>
                       </CardContent>

                       <CardFooter className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
                           <div className="flex gap-2">
                               <Button variant="ghost" size="sm" className="text-slate-500 hover:text-pink-500 hover:bg-pink-50 rounded-full h-9">
                                   <Heart className="w-4 h-4 mr-1.5" />
                                   <span className="text-xs font-bold">{t('common.like')}</span>
                               </Button>
                               <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-500 hover:bg-blue-50 rounded-full h-9">
                                   <MessageCircle className="w-4 h-4 mr-1.5" />
                                   <span className="text-xs font-bold">{t('common.comment')}</span>
                               </Button>
                           </div>

                           {(user?.id === post.author_id || userRole === 'admin') && (
                             <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full h-9 w-9 p-0" onClick={() => handleDelete(post.id)}>
                                 <Trash2 className="w-4 h-4" />
                             </Button>
                           )}
                       </CardFooter>
                   </Card>
               )})}
             </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button variant="outline" size="icon" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="rounded-full border-slate-200 hover:border-blue-300 hover:text-blue-600">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button key={page} variant={currentPage === page ? "default" : "outline"} onClick={() => setCurrentPage(page)} className={cn("w-10 h-10 rounded-full font-bold transition-all", currentPage === page ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600")}>
                    {page}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="rounded-full border-slate-200 hover:border-blue-300 hover:text-blue-600">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, MessageCircle, PlusCircle, Trash2, Edit3, CheckCircle2, 
  Loader2, Bookmark, ChevronLeft, ChevronRight
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface PrayerRequest {
  id: string;
  category: "ukraine" | "bozhiymirchurch" | "members" | "children";
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  created_at: string;
  answer_content?: string | null;
  answer_author_id?: string | null;
  answer_author_nickname?: string | null;
  answered_at?: string | null;
}

interface PrayerPageClientProps {
  initialPrayerRequests: PrayerRequest[];
}

const ITEMS_PER_PAGE = 6;

export default function PrayerPageClient({ initialPrayerRequests }: PrayerPageClientProps) {
  const { user, userRole } = useAuth(); // userProfile 제거
  const { t } = useLanguage();
  const router = useRouter();

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(initialPrayerRequests || []);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // 작성 모달 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newPostCategory, setNewPostCategory] = useState<string>("ukraine");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 답변 상태
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categories = [
    { id: "all", labelKey: "prayer.category.all" },
    { id: "ukraine", labelKey: "prayer.category.ukraine" },
    { id: "bozhiymirchurch", labelKey: "prayer.category.church" },
    { id: "members", labelKey: "prayer.category.members" },
    { id: "children", labelKey: "prayer.category.children" },
  ];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert(t('common.login_required'));
    setIsSubmitting(true);

    const { error } = await supabase.from('prayer_requests').insert({
      category: newPostCategory,
      title: newPostTitle,
      content: newPostContent,
      author_id: user.id,
      author_nickname: user.nickname || user.email?.split('@')[0], // user 객체 직접 사용
    });

    if (!error) {
      alert(t('prayer.alert.success'));
      setIsWriteModalOpen(false);
      setNewPostTitle("");
      setNewPostContent("");
      router.refresh();
    } else {
      alert(t('common.error') + ": " + error.message);
    }
    setIsSubmitting(false);
  };

  const handleSaveAnswer = async (prayerId: string) => {
    if (!user) return;
    const { error } = await supabase.from('prayer_requests').update({
        answer_content: currentAnswer,
        answer_author_id: user.id,
        answer_author_nickname: user.nickname, // user 객체 사용
        answered_at: new Date().toISOString()
    }).eq('id', prayerId);

    if (!error) {
        setPrayerRequests(prev => prev.map(p => p.id === prayerId ? {
            ...p, 
            answer_content: currentAnswer,
            answer_author_id: user.id,
            answer_author_nickname: user.nickname || '',
            answered_at: new Date().toISOString()
        } : p));
        setEditingAnswerId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('common.confirm_delete'))) return;
    const { error } = await supabase.from('prayer_requests').delete().eq('id', id);
    if (!error) {
        setPrayerRequests(prev => prev.filter(p => p.id !== id));
        router.refresh();
    }
  };

  const filteredRequests = useMemo(() => {
    if (selectedCategory === "all") return prayerRequests;
    return prayerRequests.filter(p => p.category === selectedCategory);
  }, [prayerRequests, selectedCategory]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero Section (Thanks 스타일) */}
      <div className="bg-[#0F172A] text-white py-10 border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2 animate-bounce">
            <span className="text-3xl md:text-4xl">🕯️</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 italic tracking-tight">
            {t('prayer.hero.title')}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
            {t('prayer.hero.desc')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Filters & Actions (Thanks 스타일) */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white p-6 rounded-[24px] shadow-lg shadow-slate-100 border border-slate-100">
             <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
                <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setCurrentPage(1); }}>
                    <SelectTrigger className="w-full md:w-[200px] h-12 rounded-xl border-slate-200 bg-slate-50">
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
                        <PlusCircle className="mr-2 h-5 w-5" /> {t('prayer.button.share')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl rounded-[32px] p-0 border-none shadow-2xl overflow-hidden">
                    <DialogHeader className="bg-[#0F172A] p-8 text-white">
                        <DialogTitle className="text-2xl font-bold italic">{t('prayer.modal.title')}</DialogTitle>
                        <DialogDescription className="text-slate-400">{t('prayer.modal.desc')}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="p-8 space-y-6 bg-white">
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">{t('prayer.modal.label.category')}</Label>
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
                            <Label className="font-bold text-slate-700">{t('prayer.modal.label.title')}</Label>
                            <Textarea 
                                value={newPostTitle} 
                                onChange={e => setNewPostTitle(e.target.value)} 
                                placeholder={t('prayer.modal.placeholder.title')} 
                                rows={1}
                                className="resize-none h-12 rounded-xl border-slate-200 bg-slate-50 pt-3"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">{t('prayer.modal.label.content')}</Label>
                            <Textarea 
                                value={newPostContent} 
                                onChange={e => setNewPostContent(e.target.value)} 
                                placeholder={t('prayer.modal.placeholder.content')} 
                                rows={5}
                                className="min-h-[150px] rounded-xl border-slate-200 bg-slate-50 p-4"
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : t('prayer.modal.button.submit')}
                        </Button>
                    </form>
                </DialogContent>
             </Dialog>
          </div>

          {/* Grid */}
          {filteredRequests.length === 0 ? (
             <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-slate-200">
                <p className="text-slate-400 text-lg">{t('prayer.list.empty')}</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentRequests.map(req => (
                    <Card key={req.id} className="group rounded-[32px] border-none shadow-lg shadow-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden flex flex-col h-full">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex items-center justify-between mb-4">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {categories.find(c => c.id === req.category) ? t(categories.find(c => c.id === req.category)!.labelKey) : req.category}
                                </Badge>
                                <span className="text-slate-400 text-xs font-medium">{formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${req.author_nickname}`} />
                                    <AvatarFallback className="bg-slate-100 text-slate-500 font-bold">{req.author_nickname[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base font-bold text-slate-900">{req.author_nickname}</CardTitle>
                                    {req.answer_content && (
                                        <div className="flex items-center text-[10px] text-green-600 font-black uppercase tracking-wider mt-0.5">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> {t('prayer.status.answered')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-6 pt-2 flex-grow">
                            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                                {req.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 whitespace-pre-line">
                                {req.content}
                            </p>

                            {/* 응답 */}
                            {req.answer_content && (
                                <div className="mt-4 p-4 bg-green-50/50 rounded-2xl border border-green-100 text-sm text-slate-600">
                                    <div className="flex items-center gap-2 mb-2 text-green-700 font-bold text-xs uppercase tracking-wide">
                                        <Bookmark className="w-3 h-3" /> {t('prayer.label.answer_note')}
                                    </div>
                                    {req.answer_content}
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="pt-2 pb-4 border-t border-slate-50 bg-slate-50/30 flex flex-col gap-3">
                            {/* 작성자/관리자 액션 */}
                            {(user?.id === req.author_id || userRole === 'admin') && (
                                <div className="w-full flex justify-end gap-2 px-2">
                                    {editingAnswerId === req.id ? (
                                        <div className="w-full space-y-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <Textarea 
                                                value={currentAnswer} 
                                                onChange={(e) => setCurrentAnswer(e.target.value)} 
                                                className="bg-slate-50 border-none text-sm resize-none focus:ring-0"
                                                placeholder={t('prayer.modal.placeholder.answer')}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => setEditingAnswerId(null)} className="h-8 text-xs">{t('common.cancel')}</Button>
                                                <Button size="sm" onClick={() => handleSaveAnswer(req.id)} className="h-8 text-xs bg-slate-900 text-white">{t('common.save')}</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            {(userRole === 'admin' || user?.id === req.author_id) && (
                                                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => {
                                                    setEditingAnswerId(req.id);
                                                    setCurrentAnswer(req.answer_content || "");
                                                }}>
                                                    <Edit3 className="w-3 h-3 mr-1" /> {req.answer_content ? t('prayer.button.edit_answer') : t('prayer.button.write_answer')}
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDelete(req.id)}>
                                                <Trash2 className="w-3 h-3 mr-1" /> {t('common.delete')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <div className="w-full flex items-center justify-between px-2">
                                <Button variant="ghost" size="sm" className="flex-1 text-slate-500 hover:text-pink-500 hover:bg-pink-50 rounded-xl h-10">
                                    <Heart className="w-4 h-4 mr-2" />
                                    <span className="font-bold text-xs">{t('prayer.button.pray_together')}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl h-10 w-10 p-0">
                                    <MessageCircle className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
             </div>
          )}

          {/* 페이지네이션 */}
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
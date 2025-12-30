"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, MessageCircle, PlusCircle, Trash2, Edit3, CheckCircle2, 
  Loader2, Bookmark
} from "lucide-react";
import { format } from "date-fns";

// 타입 정의 유지
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

export default function PrayerPageClient({ initialPrayerRequests }: PrayerPageClientProps) {
  const { user, userProfile, userRole } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(initialPrayerRequests || []);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newPostCategory, setNewPostCategory] = useState<string>("ukraine");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 카테고리 정의 (키값으로 관리)
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
      author_nickname: userProfile?.nickname || user.email?.split('@')[0],
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
        answer_author_nickname: userProfile?.nickname,
        answered_at: new Date().toISOString()
    }).eq('id', prayerId);

    if (!error) {
        setPrayerRequests(prev => prev.map(p => p.id === prayerId ? {
            ...p, 
            answer_content: currentAnswer,
            answer_author_id: user.id,
            answer_author_nickname: userProfile?.nickname || '',
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

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-16">
      {/* 1. Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <Heart className="w-8 h-8 text-pink-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            {t('prayer.hero.title')}
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            {t('prayer.hero.desc')}
          </p>
          
          <div className="mt-8">
             <Button 
                onClick={() => setIsWriteModalOpen(true)}
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-6 rounded-full shadow-lg text-lg"
             >
                <PlusCircle className="w-5 h-5 mr-2" />
                {t('prayer.button.share')}
             </Button>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
         <div className="container mx-auto px-4 py-4 overflow-x-auto">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-full inline-flex w-auto min-w-full md:min-w-0">
                    {categories.map(cat => (
                        <TabsTrigger 
                            key={cat.id} 
                            value={cat.id}
                            className="rounded-full px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all"
                        >
                            {t(cat.labelKey)}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
         </div>
      </div>

      {/* 3. Main Feed */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredRequests.map(req => (
               <Card key={req.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full">
                   <CardHeader className="pb-3 flex flex-row items-start justify-between">
                       <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10 border border-slate-100">
                               <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${req.author_nickname}`} />
                               <AvatarFallback>{req.author_nickname[0]}</AvatarFallback>
                           </Avatar>
                           <div>
                               <div className="font-bold text-gray-900 text-sm">{req.author_nickname}</div>
                               <div className="text-xs text-gray-500">{format(new Date(req.created_at), "yyyy.MM.dd")}</div>
                           </div>
                       </div>
                       {req.answer_content && (
                           <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                               <CheckCircle2 className="w-3 h-3 mr-1" /> {t('prayer.status.answered')}
                           </Badge>
                       )}
                   </CardHeader>
                   
                   <CardContent className="pb-4 flex-grow">
                       <div className="mb-2">
                            <Badge variant="secondary" className="text-xs text-slate-500 bg-slate-100 hover:bg-slate-200">
                                {categories.find(c => c.id === req.category) ? t(categories.find(c => c.id === req.category)!.labelKey) : req.category}
                            </Badge>
                       </div>
                       <h3 className="text-lg font-bold text-gray-900 mb-2">{req.title}</h3>
                       <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                           {req.content}
                       </p>

                       {/* 응답 내용 표시 */}
                       {req.answer_content && (
                           <div className="mt-4 p-3 bg-green-50/50 rounded-lg border border-green-100 text-sm text-gray-700">
                               <div className="flex items-center gap-2 mb-1 text-green-700 font-bold text-xs">
                                   <Bookmark className="w-3 h-3" /> {t('prayer.label.answer_note')}
                               </div>
                               {req.answer_content}
                           </div>
                       )}
                   </CardContent>

                   {/* 카드 푸터: 인터랙션 */}
                   <CardFooter className="pt-2 pb-4 border-t border-gray-50 bg-gray-50/30 flex flex-col gap-3">
                       {/* 관리자/작성자 전용 액션 */}
                       {(user?.id === req.author_id || userRole === 'admin') && (
                           <div className="w-full flex justify-end gap-2 mb-2">
                               {editingAnswerId === req.id ? (
                                   <div className="w-full space-y-2">
                                       <Textarea 
                                           value={currentAnswer} 
                                           onChange={(e) => setCurrentAnswer(e.target.value)} 
                                           className="bg-white text-sm"
                                           placeholder={t('prayer.modal.placeholder.answer')}
                                       />
                                       <div className="flex justify-end gap-2">
                                           <Button size="sm" variant="ghost" onClick={() => setEditingAnswerId(null)}>{t('common.cancel')}</Button>
                                           <Button size="sm" onClick={() => handleSaveAnswer(req.id)}>{t('common.save')}</Button>
                                       </div>
                                   </div>
                               ) : (
                                   <>
                                      {(userRole === 'admin' || user?.id === req.author_id) && (
                                         <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500" onClick={() => {
                                             setEditingAnswerId(req.id);
                                             setCurrentAnswer(req.answer_content || "");
                                         }}>
                                             <Edit3 className="w-3 h-3 mr-1" /> {req.answer_content ? t('prayer.button.edit_answer') : t('prayer.button.write_answer')}
                                         </Button>
                                      )}
                                      <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(req.id)}>
                                          <Trash2 className="w-3 h-3 mr-1" /> {t('common.delete')}
                                      </Button>
                                   </>
                               )}
                           </div>
                       )}

                       <div className="w-full flex items-center justify-between">
                           <Button variant="outline" size="sm" className="flex-1 mr-2 text-slate-600 hover:text-blue-600 hover:border-blue-200">
                               <Heart className="w-4 h-4 mr-2" />
                               {t('prayer.button.pray_together')}
                           </Button>
                           <Button variant="ghost" size="sm" className="text-slate-400">
                               <MessageCircle className="w-4 h-4" />
                           </Button>
                       </div>
                   </CardFooter>
               </Card>
           ))}
        </div>
        
        {filteredRequests.length === 0 && (
            <div className="text-center py-20 text-gray-500">
                {t('prayer.list.empty')}
            </div>
        )}
      </div>

      {/* 작성 모달 */}
      <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('prayer.modal.title')}</DialogTitle>
                <DialogDescription>
                    {t('prayer.modal.desc')}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>{t('prayer.modal.label.category')}</Label>
                    <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.filter(c => c.id !== 'all').map(c => (
                                <SelectItem key={c.id} value={c.id}>{t(c.labelKey)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>{t('prayer.modal.label.title')}</Label>
                    <Textarea 
                        value={newPostTitle} 
                        onChange={e => setNewPostTitle(e.target.value)} 
                        placeholder={t('prayer.modal.placeholder.title')} 
                        rows={1}
                        className="resize-none"
                    />
                </div>
                <div className="space-y-2">
                    <Label>{t('prayer.modal.label.content')}</Label>
                    <Textarea 
                        value={newPostContent} 
                        onChange={e => setNewPostContent(e.target.value)} 
                        placeholder={t('prayer.modal.placeholder.content')} 
                        rows={5}
                    />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                        {t('prayer.modal.button.submit')}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
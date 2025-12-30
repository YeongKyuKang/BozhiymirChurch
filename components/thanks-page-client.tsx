"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, MessageCircle, PlusCircle, Trash2, Loader2, Sparkles, ThumbsUp
} from "lucide-react";
import { format } from "date-fns";

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

export default function ThanksPageClient({ initialPosts }: ThanksPageClientProps) {
  const { user, userProfile, userRole } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [posts, setPosts] = useState<ThanksPost[]>(initialPosts || []);
  const [isMounted, setIsMounted] = useState(false);

  // 작성 모달 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newPostCategory, setNewPostCategory] = useState<string>("grace");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 카테고리 정의
  const categories = [
    { id: "grace", labelKey: "thanks.category.grace", color: "bg-pink-100 text-pink-700" },
    { id: "daily", labelKey: "thanks.category.daily", color: "bg-green-100 text-green-700" },
    { id: "family", labelKey: "thanks.category.family", color: "bg-orange-100 text-orange-700" },
    { id: "church", labelKey: "thanks.category.church", color: "bg-blue-100 text-blue-700" },
  ];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert(t('common.login_required'));
    setIsSubmitting(true);

    const { error } = await supabase.from('thanks_posts').insert({
      category: newPostCategory,
      title: newPostTitle,
      content: newPostContent,
      author_id: user.id,
      author_nickname: userProfile?.nickname || user.email?.split('@')[0],
      author_profile_picture_url: userProfile?.profile_picture_url
    });

    if (!error) {
      alert(t('thanks.alert.success'));
      setIsWriteModalOpen(false);
      setNewPostTitle("");
      setNewPostContent("");
      router.refresh();
    } else {
      alert(t('common.error') + ": " + error.message);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('common.confirm_delete'))) return;
    const { error } = await supabase.from('thanks_posts').delete().eq('id', id);
    if (!error) {
        setPosts(prev => prev.filter(p => p.id !== id));
        router.refresh();
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-16">
      {/* 1. Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-yellow-200" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            {t('thanks.hero.title')}
          </h1>
          <p className="text-orange-50 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            {t('thanks.hero.desc')}
          </p>
          
          <div className="mt-8">
             <Button 
                onClick={() => setIsWriteModalOpen(true)}
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-8 py-6 rounded-full shadow-lg text-lg border-2 border-transparent hover:border-orange-200"
             >
                <PlusCircle className="w-5 h-5 mr-2" />
                {t('thanks.button.share')}
             </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Feed */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {posts.map(post => {
               const categoryInfo = categories.find(c => c.id === post.category);
               
               return (
               <Card key={post.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col h-full group">
                   <CardHeader className="pb-3 flex flex-row items-start justify-between">
                       <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10 border border-slate-100">
                               <AvatarImage src={post.author_profile_picture_url || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author_nickname}`} />
                               <AvatarFallback>{post.author_nickname[0]}</AvatarFallback>
                           </Avatar>
                           <div>
                               <div className="font-bold text-gray-900 text-sm">{post.author_nickname}</div>
                               <div className="text-xs text-gray-500">{format(new Date(post.created_at), "yyyy.MM.dd")}</div>
                           </div>
                       </div>
                   </CardHeader>
                   
                   <CardContent className="pb-4 flex-grow">
                       <div className="mb-3">
                            <Badge variant="secondary" className={`text-xs ${categoryInfo?.color || 'bg-gray-100 text-gray-600'}`}>
                                {categoryInfo ? t(categoryInfo.labelKey) : post.category}
                            </Badge>
                       </div>
                       <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{post.title}</h3>
                       <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                           {post.content}
                       </p>
                   </CardContent>

                   {/* 카드 푸터 */}
                   <CardFooter className="pt-2 pb-4 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
                       <div className="flex gap-2">
                           <Button variant="ghost" size="sm" className="text-slate-500 hover:text-pink-500 hover:bg-pink-50">
                               <Heart className="w-4 h-4 mr-1" />
                               <span className="text-xs">{t('common.like')}</span>
                           </Button>
                           <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-500 hover:bg-blue-50">
                               <MessageCircle className="w-4 h-4 mr-1" />
                               <span className="text-xs">{t('common.comment')}</span>
                           </Button>
                       </div>

                       {(user?.id === post.author_id || userRole === 'admin') && (
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDelete(post.id)}>
                              <Trash2 className="w-4 h-4" />
                          </Button>
                       )}
                   </CardFooter>
               </Card>
           )})}
        </div>
        
        {posts.length === 0 && (
            <div className="text-center py-20 text-gray-500">
                {t('thanks.list.empty')}
            </div>
        )}
      </div>

      {/* 작성 모달 */}
      <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('thanks.modal.title')}</DialogTitle>
                <DialogDescription>
                    {t('thanks.modal.desc')}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>{t('thanks.modal.label.category')}</Label>
                    <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(c => (
                                <SelectItem key={c.id} value={c.id}>{t(c.labelKey)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>{t('thanks.modal.label.title')}</Label>
                    <Textarea 
                        value={newPostTitle} 
                        onChange={e => setNewPostTitle(e.target.value)} 
                        placeholder={t('thanks.modal.placeholder.title')} 
                        rows={1}
                        className="resize-none"
                    />
                </div>
                <div className="space-y-2">
                    <Label>{t('thanks.modal.label.content')}</Label>
                    <Textarea 
                        value={newPostContent} 
                        onChange={e => setNewPostContent(e.target.value)} 
                        placeholder={t('thanks.modal.placeholder.content')} 
                        rows={5}
                    />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 hover:bg-orange-600">
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                        {t('thanks.modal.button.submit')}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
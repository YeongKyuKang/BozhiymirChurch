"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react"; // useEffect 추가
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context"; // 다국어 훅 추가
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Save, X, Bookmark, PlusCircle, Edit3, Loader2, CheckCircle, XCircle, Trash2
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { t } = useLanguage(); // 다국어 훅 사용
  const router = useRouter();

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(initialPrayerRequests);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<"ukraine" | "bozhiymirchurch" | "members" | "children">("ukraine");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<"all" | "ukraine" | "bozhiymirchurch" | "members" | "children">("all");
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 답변 수정 모드 시작
  const handleEditAnswer = (prayerId: string, currentAnswerContent: string) => {
    setEditingAnswerId(prayerId);
    setCurrentAnswer(currentAnswerContent);
  };

  // 답변 저장 로직
  const handleSaveAnswer = async (prayerId: string) => {
    if (!user || !userProfile?.id || !userProfile?.nickname) {
      setMessage({ type: 'error', text: t('prayer.login_required_answer') || "로그인해야 응답을 작성할 수 있습니다." });
      return;
    }

    const { error } = await supabase
      .from('prayer_requests')
      .update({
        answer_content: currentAnswer,
        answer_author_id: user.id,
        answer_author_nickname: userProfile.nickname,
        answered_at: new Date().toISOString()
      })
      .eq('id', prayerId);

    if (error) {
      console.error("Error saving answer:", error.message);
      setMessage({ type: 'error', text: `${t('prayer.error_saving_answer') || "응답 저장 오류"}: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: t('prayer.answer_saved_success') || "응답이 저장되었습니다." });
      setPrayerRequests(prev =>
        prev.map(req =>
          req.id === prayerId
            ? {
                ...req,
                answer_content: currentAnswer,
                answer_author_id: user.id,
                answer_author_nickname: userProfile.nickname,
                answered_at: new Date().toISOString()
              }
            : req
        )
      );
      setEditingAnswerId(null);
      setCurrentAnswer("");
    }
  };

  const handleCancelAnswer = () => {
    setEditingAnswerId(null);
    setCurrentAnswer("");
  };

  // 기도 카테고리 정의 (번역 키 매핑)
  const prayerCategories = [
    { key: "ukraine", titleKey: "prayer.categories.ukraine.title", descKey: "prayer.categories.ukraine.desc", icon: "🇺🇦" },
    { key: "bozhiymirchurch", titleKey: "prayer.categories.church.title", descKey: "prayer.categories.church.desc", icon: "⛪" },
    { key: "members", titleKey: "prayer.categories.members.title", descKey: "prayer.categories.members.desc", icon: "👨‍👩‍👧‍👦" },
    { key: "children", titleKey: "prayer.categories.children.title", descKey: "prayer.categories.children.desc", icon: "👧👦" },
  ];

  // 새 기도 제목 제출
  const handleNewPrayerRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPost(true);
    setMessage(null);

    if (!user || !userProfile) {
      setMessage({ type: 'error', text: t('prayer.login_required_post') || "로그인 후 기도 요청을 작성할 수 있습니다." });
      setIsSubmittingPost(false);
      return;
    }
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setMessage({ type: 'error', text: t('prayer.fill_all_fields') || "제목과 내용을 입력해주세요." });
      setIsSubmittingPost(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .insert({
          category: newPostCategory,
          title: newPostTitle,
          content: newPostContent,
          author_id: user.id,
          author_nickname: userProfile.nickname || user.email || 'Anonymous',
        });

      if (error) {
        console.error("Error submitting prayer request:", error);
        setMessage({ type: 'error', text: `${t('prayer.error_submitting') || "작성 중 오류"}: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: t('prayer.post_success') || "기도 요청이 작성되었습니다." });
        setSelectedFilterCategory(newPostCategory);
        setNewPostTitle("");
        setNewPostContent("");
        setNewPostCategory("ukraine");
        setIsWriteModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage({ type: 'error', text: t('prayer.unexpected_error') || "예상치 못한 오류가 발생했습니다." });
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // 기도 제목 삭제
  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm(t('prayer.confirm_delete') || "정말로 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        alert(`${t('prayer.delete_fail')}: ${error.message}`);
      } else {
        alert(t('prayer.delete_success') || "삭제되었습니다.");
        router.refresh();
      }
    } catch (err) {
      alert(t('prayer.unexpected_error'));
    }
  };

  const filteredPrayerRequests = useMemo(() => {
    if (selectedFilterCategory === "all") {
      return prayerRequests;
    }
    return prayerRequests.filter(req => req.category === selectedFilterCategory);
  }, [prayerRequests, selectedFilterCategory]);

  if (!isClient) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">{t('common.loading') || "Loading..."}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-8 pt-16">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500 py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-3">
            <span className="text-3xl md:text-4xl">🙏</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-4">
            {t('prayer.hero.title')}
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-3xl mx-auto leading-relaxed">
            {t('prayer.hero.description')}
          </p>
        </div>
      </div>

      {/* Prayer Categories Section */}
      <section className="py-8 bg-blue-50 border-b border-gray-200">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {prayerCategories.map(category => (
            <Card key={category.key} className="shadow-md rounded-lg border border-gray-200 bg-white p-6 text-center hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
              <div className="text-5xl mb-4">{category.icon}</div>
              <h2 className="text-lg font-bold text-blue-900 mb-2">
                {t(category.titleKey)}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {t(category.descKey)}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* New Prayer Request Button & Dialog Section */}
      <section className="py-8 bg-white border-b border-gray-200 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* 카테고리 필터링 드롭다운 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              {t('prayer.filters.title')}
            </h3>
            <Select
              value={selectedFilterCategory}
              onValueChange={(value: "all" | "ukraine" | "bozhiymirchurch" | "members" | "children") => setSelectedFilterCategory(value)}
            >
              <SelectTrigger className="w-full md:w-1/2 mx-auto h-10 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base">
                <SelectValue placeholder={t('prayer.filters.all_posts')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('prayer.filters.all_posts')}
                </SelectItem>
                {prayerCategories.map(cat => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {t(cat.titleKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg shadow-md"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> {t('prayer.new_post_button')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-900">{t('prayer.modal.title')}</DialogTitle>
                <DialogDescription className="text-gray-700">{t('prayer.modal.desc')}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewPrayerRequestSubmit} className="space-y-4 py-4">
                {message && (
                  <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'error' ? 'bg-red-900 text-white border-red-700' : 'bg-green-900 text-white border-green-700'}>
                    {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    <AlertTitle>{message.type === 'error' ? t('common.error') : t('common.success')}</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="newPostCategory" className="text-blue-900 font-semibold">{t('prayer.modal.category_label')}</Label>
                  <Select value={newPostCategory} onValueChange={(value: any) => setNewPostCategory(value)}>
                    <SelectTrigger className="mt-1 h-10 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base">
                      <SelectValue placeholder={t('prayer.modal.select_category')} />
                    </SelectTrigger>
                    <SelectContent>
                      {prayerCategories.map(cat => (
                        <SelectItem key={cat.key} value={cat.key}>
                          {t(cat.titleKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="newPostTitle" className="text-blue-900 font-semibold">{t('prayer.modal.title_label')}</Label>
                  <Textarea
                    id="newPostTitle"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder={t('prayer.modal.title_placeholder') || "제목을 입력하세요"}
                    rows={1}
                    required
                    className="mt-1 border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                  />
                </div>
                <div>
                  <Label htmlFor="newPostContent" className="text-blue-900 font-semibold">{t('prayer.modal.content_label')}</Label>
                  <Textarea
                    id="newPostContent"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={t('prayer.modal.content_placeholder') || "내용을 입력하세요"}
                    rows={5}
                    required
                    className="mt-1 border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmittingPost} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">
                    {isSubmittingPost ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    {t('prayer.modal.submit_button')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Prayer Requests List */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-yellow-50">
        <div className="container mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrayerRequests.length === 0 ? (
                <p className="text-center text-gray-600 col-span-full py-8">
                  {selectedFilterCategory === "all"
                    ? t('prayer.no_posts_all')
                    : t('prayer.no_posts_category')}
                </p>
            ) : (
                filteredPrayerRequests.map(req => (
                    <Card key={req.id} className="shadow-lg rounded-lg border border-gray-200 bg-white p-6 relative flex flex-col justify-between min-h-[280px] transform hover:scale-[1.02] transition-transform duration-200">
                        <CardHeader className="pb-2 relative">
                            {req.category && (
                              <Badge variant="secondary" className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">
                                {prayerCategories.find(c => c.key === req.category)?.icon || req.category}
                              </Badge>
                            )}
                            <div className="flex items-center space-x-3 mb-2">
                                <Avatar className="h-9 w-9 mt-6">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${req.author_nickname}`} alt={req.author_nickname} />
                                    <AvatarFallback className="text-xs">{req.author_nickname?.charAt(0) || '?'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base font-bold text-blue-900">{req.author_nickname}</CardTitle>
                                    <CardDescription className="text-xs text-gray-600">
                                        {format(new Date(req.created_at), 'yyyy. MM. dd HH:mm')}
                                    </CardDescription>
                                </div>
                            </div>
                            <h3 className="text-base font-bold text-blue-900 mb-2 line-clamp-2">{req.title}</h3>
                        </CardHeader>
                        <CardContent className="pt-0 flex flex-col justify-between flex-grow">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4 max-h-[60px] overflow-y-auto">{req.content}</p>

                            {/* 답변(응답) 표시 영역 */}
                            {req.answer_content && (
                                <div className="mt-auto p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-semibold text-blue-800 text-sm mb-1 flex items-center">
                                        <Bookmark className="h-4 w-4 mr-1 text-blue-600" />
                                        {t('prayer.answer_label') || "응답"}
                                    </h4>
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{req.answer_content}</p>
                                    <div className="text-xxs text-gray-500 mt-1">
                                        by {req.answer_author_nickname} on {req.answered_at ? format(new Date(req.answered_at), 'yyyy. MM. dd') : 'N/A'}
                                    </div>
                                </div>
                            )}

                            {/* 작성자/관리자 전용 버튼 */}
                            {(user?.id === req.author_id || userRole === 'admin') && (
                                <div className="mt-4 border-t border-gray-100 pt-4">
                                    {editingAnswerId === req.id ? (
                                        <div className="space-y-2">
                                            <Textarea
                                                value={currentAnswer}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                                placeholder={t('prayer.answer_placeholder') || "응답 내용을 입력하세요..."}
                                                rows={3}
                                                className="text-sm border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                                            />
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" size="sm" onClick={handleCancelAnswer} className="text-red-600 border-red-300 hover:bg-red-50">
                                                    <X className="h-4 w-4" /> {t('common.cancel')}
                                                </Button>
                                                <Button size="sm" onClick={() => handleSaveAnswer(req.id)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                                    <Save className="h-4 w-4" /> {t('common.save')}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => handleEditAnswer(req.id, req.answer_content || "")}
                                            className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                                        >
                                            <Edit3 className="h-4 w-4 mr-2" />
                                            {req.answer_content ? t('prayer.edit_answer') : t('prayer.write_answer')}
                                        </Button>
                                    )}
                                </div>
                            )}

                            {(user?.id === req.author_id || userRole === 'admin') && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteRequest(req.id)}
                                  className="mt-3 bg-red-600 hover:bg-red-700 text-white w-full"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> {t('prayer.delete_post')}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Scripture Section */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold mb-6">
            {t('prayer.scripture.title')}
          </h2>
          <Card className="max-w-5xl mx-auto shadow-2xl border border-gray-600 bg-white/10 backdrop-blur-sm">
            <CardContent className="p-5">
              <blockquote className="text-base italic text-yellow-300 mb-4 leading-relaxed">
                {t('prayer.scripture.quote')}
              </blockquote>
              <p className="text-sm font-semibold text-white mb-4">
                {t('prayer.scripture.reference')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
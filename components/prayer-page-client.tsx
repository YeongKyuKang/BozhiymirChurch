// yeongkyukang/bozhiymirchurch/BozhiymirChurch-4d2cde288530ef711b8ef2d2cc649e1ca337c00c/components/prayer-page-client.tsx
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
  Settings, Save, X, Bookmark, PlusCircle, Edit3, MessageCircle, Loader2, CheckCircle, XCircle, Trash2
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

interface PrayerPageClientProps {
  initialContent: Record<string, any>;
  initialPrayerRequests: PrayerRequest[];
}

const POSTS_PER_LOAD = 6;

export default function ThanksPageClient({ initialContent, initialPrayerRequests }: PrayerPageClientProps) {
  const { user, userProfile, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(initialPrayerRequests);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<"ukraine" | "bozhiymirchurch" | "members" | "children">("ukraine");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [comments, setComments] = useState<Record<string, ThanksComment[]>>({});
  const [newCommentContent, setNewCommentContent] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});

  const [reactions, setReactions] = useState<Record<string, ThanksReaction[]>>({});

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<"all" | "ukraine" | "bozhiymirchurch" | "members" | "children">("all");

  const [isClient, setIsClient] = useState(false); // 클라이언트 마운트 상태 추가

  // 컴포넌트가 클라이언트에서 마운트되었을 때 isClient를 true로 설정
  useEffect(() => {
    setIsClient(true);
  }, []);


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
          page: 'prayer',
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for prayer.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/prayer`);
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Prayer page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false);
    setChangedContent({});

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 기도 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 기도 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
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

  const handleEditAnswer = (prayerId: string, currentAnswerContent: string) => {
    setEditingAnswerId(prayerId);
    setCurrentAnswer(currentAnswerContent);
  };

  const handleSaveAnswer = async (prayerId: string) => {
    if (!user || !userProfile?.id || !userProfile?.nickname) {
      setMessage({ type: 'error', text: "로그인해야 응답을 작성할 수 있습니다." });
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
      setMessage({ type: 'error', text: `응답 저장 중 오류 발생: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: "응답이 성공적으로 저장되었습니다!" });
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

  const prayerCategories = [
    { key: "ukraine", titleKey: "ukraine_title", descriptionKey: "ukraine_description", icon: "🇺🇦" },
    { key: "bozhiymirchurch", titleKey: "church_title", descriptionKey: "church_description", icon: "⛪" },
    { key: "members", titleKey: "members_title", descriptionKey: "members_description", icon: "👨‍👩‍👧‍👦" },
    { key: "children", titleKey: "children_title", descriptionKey: "children_description", icon: "👧👦" },
  ];

  const handleNewPrayerRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPost(true);
    setMessage(null);

    if (!user || !userProfile) {
      setMessage({ type: 'error', text: "로그인 후 기도 요청을 작성할 수 있습니다." });
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
        .from('prayer_requests')
        .insert({
          category: newPostCategory,
          title: newPostTitle,
          content: newPostContent,
          author_id: user.id,
          author_nickname: userProfile.nickname || user.email || '익명',
        })
        .select()
        .single();

      if (error) {
        console.error("Error submitting prayer request:", error);
        setMessage({ type: 'error', text: `기도 요청 작성 중 오류 발생: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: "기도 요청이 성공적으로 작성되었습니다!" });
        setSelectedFilterCategory(newPostCategory);
        setNewPostTitle("");
        setNewPostContent("");
        setNewPostCategory("ukraine");
        setIsWriteModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error("Unexpected error during post submission:", err);
      setMessage({ type: 'error', text: "기도 요청 작성 중 예상치 못한 오류가 발생했습니다." });
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm("정말로 이 기도 요청을 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        console.error("Error deleting prayer request:", error);
        alert(`기도 요청 삭제에 실패했습니다: ${error.message}`);
      } else {
        alert("기도 요청이 성공적으로 삭제되었습니다!");
        router.refresh();
      }
    } catch (err) {
      console.error("Unexpected error during prayer request deletion:", err);
      alert("기도 요청 삭제 중 예상치 못한 오류가 발생했습니다.");
    }
  };

  const filteredPrayerRequests = useMemo(() => {
    if (selectedFilterCategory === "all") {
      return prayerRequests;
    }
    return prayerRequests.filter(req => req.category === selectedFilterCategory);
  }, [prayerRequests, selectedFilterCategory]);

  if (!isClient) { // isClient 상태가 true가 될 때까지 로딩 스피너를 반환
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        로딩 중...
      </div>
    );
  }

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
              page="prayer"
              section="main"
              contentKey="title"
              initialValue={initialContent?.main?.title || "Prayer Requests"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-3xl mx-auto leading-relaxed">
            <EditableText
              page="prayer"
              section="main"
              contentKey="description"
              initialValue={initialContent?.main?.description || "Share your prayer requests with our church family. We believe in the power of prayer and want to lift up your needs before God together."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-sm md:text-base text-blue-200"
              isTextArea={true}
            />
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
                <EditableText
                  page="prayer"
                  section={category.key}
                  contentKey={category.titleKey}
                  initialValue={initialContent?.[category.key]?.[category.titleKey] || category.key.charAt(0).toUpperCase() + category.key.slice(1)}
                  isEditingPage={isPageEditing}
                  onContentChange={handleContentChange}
                  tag="span"
                  className="text-lg font-bold text-blue-900"
                />
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                <EditableText
                  page="prayer"
                  section={category.key}
                  contentKey={category.descriptionKey}
                  initialValue={initialContent?.[category.key]?.[category.descriptionKey] || `Prayer requests for ${category.key}.`}
                  isEditingPage={isPageEditing}
                  onContentChange={handleContentChange}
                  tag="span"
                  className="text-sm text-gray-700"
                  isTextArea={true}
                />
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
              <EditableText
                page="prayer"
                section="filters"
                contentKey="title"
                initialValue={initialContent?.filters?.title || "기도 제목 필터링"}
                isEditingPage={isPageEditing}
                onContentChange={handleContentChange}
                tag="span"
                className="text-lg font-bold text-blue-900"
              />
            </h3>
            <Select
              value={selectedFilterCategory}
              onValueChange={(value: "all" | "ukraine" | "bozhiymirchurch" | "members" | "children") => setSelectedFilterCategory(value)}
            >
              <SelectTrigger className="w-full md:w-1/2 mx-auto h-10 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base">
                <SelectValue placeholder={initialContent?.filters?.all_posts || "모든 기도 제목"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <EditableText
                    page="prayer"
                    section="filters"
                    contentKey="all_posts"
                    initialValue={initialContent?.filters?.all_posts || "모든 기도 제목"}
                    isEditingPage={isPageEditing}
                    onContentChange={handleContentChange}
                    tag="span"
                    className="inline"
                  />
                </SelectItem>
                {prayerCategories.map(cat => (
                  <SelectItem key={cat.key} value={cat.key}>
                    <EditableText
                      page="prayer"
                      section="filters"
                      contentKey={`${cat.key}_filter`}
                      initialValue={initialContent?.filters?.[`${cat.key}_filter`] || cat.key.charAt(0).toUpperCase() + cat.key.slice(1)}
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

          <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-lg shadow-md"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> 새 기도 요청 작성
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-900">새 기도 요청 작성</DialogTitle>
                <DialogDescription className="text-gray-700">하나님께 당신의 필요를 나누어 주세요.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewPrayerRequestSubmit} className="space-y-4 py-4">
                {message && (
                  <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'error' ? 'bg-red-900 text-white border-red-700' : 'bg-green-900 text-white border-green-700'}>
                    {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    <AlertTitle>{message.type === 'error' ? "오류!" : "성공!"}</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="newPostCategory" className="text-blue-900 font-semibold">카테고리</Label>
                  <Select value={newPostCategory} onValueChange={(value: "ukraine" | "bozhiymirchurch" | "members" | "children") => setNewPostCategory(value)}>
                    <SelectTrigger className="mt-1 h-10 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {prayerCategories.map(cat => (
                        <SelectItem key={cat.key} value={cat.key}>
                          <EditableText
                            page="prayer"
                            section="categories"
                            contentKey={cat.titleKey}
                            initialValue={initialContent?.categories?.[cat.titleKey] || cat.key.charAt(0).toUpperCase() + cat.key.slice(1)}
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
                  <Label htmlFor="newPostTitle" className="text-blue-900 font-semibold">기도 제목</Label>
                  <Textarea
                    id="newPostTitle"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="간단한 기도 제목을 입력하세요 (예: 전쟁 종식)"
                    rows={1}
                    required
                    className="mt-1 border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                  />
                </div>
                <div>
                  <Label htmlFor="newPostContent" className="text-blue-900 font-semibold">기도 내용</Label>
                  <Textarea
                    id="newPostContent"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="구체적인 기도 내용을 작성해 주세요."
                    rows={5}
                    required
                    className="mt-1 border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmittingPost} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">
                    {isSubmittingPost ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    기도 요청 제출
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Prayer Requests List by Category */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-yellow-50">
        <div className="container mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrayerRequests.length === 0 ? (
                <p className="text-center text-gray-600 col-span-full py-8">
                  {selectedFilterCategory === "all"
                    ? "아직 기도 제목이 없습니다. 첫 게시물을 작성해주세요!"
                    : `선택하신 카테고리 (${prayerCategories.find(c => c.key === selectedFilterCategory)?.icon || selectedFilterCategory})에 대한 기도 제목이 없습니다.`}
                </p>
            ) : (
                filteredPrayerRequests.map(req => (
                    <Card key={req.id} className="shadow-lg rounded-lg border border-gray-200 bg-white p-6 relative flex flex-col justify-between min-h-[280px] transform hover:scale-[1.02] transition-transform duration-200">
                        <CardHeader className="pb-2 relative">
                            {/* 카테고리 배지 추가 */}
                            {req.category && (
                              <Badge variant="secondary" className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">
                                {prayerCategories.find(c => c.key === req.category)?.icon || req.category}
                              </Badge>
                            )}
                            <div className="flex items-center space-x-3 mb-2">
                                {/* 카테고리 배지 때문에 아바타 위치 조정 */}
                                <Avatar className="h-9 w-9 mt-6">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${req.author_nickname}`} alt={req.author_nickname} />
                                    <AvatarFallback className="text-xs">{req.author_nickname?.charAt(0) || '?'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base font-bold text-blue-900">{req.author_nickname}</CardTitle>
                                    <CardDescription className="text-xs text-gray-600">
                                        {format(new Date(req.created_at), 'yyyy년 MM월 dd일 HH:mm')}
                                    </CardDescription>
                                </div>
                            </div>
                            <h3 className="text-base font-bold text-blue-900 mb-2 line-clamp-2">{req.title}</h3>
                        </CardHeader>
                        <CardContent className="pt-0 flex flex-col justify-between flex-grow">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4 max-h-[60px] overflow-y-auto">{req.content}</p>

                            {/* 반응 섹션 */}
                            <div className="flex items-center space-x-0.5 border-t border-b border-blue-100 py-1.5 my-2">
                              {/* 반응 관련 부분은 prayer_requests에 reactions 필드가 없어 수정이 필요할 수 있습니다. */}
                              {/* 현재 ThanksReaction 타입을 사용하고 있으나, PrayerRequest에는 반응 필드가 직접 없습니다. */}
                            </div>

                            {req.answer_content && (
                                <div className="mt-auto p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-semibold text-blue-800 text-sm mb-1 flex items-center">
                                        <Bookmark className="h-4 w-4 mr-1 text-blue-600" />
                                        응답
                                    </h4>
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{req.answer_content}</p>
                                    <div className="text-xxs text-gray-500 mt-1">
                                        by {req.answer_author_nickname} on {req.answered_at ? format(new Date(req.answered_at), 'yyyy년 MM월 dd일') : 'N/A'}
                                    </div>
                                </div>
                            )}

                            {(user?.id === req.author_id || userRole === 'admin') && (
                                <div className="mt-4 border-t border-gray-100 pt-4">
                                    {editingAnswerId === req.id ? (
                                        <div className="space-y-2">
                                            <Textarea
                                                value={currentAnswer}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                                placeholder="응답 내용을 입력하세요..."
                                                rows={3}
                                                className="text-sm border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                                            />
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" size="sm" onClick={handleCancelAnswer} className="text-red-600 border-red-300 hover:bg-red-50">
                                                    <X className="h-4 w-4" /> 취소
                                                </Button>
                                                <Button size="sm" onClick={() => handleSaveAnswer(req.id)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                                    <Save className="h-4 w-4" /> 저장
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
                                            {req.answer_content ? "응답 내용 수정" : "응답 내용 작성"}
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
                                  <Trash2 className="h-4 w-4 mr-2" /> 기도 요청 삭제
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
            <EditableText
              page="prayer"
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
                  page="prayer"
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
                  page="prayer"
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
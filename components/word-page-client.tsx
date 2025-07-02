// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/components/word-page-client.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X, MessageCircle, Heart, Calendar } from "lucide-react"; // 아이콘 추가
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import EditableText from "@/components/editable-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WordPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  author_profile_picture_url?: string;
  created_at: string;
  likes: { user_id: string }[]; // 좋아요는 단순 숫자
  comments: { id: string; content: string; author_nickname: string; created_at: string }[];
  post_date: string; // 매일 말씀이 올라오는 게시판임을 나타내는 필드
}

interface WordPageClientProps { // 인터페이스 이름 변경
  initialContent: Record<string, any>;
  initialWordPosts: WordPost[];
}

export default function WordPageClient({ initialContent, initialWordPosts }: WordPageClientProps) { // 컴포넌트 이름 변경
  const { user, userProfile, userRole } = useAuth();
  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [wordPosts, setWordPosts] = useState<WordPost[]>(initialWordPosts);

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
          page: 'word', // 'faith-word'에서 'word'로 페이지 이름 변경
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for word.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/word`); // 경로를 '/word'로 변경
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Word page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false);
    setChangedContent({});

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 말씀 게시판 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 말씀 게시판 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
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

  // 좋아요 처리 함수
  const handleLike = async (postId: string) => {
    if (!user) {
      alert("로그인해야 좋아요를 누를 수 있습니다.");
      return;
    }

    const { data: existingLike, error: fetchError } = await supabase
      .from('word_post_likes') // 'word_post_likes' 테이블 사용 가정
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116은 Not Found 오류 코드
      console.error("Error fetching existing like:", fetchError.message);
      return;
    }

    if (existingLike) {
      // 이미 좋아요를 누른 경우 취소
      const { error } = await supabase
        .from('word_post_likes')
        .delete()
        .eq('id', existingLike.id);
      if (error) {
        console.error("Error unliking post:", error.message);
        return;
      }
      setWordPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: post.likes.filter(l => l.user_id !== user.id) }
            : post
        )
      );
    } else {
      // 새로 좋아요
      const { error } = await supabase.from('word_post_likes').insert({
        post_id: postId,
        user_id: user.id,
      });
      if (error) {
        console.error("Error liking post:", error.message);
        return;
      }
      setWordPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: [...post.likes, { user_id: user.id }] }
            : post
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* 전역 편집 모드 버튼 */}
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
      <section className="py-16 px-4 pt-32 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <EditableText
              page="word" // 'faith-word'에서 'word'로 페이지 이름 변경
              section="main"
              contentKey="title"
              initialValue={initialContent?.main?.title || "Daily Word"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            <EditableText
              page="word" // 'faith-word'에서 'word'로 페이지 이름 변경
              section="main"
              contentKey="description"
              initialValue={initialContent?.main?.description || "Receive daily scripture and reflection."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-xl text-gray-600"
            />
          </div>
        </div>
      </section>

      {/* Calendar & Word Posts List */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* TODO: 달력 UI 배치 (후순위 개발) */}
          <div className="border p-6 rounded-lg bg-white shadow-sm flex items-center justify-center h-48 text-gray-400">
            <Calendar className="h-12 w-12 mr-4" />
            <span className="text-xl">달력 UI (이후 추가 예정)</span>
          </div>

          {wordPosts.length === 0 ? (
            <p className="text-center text-gray-600">아직 작성된 말씀 게시물이 없습니다.</p>
          ) : (
            wordPosts.map(post => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <Avatar>
                      <AvatarImage src={post.author_profile_picture_url || "/placeholder.svg"} alt={post.author_nickname} />
                      <AvatarFallback>{post.author_nickname?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {post.author_nickname} • {new Date(post.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </CardContent>
                <div className="flex justify-between items-center px-6 pb-4 border-t pt-4">
                  <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)} disabled={!user} className="flex items-center space-x-1">
                    <Heart className={`h-4 w-4 ${post.likes.some(l => l.user_id === user?.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                    <span>{post.likes.length}</span>
                  </Button>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>
                {/* TODO: 댓글 목록 및 댓글 작성 폼 추가 (후순위) */}
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
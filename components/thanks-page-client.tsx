// yeongkyukang/bozhiymirchurch/BozhiymirChurch-4d2cde288530ef711b8ef2d2cc649e1ca337c00c/components/thanks-page-client.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X, PlusCircle, MessageCircle, ThumbsUp, Heart, Laugh, Smile, Frown } from "lucide-react"; // 아이콘 추가
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EditableText from "@/components/editable-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ThankPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  author_profile_picture_url?: string;
  created_at: string;
  likes: { user_id: string; type: string }[]; // 공감 타입을 포함
  comments: { id: string; content: string; author_nickname: string; created_at: string }[];
}

interface ThanksPageClientProps { // 인터페이스 이름 변경
  initialContent: Record<string, any>;
  initialThanksPosts: ThankPost[];
}

export default function ThanksPageClient({ initialContent, initialThanksPosts }: ThanksPageClientProps) { // 컴포넌트 이름 변경
  const { user, userProfile, userRole } = useAuth();
  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [thanksPosts, setThanksPosts] = useState<ThankPost[]>(initialThanksPosts);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

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
          page: 'thanks', // 'faith-thanks'에서 'thanks'로 페이지 이름 변경
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
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
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/thanks`); // 경로를 '/thanks'로 변경
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Thanks page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false);
    setChangedContent({});

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 감사 게시판 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 감사 게시판 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
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

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile?.id || !newPostTitle || !newPostContent) {
      alert("로그인해야 게시물을 작성할 수 있으며, 제목과 내용을 입력해야 합니다.");
      return;
    }

    setIsSubmittingPost(true);
    try {
      const { data, error } = await supabase.from('thanks_posts').insert({
        title: newPostTitle,
        content: newPostContent,
        author_id: user.id,
        author_nickname: userProfile.nickname || user.email,
        author_profile_picture_url: userProfile.profile_picture_url,
      }).select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setThanksPosts(prev => [
          { ...data[0], likes: [], comments: [] }, // 새로운 게시물 추가 (좋아요, 댓글 초기화)
          ...prev,
        ]);
        setNewPostTitle("");
        setNewPostContent("");
        setShowNewPostForm(false);
        alert("감사 제목이 성공적으로 작성되었습니다!");
      }
    } catch (error: any) {
      console.error("Error adding thank post:", error.message);
      alert(`감사 제목 작성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    if (!user) {
      alert("로그인해야 공감할 수 있습니다.");
      return;
    }

    const { data: existingLike, error: fetchError } = await supabase
      .from('thanks_post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116은 Not Found 오류 코드
      console.error("Error fetching existing like:", fetchError.message);
      return;
    }

    if (existingLike) {
      // 이미 공감한 경우: 같은 타입이면 취소, 다른 타입이면 업데이트
      if (existingLike.type === reactionType) {
        // 공감 취소
        const { error } = await supabase
          .from('thanks_post_likes')
          .delete()
          .eq('id', existingLike.id);
        if (error) {
          console.error("Error unliking post:", error.message);
          return;
        }
        setThanksPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { ...post, likes: post.likes.filter(l => l.user_id !== user.id) }
              : post
          )
        );
      } else {
        // 다른 타입으로 업데이트
        const { error } = await supabase
          .from('thanks_post_likes')
          .update({ type: reactionType, updated_at: new Date().toISOString() })
          .eq('id', existingLike.id);
        if (error) {
          console.error("Error updating like type:", error.message);
          return;
        }
        setThanksPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { ...post, likes: post.likes.map(l => l.user_id === user.id ? { ...l, type: reactionType } : l) }
              : post
          )
        );
      }
    } else {
      // 새로 공감
      const { error } = await supabase.from('thanks_post_likes').insert({
        post_id: postId,
        user_id: user.id,
        type: reactionType,
      });
      if (error) {
        console.error("Error liking post:", error.message);
        return;
      }
      setThanksPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: [...post.likes, { user_id: user.id, type: reactionType }] }
            : post
        )
      );
    }
  };

  // 공감 아이콘 렌더링 함수
  const renderReactionButtons = (post: ThankPost) => {
    const userReaction = post.likes.find(l => l.user_id === user?.id);
    const getReactionCount = (type: string) => post.likes.filter(l => l.type === type).length;

    const ReactionButton = ({ type, icon: Icon, label }: { type: string; icon: React.ElementType; label: string }) => (
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center space-x-1 ${userReaction?.type === type ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'}`}
        onClick={() => handleReaction(post.id, type)}
        disabled={!user}
      >
        <Icon className="h-4 w-4" />
        <span>{getReactionCount(type)}</span>
      </Button>
    );

    return (
      <div className="flex space-x-2">
        <ReactionButton type="heart" icon={Heart} label="Heart" />
        <ReactionButton type="thumbs_up" icon={ThumbsUp} label="Thumbs Up" />
        <ReactionButton type="laugh" icon={Laugh} label="Laugh" />
        <ReactionButton type="smile" icon={Smile} label="Smile" />
        <ReactionButton type="frown" icon={Frown} label="Frown" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
              page="thanks" // 'faith-thanks'에서 'thanks'로 페이지 이름 변경
              section="main"
              contentKey="title"
              initialValue={initialContent?.main?.title || "Thanks Board"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            <EditableText
              page="thanks" // 'faith-thanks'에서 'thanks'로 페이지 이름 변경
              section="main"
              contentKey="description"
              initialValue={initialContent?.main?.description || "Share your gratitude and blessings with our community."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-xl text-gray-600"
            />
          </div>
        </div>
      </section>

      {/* New Post Form */}
      {user && (userProfile?.can_comment || userRole === 'admin') && ( // 댓글 작성 권한이 있거나 관리자일 경우
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-2xl">
            <Button onClick={() => setShowNewPostForm(!showNewPostForm)} className="mb-4 w-full">
              {showNewPostForm ? "감사 제목 작성 취소" : <><PlusCircle className="mr-2 h-5 w-5" /> 감사 제목 작성</>}
            </Button>
            {showNewPostForm && (
              <Card className="shadow-sm rounded-lg border bg-card text-card-foreground p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-bold mb-4">새 감사 제목 작성</h2>
                <form onSubmit={handleAddPost} className="space-y-4">
                  <div>
                    <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                    <Input
                      id="postTitle"
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="감사 제목을 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                    <Textarea
                      id="postContent"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="감사 내용을 입력하세요"
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isSubmittingPost}>
                    {isSubmittingPost ? "작성 중..." : "감사 제목 제출"}
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Thanks Posts List */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">
          {thanksPosts.length === 0 ? (
            <p className="text-center text-gray-600">아직 작성된 감사 제목이 없습니다. 첫 감사 제목을 작성해보세요!</p>
          ) : (
            thanksPosts.map(post => (
              <Card key={post.id} className="shadow-sm rounded-lg border bg-card text-card-foreground relative hover:shadow-lg transition-shadow duration-300">
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
                <CardFooter className="flex justify-between items-center border-t pt-4">
                  {renderReactionButtons(post)} {/* 공감 버튼 렌더링 */}
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments.length}</span> {/* 댓글 수 */}
                    </div>
                  </div>
                </CardFooter>
                {/* TODO: 댓글 목록 및 댓글 작성 폼 추가 (후순위) */}
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
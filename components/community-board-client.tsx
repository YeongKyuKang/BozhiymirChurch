"use client"; // 이 파일은 클라이언트 컴포넌트임을 명시합니다.

import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Heart, MessageCircle, Settings, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import EditableText from "@/components/editable-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // 아바타 컴포넌트 추가
import { Input } from "@/components/ui/input"; // 인풋 컴포넌트 추가
import { Textarea } from "@/components/ui/textarea"; // 텍스트에리어 컴포넌트 추가
import { Label } from "@/components/ui/label"; // 라벨 컴포넌트 추가
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // 팝오버 컴포넌트 추가


interface Post {
  id: string
  title: string
  content: string
  media_url: string | null
  author_id: string
  view_count: number
  likes_count: number
  created_at: string
  users: {
    nickname: string | null
    profile_picture_url: string | null
  }
  comments_count: number;
}

interface CommunityBoardPageClientProps {
    initialPosts: Post[];
    initialContent: Record<string, any>;
}

export default function CommunityBoardPageClient({ initialPosts, initialContent }: CommunityBoardPageClientProps) {
    const { user, userRole } = useAuth();
    const [posts, setPosts] = useState<Post[]>(initialPosts); // 초기 게시물 데이터
    const [loading, setLoading] = useState(false); // 게시물 로딩 상태 (초기 로딩은 서버에서)
    const [error, setError] = useState<string | null>(null);

    const [isPageEditing, setIsPageEditing] = useState(false); // 페이지 전체 편집 모드 상태
    const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({}); // 변경된 내용을 추적하는 상태
    const [isSavingAll, setIsSavingAll] = useState(false);

    // EditableText 컴포넌트로부터 변경사항을 받을 콜백 함수
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
                    page: 'communityboard', // 'communityboard' 페이지 지정
                    section: section,
                    key: key,
                    value: value,
                    updated_at: new Date().toISOString()
                });

                if (error) {
                    console.error(`Error updating content for communityboard.${section}.${key}:`, error);
                } else {
                    updateCount++;
                }
            }
        }

        if (updateCount > 0) {
            try {
                const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/communityboard`);
                if (!revalidateResponse.ok) {
                    const errorData = await revalidateResponse.json();
                    console.error("Revalidation failed:", errorData.message);
                } else {
                    revalidated = true;
                    console.log("Community board page revalidated successfully!");
                }
            } catch (err) {
                console.error("Failed to call revalidate API:", err);
            }
        }

        setIsSavingAll(false);
        setIsPageEditing(false);
        setChangedContent({});

        if (updateCount > 0 && revalidated) {
            alert("모든 변경 사항이 저장되고 커뮤니티 게시판 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
        } else if (updateCount > 0 && !revalidated) {
            alert("일부 변경 사항은 저장되었지만, 커뮤니티 게시판 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
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

    const truncateContent = (content: string) => {
        return content.length > 150 ? content.substring(0, 150) + "..." : content;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
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

            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        <EditableText 
                            page="communityboard" 
                            section="main" 
                            contentKey="title" 
                            initialValue={initialContent?.main?.title} 
                            isEditingPage={isPageEditing} 
                            onContentChange={handleContentChange} 
                            tag="span" 
                            className="text-5xl font-bold text-gray-900 mb-6" 
                        />
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        <EditableText 
                            page="communityboard" 
                            section="main" 
                            contentKey="description" 
                            initialValue={initialContent?.main?.description} 
                            isEditingPage={isPageEditing} 
                            onContentChange={handleContentChange} 
                            tag="span" 
                            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" 
                        />
                    </p>
                </div>

                <div className="flex justify-end mb-8">
                    {user && (
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/communityboard/create">
                                <Plus className="h-5 w-5 mr-2" />
                                Create a Post
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.id} href={`/communityboard/${post.id}`}>
                            <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                                {post.media_url && (
                                    <div className="relative h-48 w-full">
                                        <iframe
                                            src={post.media_url.replace('/view', '/preview')}
                                            className="w-full h-full object-cover rounded-t-lg"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold line-clamp-2">
                                        {post.title}
                                    </CardTitle>
                                    <p className="text-sm text-gray-500">
                                        Posted by {post.users?.nickname || 'Anonymous'} on {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                        {truncateContent(post.content)}
                                    </p>
                                    <div className="flex items-center space-x-4 text-gray-500 text-sm mt-auto">
                                        <div className="flex items-center">
                                            <Eye className="h-4 w-4 mr-1" />
                                            <span>{post.view_count}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Heart className="h-4 w-4 mr-1" />
                                            <span>{post.likes_count}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <MessageCircle className="h-4 w-4 mr-1" />
                                            <span>{post.comments_count}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
                {posts.length === 0 && !loading && (
                    <div className="text-center text-gray-500 mt-12">No posts found. Be the first to share!</div>
                )}
            </div>
        </div>
    );
}
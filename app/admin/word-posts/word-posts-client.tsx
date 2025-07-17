"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format, startOfDay, subDays, addDays } from "date-fns";
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import {
  Settings, Save, X, MessageCircle, Heart, Download, BookOpen,
  Calendar as CalendarIcon, Frown, ImageIcon, Upload, Loader2,
  CheckCircle, XCircle, ArrowLeft
} from "lucide-react";
import imageCompression from "browser-image-compression";

// Post 타입 정의
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  published_date: string;
  image_url: string | null;
  likes: number;
  comments: number;
};

// 메인 클라이언트 컴포넌트
export default function WordPostsClient() {
  const { user, userProfile, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const timeZone = 'Asia/Seoul';

  // 데이터 로딩 함수
  const fetchPosts = useCallback(async (date: Date) => {
    setIsLoading(true);
    setError(null);

    const zonedDate = toZonedTime(date, timeZone);
    const formattedDate = formatInTimeZone(zonedDate, timeZone, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('word_posts')
      .select('*')
      .eq('published_date', formattedDate)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      setError("게시물을 불러오는 데 실패했습니다.");
    } else {
      setPosts(data as Post[]);
    }
    setIsLoading(false);
  }, [timeZone]);

  // 날짜 변경 시 게시물 다시 로드
  useEffect(() => {
    fetchPosts(selectedDate);
  }, [selectedDate, fetchPosts]);

  // 수정할 게시물 로드
  useEffect(() => {
    if (postId) {
      const fetchPostToEdit = async () => {
        const { data, error } = await supabase
          .from('word_posts')
          .select('*')
          .eq('id', postId)
          .single();
        if (data) {
          setEditingPost(data);
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
        } else {
          setError("수정할 게시물을 찾을 수 없습니다.");
        }
      };
      fetchPostToEdit();
    }
  }, [postId]);

  // 권한 확인
  useEffect(() => {
    if (!authLoading && userRole !== 'admin') {
      router.push('/');
    }
  }, [userRole, authLoading, router]);

  // 이미지 압축 및 처리 핸들러
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      setImageFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Image compression error:", error);
      setError("이미지 압축에 실패했습니다.");
    }
  };

  // 이미지 업로드 함수
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    setIsUploading(true);
    const fileName = `${user!.id}-${Date.now()}`;
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, imageFile);

    setIsUploading(false);
    if (error) {
      console.error("Image upload error:", error);
      setError("이미지 업로드에 실패했습니다.");
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(data.path);
    return publicUrl;
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!editingPost || !editingPost.title || !editingPost.content) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }
    
    let imageUrl = editingPost.image_url || null;
    if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) return; // 업로드 실패 시 중단
    }

    const postData = {
      ...editingPost,
      author_id: user!.id,
      author_nickname: userProfile?.nickname || 'Admin',
      published_date: format(selectedDate, 'yyyy-MM-dd'),
      image_url: imageUrl,
    };
    
    const { error } = await supabase.from('word_posts').upsert(postData);

    if (error) {
      console.error("Error saving post:", error);
      setError("게시물 저장에 실패했습니다.");
    } else {
      setEditingPost(null);
      setImageFile(null);
      setImagePreview(null);
      router.push('/admin/word-posts');
      fetchPosts(selectedDate);
    }
  };

  // 컴포넌트 렌더링
  if (authLoading) return <div>Loading user...</div>;
  if (userRole !== 'admin') return <div>Access Denied.</div>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">말씀 게시물 관리</CardTitle>
          <CardDescription>날짜를 선택하여 해당 날짜의 게시물을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {editingPost ? (
            // 편집/새 글 작성 폼
            <div>
              <Button variant="outline" onClick={() => { setEditingPost(null); router.push('/admin/word-posts'); }}>
                <ArrowLeft className="mr-2 h-4 w-4" /> 목록으로 돌아가기
              </Button>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input id="title" value={editingPost.title || ''} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="content">내용</Label>
                  <Textarea id="content" value={editingPost.content || ''} onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })} rows={10} />
                </div>
                <div>
                  <Label>이미지</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> 이미지 선택
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    {isUploading && <Loader2 className="h-5 w-5 animate-spin" />}
                  </div>
                  {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 max-w-sm rounded-lg" />}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setEditingPost(null); router.push('/admin/word-posts'); }}>취소</Button>
                  <Button onClick={handleSave}>저장</Button>
                </div>
              </div>
            </div>
          ) : (
            // 게시물 목록 뷰
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="relative">
                  <Button variant="outline" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "yyyy-MM-dd")}
                  </Button>
                  {isCalendarOpen && (
                    <div className="absolute z-10 bg-white border rounded-md mt-2">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) setSelectedDate(startOfDay(date));
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </div>
                  )}
                </div>
                <Button onClick={() => setEditingPost({})}>새 글 작성</Button>
              </div>

              {isLoading ? (
                <div>Loading posts...</div>
              ) : posts.length === 0 ? (
                <Alert>
                  <BookOpen className="h-4 w-4" />
                  <AlertTitle>게시물 없음</AlertTitle>
                  <AlertDescription>선택된 날짜에 게시물이 없습니다. 새 글을 작성해보세요.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {posts.map(post => (
                    <Card key={post.id} className="flex flex-col md:flex-row">
                      {post.image_url && <img src={post.image_url} alt={post.title} className="w-full md:w-48 h-48 object-cover rounded-l-lg" />}
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="text-lg font-bold">{post.title}</h3>
                          <p className="text-sm text-gray-500">by {post.author_nickname} on {post.published_date}</p>
                          <p className="mt-2 text-sm line-clamp-3">{post.content}</p>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/word-posts?id=${post.id}`)}>수정</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
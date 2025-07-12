// app/admin/word-posts/page.tsx
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
import { format, startOfDay, subDays, isFuture, isPast } from "date-fns";
// ✅ 추가: date-fns-tz에서 필요한 함수 임포트
import { toZonedTime, formatInTimeZone } from 'date-fns-tz'; 
import {
  Settings, Save, X, MessageCircle, Heart, Download, BookOpen,
  Calendar as CalendarIcon, Frown, ImageIcon, Upload, Loader2,
  CheckCircle, XCircle
} from "lucide-react";
import imageCompression from "browser-image-compression";

interface WordPost {
  id: string;
  title: string;
  content: string;
  word_date: string; 
  author_id: string;
  author_nickname: string;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
}

export default function AdminWordPostsPage() {
  const { user, userProfile, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // ✅ 수정: wordDate 초기값을 UTC 기준으로 설정
  const [wordDate, setWordDate] = useState<Date | undefined>(startOfDay(toZonedTime(new Date(), 'UTC')));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isDateConflicting, setIsDateConflicting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || userRole !== 'admin') {
        router.push('/');
        return;
      }

      if (postId) {
        const fetchPost = async () => {
          const { data, error } = await supabase
            .from('word_posts')
            .select('*')
            .eq('id', postId)
            .single();

          if (error) {
            console.error("Error fetching word post for editing:", error);
            setMessage({ type: 'error', text: "말씀 게시물을 불러오는 데 실패했습니다." });
            return;
          }

          if (data) {
            setTitle(data.title);
            setContent(data.content);
            // ✅ 수정: 불러온 날짜도 UTC 기준으로 변환
            const fetchedDate = startOfDay(toZonedTime(new Date(data.word_date), 'UTC'));
            setWordDate(fetchedDate);
            setImageUrlPreview(data.image_url || null);
          }
        };
        fetchPost();
      }
    }
  }, [authLoading, user, userRole, postId, router]);

  useEffect(() => {
    if (wordDate) {
      const checkDateConflict = async () => {
        // ✅ 수정: 쿼리 날짜를 명시적으로 UTC로 포맷
        const formattedDate = formatInTimeZone(wordDate, 'UTC', 'yyyy-MM-dd');
        const { data, error } = await supabase
          .from('word_posts')
          .select('id')
          .eq('word_date', formattedDate);

        if (error) {
          console.error("Error checking date conflict:", error);
          setIsDateConflicting(false);
          return;
        }

        const isConflict = data.some(post => post.id !== postId);
        setIsDateConflicting(isConflict);
        if (isConflict) {
          setMessage({ type: 'error', text: `선택하신 날짜 (${formattedDate})에 이미 말씀 게시물이 존재합니다. 다른 날짜를 선택하거나 기존 게시물을 편집해 주세요.` });
        } else {
          setMessage(null);
        }
      };
      checkDateConflict();
    }
  }, [wordDate, postId]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: 'error', text: "이미지 파일만 업로드할 수 있습니다." });
      return;
    }

    setMessage(null);
    setIsCompressing(true);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      setImageFile(compressedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrlPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);

    } catch (error) {
      console.error("이미지 압축 중 오류 발생:", error);
      setMessage({ type: 'error', text: "이미지 압축 중 오류가 발생했습니다. 다른 파일을 시도해 주세요." });
      setImageFile(null);
      setImageUrlPreview(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (!user || !userProfile) {
      setMessage({ type: 'error', text: "사용자 정보가 없습니다. 다시 로그인해주세요." });
      setIsSubmitting(false);
      return;
    }
    if (!title.trim() || !content.trim() || !wordDate) {
      setMessage({ type: 'error', text: "제목, 내용, 날짜는 필수 입력 사항입니다." });
      setIsSubmitting(false);
      return;
    }
    if (isDateConflicting) {
      setMessage({ type: 'error', text: "선택하신 날짜에 이미 말씀 게시물이 존재합니다. 다른 날짜를 선택하거나 기존 게시물을 편집해 주세요." });
      setIsSubmitting(false);
      return;
    }

    let finalImageUrl: string | null = imageUrlPreview; 

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `word-backgrounds/${fileName}`; 

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('word-backgrounds') 
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error("이미지 업로드 오류:", uploadData, uploadError);
        setMessage({ type: 'error', text: `이미지 업로드에 실패했습니다: ${uploadError.message}` });
        setIsSubmitting(false);
        return;
      }
      finalImageUrl = supabase.storage.from('word-backgrounds').getPublicUrl(filePath).data.publicUrl;
    }

    const postData = {
      title,
      content,
      // ✅ 수정: word_date를 명시적으로 UTC로 포맷하여 저장
      word_date: formatInTimeZone(wordDate, 'UTC', 'yyyy-MM-dd'),
      author_id: user.id,
      author_nickname: userProfile.nickname || user.email || '관리자',
      image_url: finalImageUrl,
    };

    const { error: dbError } = await supabase
      .from('word_posts')
      .upsert(postId ? { ...postData, id: postId } : postData); 

    if (dbError) {
      console.error("말씀 게시물 저장 오류:", dbError);
      setMessage({ type: 'error', text: `말씀 게시물 저장에 실패했습니다: ${dbError.message}` });
      setIsSubmitting(false);
      return;
    }

    setMessage({ type: 'success', text: "말씀 게시물이 성공적으로 저장되었습니다!" });
    try {
      const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/word`);
      if (!revalidateResponse.ok) {
        const errorData = await revalidateResponse.json();
        console.error("Revalidation failed:", errorData.message);
        setMessage(prev => prev ? { ...prev, text: prev.text + " (페이지 재검증 실패)" } : null);
      } else {
        console.log("Word page revalidated successfully!");
      }
    } catch (err) {
      console.error("Failed to call revalidate API:", err);
      setMessage(prev => prev ? { ...prev, text: prev.text + " (페이지 재검증 API 호출 실패)" } : null);
    }

    if (!postId) {
      setTitle("");
      setContent("");
      // ✅ 수정: 초기 날짜를 UTC 기준으로 설정
      setWordDate(startOfDay(toZonedTime(new Date(), 'UTC')));
      setImageFile(null);
      setImageUrlPreview(null);
    }
    setIsSubmitting(false);
    router.push('/word');
  };

  const getDisabledDays = useCallback(() => { 
    const today = new Date(); 
    // ✅ 수정: 현재 시간을 UTC 기준으로 변환
    const nowUtc = toZonedTime(today, 'UTC'); 
    const startOfTodayUtc = startOfDay(nowUtc);

    const fiveDaysAgoUtc = startOfDay(subDays(nowUtc, 5)); 
    
    // ✅ 수정: 미래 날짜 및 5일 이전 과거 날짜를 UTC 기준으로 비교
    const futureDates = { from: startOfDay(toZonedTime(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), 'UTC')), to: toZonedTime(new Date(2100, 0, 1), 'UTC') }; 
    const pastBeyondFiveDays = { from: toZonedTime(new Date(1900, 0, 1), 'UTC'), to: startOfDay(subDays(nowUtc, 6)) }; // today - 6일의 시작이 5일 이전의 과거

    return [
      futureDates,
      pastBeyondFiveDays
    ];
  }, []);

  const fiveDaysAgoClientSide = startOfDay(toZonedTime(subDays(new Date(), 5), 'UTC')); // ✅ 수정: UTC 기준으로 fiveDaysAgoClientSide 계산


  if (authLoading || (!user && !authLoading) || (user && userRole !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        관리자 권한이 필요합니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 pt-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {postId ? "말씀 게시물 편집" : "새 말씀 게시물 작성"}
            </CardTitle>
            <CardDescription>
              매일 말씀 게시물과 배경 이미지를 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                  {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  <AlertTitle>{message.type === 'error' ? "오류!" : "성공!"}</AlertTitle>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              {/* 말씀 날짜 선택 */}
              <div>
                <Label htmlFor="wordDate" className="mb-2 block">말씀 날짜</Label>
                <Calendar
                  mode="single"
                  selected={wordDate}
                  // ✅ 수정: 날짜 선택 시 UTC 기준으로 설정
                  onSelect={(date) => setWordDate(date ? startOfDay(toZonedTime(date, 'UTC')) : undefined)}
                  initialFocus
                  disabled={getDisabledDays()}
                  className="rounded-md border shadow"
                />
                {wordDate && (
                  <p className="text-sm text-gray-600 mt-2">
                    선택된 날짜: {format(wordDate, 'yyyy년 MM월 dd일 (EEE)')}
                  </p>
                )}
              </div>

              {/* 말씀 제목 */}
              <div>
                <Label htmlFor="title" className="mb-2 block">말씀 제목</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 요한복음 3:16"
                  required
                />
              </div>

              {/* 말씀 내용 */}
              <div>
                <Label htmlFor="content" className="mb-2 block">말씀 내용</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="말씀 내용을 입력하세요 (예: 하나님이 세상을 이처럼 사랑하사...)"
                  rows={6}
                  required
                />
              </div>

              {/* 배경 이미지 업로드 */}
              <div>
                <Label htmlFor="image" className="mb-2 block">배경 이미지 (선택 사항)</Label>
                <div className="flex items-center space-x-4">
                  <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100">
                    {imageUrlPreview ? (
                      <img src={imageUrlPreview} alt="Image Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    )}
                    {isCompressing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    )}
                  </div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    ref={fileInputRef}
                    className="hidden"
                    disabled={isCompressing}
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isCompressing ? "압축 중..." : "이미지 선택"}
                  </Button>
                  {imageUrlPreview && !isCompressing && (
                    <Button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImageUrlPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = ''; // 파일 입력 초기화
                      }}
                      variant="ghost"
                    >
                      <X className="h-4 w-4 mr-2" />
                      이미지 제거
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  최대 1MB, JPG/PNG 형식 권장. 자동으로 압축됩니다.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || isCompressing || isDateConflicting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  postId ? "말씀 업데이트" : "말씀 작성"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

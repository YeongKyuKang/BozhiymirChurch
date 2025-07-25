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
import { format, startOfDay } from "date-fns";
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import {
  Settings, Save, X, MessageCircle, Heart, Download, BookOpen,
  Calendar as CalendarIcon, Frown, ImageIcon, Upload, Loader2,
  CheckCircle, XCircle, ArrowLeft
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

const POLAND_TIMEZONE = 'Europe/Warsaw';

export default function WordPostsClient() {
  const { user, userProfile, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const [wordDate, setWordDate] = useState<Date | undefined>(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
            const [year, month, day] = data.word_date.split('-').map(Number);
            setWordDate(new Date(Date.UTC(year, month - 1, day)));
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
        const formattedDateForQuery = wordDate.toISOString().substring(0, 10);
        const { data, error } = await supabase
          .from('word_posts')
          .select('id')
          .eq('word_date', formattedDateForQuery);

        if (error) {
          console.error("Error checking date conflict:", error);
          setIsDateConflicting(false);
          return;
        }

        const isConflict = data.some(post => post.id !== postId);
        setIsDateConflicting(isConflict);
        if (isConflict) {
          setMessage({ type: 'error', text: `선택하신 날짜 (${formattedDateForQuery})에 이미 말씀 게시물이 존재합니다. 다른 날짜를 선택하거나 기존 게시물을 편집해 주세요.` });
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
      word_date: wordDate.toISOString().substring(0, 10),
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
      // Note: Revalidation might require a secret token in a real production environment
      const revalidateResponse = await fetch(`/api/revalidate?path=/word`);
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
      const now = new Date();
      setWordDate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
      setImageFile(null);
      setImageUrlPreview(null);
    }
    setIsSubmitting(false);
    router.push('/word');
  };

  const getDisabledDays = useCallback(() => {
    const now = new Date();
    const futureDates = {
      from: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1)),
      to: new Date(Date.UTC(2100, 0, 1))
    };
    const pastBeyondFiveDays = {
      from: new Date(Date.UTC(1900, 0, 1)),
      to: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 6))
    };
    return [futureDates, pastBeyondFiveDays];
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setWordDate(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())));
    } else {
      setWordDate(undefined);
    }
  };

  if (authLoading || (!user && !authLoading) || (user && userRole !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        관리자 권한이 필요합니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 pt-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <Button
            variant="outline"
            className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
        </div>

        <Card className="shadow-lg bg-gray-800 border border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">
              {postId ? "말씀 게시물 편집" : "새 말씀 게시물 작성"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              매일 말씀 게시물과 배경 이미지를 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'error' ? 'bg-red-900 text-white border-red-700' : 'bg-green-900 text-white border-green-700'}>
                  {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  <AlertTitle>{message.type === 'error' ? "오류!" : "성공!"}</AlertTitle>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="wordDate" className="mb-2 block text-gray-300">말씀 날짜</Label>
                <Calendar
                  mode="single"
                  selected={wordDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={getDisabledDays()}
                  className="rounded-md border shadow bg-gray-700 text-white border-gray-600"
                />
                {wordDate && (
                  <p className="text-sm text-gray-400 mt-2">
                    선택된 날짜: {formatInTimeZone(wordDate, POLAND_TIMEZONE, 'yyyy년 MM월 dd일 (EEE)')}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="title" className="mb-2 block text-gray-300">말씀 제목</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 요한복음 3:16"
                  required
                  className="bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="content" className="mb-2 block text-gray-300">말씀 내용</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="말씀 내용을 입력하세요 (예: 하나님이 세상을 이처럼 사랑하사...)"
                  rows={6}
                  required
                  className="bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="image" className="mb-2 block text-gray-300">배경 이미지 (선택 사항)</Label>
                <div className="flex items-center space-x-4">
                  <div className="relative w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center overflow-hidden bg-gray-700">
                    {imageUrlPreview ? (
                      <img src={imageUrlPreview} alt="Image Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-500" />
                    )}
                    {isCompressing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
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
                    className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:text-white"
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
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      variant="ghost"
                      className="text-red-400 hover:bg-gray-700 hover:text-red-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      이미지 제거
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  최대 1MB, JPG/PNG 형식 권장. 자동으로 압축됩니다.
                </p>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg" disabled={isSubmitting || isCompressing || isDateConflicting}>
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

// app/admin/events/page.tsx
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, startOfDay } from "date-fns";
import imageCompression from "browser-image-compression";
import {
  Settings, Save, X, ImageIcon, Upload, Loader2,
  CheckCircle, XCircle, Calendar as CalendarIcon, ArrowLeft
} from "lucide-react";

interface EventPost {
  id: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  category: string | null;
  image_url: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

export default function AdminEventsPage() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(startOfDay(new Date()));
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 백업 이미지 목록 정의
  const backupImages = [
    "/backup_images/event-backup-1.jpg",
    "/backup_images/event-backup-2.jpg",
    "/backup_images/event-backup-3.jpg",
    "/backup_images/event-backup-4.jpg",
    "/backup_images/event-backup-5.jpg",
  ];

  useEffect(() => {
    if (!authLoading) {
      if (!user || userRole !== 'admin') {
        router.push('/');
        return;
      }

      if (eventId) {
        const fetchEvent = async () => {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

          if (error) {
            console.error("Error fetching event for editing:", error);
            setMessage({ type: 'error', text: "이벤트 정보를 불러오는 데 실패했습니다." });
            return;
          }

          if (data) {
            setTitle(data.title);
            setDescription(data.description);
            setEventDate(data.event_date ? new Date(data.event_date) : undefined);
            setStartTime(data.start_time || "");
            setEndTime(data.end_time || "");
            setLocation(data.location || "");
            setCategory(data.category || "");
            setImageUrlPreview(data.image_url || null);
          }
        };
        fetchEvent();
      }
    }
  }, [authLoading, user, userRole, eventId, router]);

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

    if (!user) {
      setMessage({ type: 'error', text: "사용자 정보가 없습니다. 다시 로그인해주세요." });
      setIsSubmitting(false);
      return;
    }
    if (!title.trim() || !description.trim() || !eventDate || !category) {
      setMessage({ type: 'error', text: "제목, 설명, 날짜, 카테고리는 필수 입력 사항입니다." });
      setIsSubmitting(false);
      return;
    }

    let finalImageUrl: string | null = imageUrlPreview; 

    // 이미지가 새로 업로드되었거나 기존 이미지가 있는 경우
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `event-banners/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-banners')
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
      finalImageUrl = supabase.storage.from('event-banners').getPublicUrl(filePath).data.publicUrl;
    } else if (!imageUrlPreview) {
      // 새로운 이미지가 없고, 기존 이미지도 없는 경우 백업 이미지 사용
      const randomIndex = Math.floor(Math.random() * backupImages.length);
      finalImageUrl = backupImages[randomIndex];
    }

    const slug = encodeURIComponent(title.trim().toLowerCase().replace(/\s+/g, '-'));

    const eventData = {
      title,
      description,
      event_date: format(eventDate, 'yyyy-MM-dd'),
      start_time: startTime || null,
      end_time: endTime || null,
      location: location || null,
      category: category,
      image_url: finalImageUrl,
      slug,
    };

    const { error: dbError } = await supabase
      .from('events')
      .upsert(eventId ? { ...eventData, id: eventId } : eventData); 

    if (dbError) {
      console.error("이벤트 저장 오류:", dbError);
      setMessage({ type: 'error', text: `이벤트 저장에 실패했습니다: ${dbError.message}` });
      setIsSubmitting(false);
      return;
    }

    setMessage({ type: 'success', text: "이벤트가 성공적으로 저장되었습니다!" });
    
    try {
      const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/events`);
      if (!revalidateResponse.ok) {
        const errorData = await revalidateResponse.json();
        console.error("Revalidation failed:", errorData.message);
        setMessage(prev => prev ? { ...prev, text: prev.text + " (페이지 재검증 실패)" } : null);
      } else {
        console.log("Events page revalidated successfully!");
      }
    } catch (err) {
      console.error("Failed to call revalidate API:", err);
      setMessage(prev => prev ? { ...prev, text: prev.text + " (페이지 재검증 API 호출 실패)" } : null);
    }

    if (!eventId) {
      setTitle("");
      setDescription("");
      setEventDate(startOfDay(new Date()));
      setStartTime("");
      setEndTime("");
      setLocation("");
      setCategory("");
      setImageFile(null);
      setImageUrlPreview(null);
    }
    setIsSubmitting(false);
    router.push('/events'); 
  };

  const getDisabledDays = useCallback(() => {
    const today = startOfDay(new Date());
    return { before: today }; 
  }, []);

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
        {/* 뒤로가기 버튼을 좌측 상단에 배치 */}
        <div className="mb-8"> {/* 제목 위쪽에 여백 추가 */}
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
              {eventId ? "이벤트 편집" : "새 이벤트 작성"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              교회 이벤트를 생성하고 관리합니다.
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

              {/* 이벤트 제목 */}
              <div>
                <Label htmlFor="title" className="mb-2 block text-gray-300">이벤트 제목</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 주일 예배"
                  required
                  className="bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* 이벤트 설명 */}
              <div>
                <Label htmlFor="description" className="mb-2 block text-gray-300">이벤트 설명</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="이벤트에 대한 자세한 설명을 입력하세요."
                  rows={4}
                  required
                  className="bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* 이벤트 날짜 선택 */}
              <div>
                <Label htmlFor="eventDate" className="mb-2 block text-gray-300">이벤트 날짜</Label>
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  initialFocus
                  disabled={getDisabledDays()}
                  className="rounded-md border shadow bg-gray-700 text-white border-gray-600"
                />
                {eventDate && (
                  <p className="text-sm text-gray-400 mt-2">
                    선택된 날짜: {format(eventDate, 'yyyy년 MM월 dd일 (EEE)')}
                  </p>
                )}
              </div>

              {/* 시간 및 장소 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="mb-2 block text-gray-300">시작 시간 (선택 사항)</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime" className="mb-2 block text-gray-300">종료 시간 (선택 사항)</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="location" className="mb-2 block text-gray-300">장소 (선택 사항)</Label>
                  <Input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="예: 본당, 온라인 (Zoom)"
                    className="bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 카테고리 선택 */}
              <div>
                <Label htmlFor="category" className="mb-2 block text-gray-300">카테고리</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    <SelectItem value="예배">예배</SelectItem>
                    <SelectItem value="성경공부">성경공부</SelectItem>
                    <SelectItem value="공동체">공동체</SelectItem>
                    <SelectItem value="어린이">어린이</SelectItem>
                    <SelectItem value="청소년/청년">청소년/청년</SelectItem>
                    <SelectItem value="봉사">봉사</SelectItem>
                    <SelectItem value="특별 행사">특별 행사</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 배경 이미지 업로드 */}
              <div>
                <Label htmlFor="image" className="mb-2 block text-gray-300">이벤트 이미지 (선택 사항)</Label>
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

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg" disabled={isSubmitting || isCompressing}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  eventId ? "이벤트 업데이트" : "이벤트 작성"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

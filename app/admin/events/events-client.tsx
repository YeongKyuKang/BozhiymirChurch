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

// Event 타입 정의
type Event = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string | null;
  category: string;
};

// 메인 클라이언트 컴포넌트
export default function EventsClient() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');

  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이벤트 데이터 로딩
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
    if (error) {
      setError("이벤트를 불러오는 데 실패했습니다.");
    } else {
      setEvents(data as Event[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 수정할 이벤트 로드
  useEffect(() => {
    if (eventId) {
      const fetchEventToEdit = async () => {
        const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
        if (data) {
          setEditingEvent(data);
          if (data.image_url) setImagePreview(data.image_url);
        } else {
          setError("수정할 이벤트를 찾을 수 없습니다.");
        }
      };
      fetchEventToEdit();
    }
  }, [eventId]);
  
  // 권한 확인
  useEffect(() => {
    if (!authLoading && userRole !== 'admin') {
      router.push('/');
    }
  }, [userRole, authLoading, router]);

  // 이미지 처리
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
      setImageFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      setError("이미지 압축에 실패했습니다.");
    }
  };

  // 이미지 업로드
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return editingEvent?.image_url || null;
    setIsUploading(true);
    const fileName = `${user!.id}-event-${Date.now()}`;
    const { data, error } = await supabase.storage.from('event-images').upload(fileName, imageFile);
    setIsUploading(false);
    if (error) {
      setError("이미지 업로드에 실패했습니다.");
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(data.path);
    return publicUrl;
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!editingEvent?.title || !editingEvent?.date) {
      setError("제목과 날짜는 필수입니다.");
      return;
    }
    
    const imageUrl = await uploadImage();
    if (isUploading) return; // 업로드 중이면 저장 방지

    const eventData = { ...editingEvent, image_url: imageUrl };
    const { error } = await supabase.from('events').upsert(eventData);

    if (error) {
      setError("이벤트 저장에 실패했습니다.");
    } else {
      setEditingEvent(null);
      setImageFile(null);
      setImagePreview(null);
      router.push('/admin/events');
      fetchEvents();
    }
  };
  
  // 렌더링
  if (authLoading) return <div>Loading user...</div>;
  if (userRole !== 'admin') return <div>Access Denied.</div>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">이벤트 관리</CardTitle>
          <CardDescription>새로운 이벤트를 추가하거나 기존 이벤트를 수정합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {editingEvent ? (
            // 편집/새 이벤트 폼
            <div>
              <Button variant="outline" onClick={() => { setEditingEvent(null); router.push('/admin/events'); }}>
                <ArrowLeft className="mr-2 h-4 w-4" /> 목록으로 돌아가기
              </Button>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">이벤트 제목</Label>
                  <Input id="title" value={editingEvent.title || ''} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="date">날짜</Label>
                  <Input id="date" type="date" value={editingEvent.date || ''} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="time">시간</Label>
                  <Input id="time" value={editingEvent.time || ''} onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="location">장소</Label>
                  <Input id="location" value={editingEvent.location || ''} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select value={editingEvent.category || ''} onValueChange={(value) => setEditingEvent({ ...editingEvent, category: value })}>
                    <SelectTrigger><SelectValue placeholder="카테고리 선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worship">예배</SelectItem>
                      <SelectItem value="community">커뮤니티</SelectItem>
                      <SelectItem value="outreach">봉사</SelectItem>
                      <SelectItem value="special">특별 이벤트</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">설명</Label>
                  <Textarea id="description" value={editingEvent.description || ''} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} rows={5} />
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
                  <Button variant="outline" onClick={() => { setEditingEvent(null); router.push('/admin/events'); }}>취소</Button>
                  <Button onClick={handleSave}>저장</Button>
                </div>
              </div>
            </div>
          ) : (
            // 이벤트 목록
            <div>
              <div className="flex justify-end mb-4">
                <Button onClick={() => setEditingEvent({})}>새 이벤트 추가</Button>
              </div>
              {isLoading ? (
                <div>Loading events...</div>
              ) : events.length === 0 ? (
                <p>등록된 이벤트가 없습니다.</p>
              ) : (
                <div className="space-y-4">
                  {events.map(event => (
                    <Card key={event.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.date} at {event.location}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/events?id=${event.id}`)}>수정</Button>
                      </CardContent>
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
"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Calendar, Users, Trash2, 
  Plus, Image as ImageIcon, Upload, Loader2 
} from "lucide-react";

export default function AdminDashboard() {
  const supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState("users");
  
  // 상태 관리
  const [isUploading, setIsUploading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [thanks, setThanks] = useState<any[]>([]);
  
  // 말씀 카드 및 이벤트 데이터 상태
  const [wordData, setWordData] = useState({ title: "", content: "", date: "", imageUrl: "" });
  const [eventData, setEventData] = useState({ title: "", description: "", date: "", location: "", imageUrl: "" });

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    if (activeTab === "users") {
      const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
      setUsers(data || []);
    } else if (activeTab === "thanks") {
      const { data } = await supabase.from("thanks_posts").select("*").order("created_at", { ascending: false });
      setThanks(data || []);
    }
  };

  // --- [이미지 업로드 공통 로직] ---
  const handleImageUpload = async (file: File, target: 'word' | 'event') => {
    if (!file) return;
    
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${target}_${Math.random()}.${fileExt}`;
    const filePath = `${target}/${fileName}`;

    // 1. Supabase Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) {
      alert("업로드 실패: " + uploadError.message);
      setIsUploading(false);
      return;
    }

    // 2. 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    if (target === 'word') setWordData({ ...wordData, imageUrl: publicUrl });
    else setEventData({ ...eventData, imageUrl: publicUrl });
    
    setIsUploading(false);
  };

  // --- 말씀 카드 생성 ---
  const handleCreateWord = async () => {
    const { error } = await supabase.from("word_posts").insert([{
      title: wordData.title,
      content: wordData.content,
      word_date: wordData.date,
      image_url: wordData.imageUrl
    }]);
    if (!error) {
      alert("말씀 카드가 성공적으로 생성되었습니다.");
      setWordData({ title: "", content: "", date: "", imageUrl: "" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-black mb-10 tracking-tighter italic text-slate-900 underline decoration-blue-500 underline-offset-8">
          CONTROL CENTER
        </h1>
        
        <Tabs defaultValue="users" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-14 w-full md:w-auto">
            <TabsTrigger value="users" className="rounded-xl px-8 font-bold text-slate-500 data-[state=active]:text-blue-600">유저/커뮤니티</TabsTrigger>
            <TabsTrigger value="word" className="rounded-xl px-8 font-bold text-slate-500 data-[state=active]:text-blue-600">말씀 카드 관리</TabsTrigger>
            <TabsTrigger value="events" className="rounded-xl px-8 font-bold text-slate-500 data-[state=active]:text-blue-600">이벤트 관리</TabsTrigger>
          </TabsList>

          {/* 1. 유저 및 커뮤니티 관리 탭 (생략 - 이전 코드와 동일) */}

          {/* 2. 말씀 카드 관리 탭 (이미지 업로드 기능 추가) */}
          <TabsContent value="word">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* 프리뷰 카드 */}
              <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white sticky top-28 h-fit">
                <div className="aspect-[4/5] bg-slate-900 flex items-center justify-center relative overflow-hidden">
                  {wordData.imageUrl ? (
                    <>
                      <img src={wordData.imageUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    </>
                  ) : (
                    <ImageIcon className="w-16 h-16 text-slate-700" />
                  )}
                  <div className="relative z-10 text-center p-8 w-full">
                    <h3 className="text-3xl font-black text-white mb-6 tracking-tight drop-shadow-lg">{wordData.title || "구절 입력"}</h3>
                    <p className="text-lg text-white/90 font-medium leading-relaxed drop-shadow-md whitespace-pre-wrap">{wordData.content || "여기에 말씀 내용이 표시됩니다."}</p>
                  </div>
                </div>
              </Card>

              {/* 입력 폼 */}
              <Card className="rounded-[32px] border-none shadow-sm bg-white p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-400 uppercase ml-1">배경 이미지 업로드</label>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      id="word-image-upload" 
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'word')} 
                    />
                    <label 
                      htmlFor="word-image-upload" 
                      className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:bg-slate-50 transition-all font-bold text-slate-500"
                    >
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      {wordData.imageUrl ? "이미지 변경하기" : "배경 이미지 선택"}
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input placeholder="말씀 구절 (예: 시편 23:1)" value={wordData.title} onChange={e => setWordData({...wordData, title: e.target.value})} className="h-14 rounded-xl font-bold" />
                  <Textarea placeholder="말씀 본문 또는 묵상 내용" className="min-h-[160px] rounded-xl font-medium p-4" value={wordData.content} onChange={e => setWordData({...wordData, content: e.target.value})} />
                  <Input type="date" value={wordData.date} onChange={e => setWordData({...wordData, date: e.target.value})} className="h-14 rounded-xl font-bold" />
                </div>

                <Button onClick={handleCreateWord} disabled={isUploading || !wordData.title} className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]">
                  말씀 카드 발행하기
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* 3. 이벤트 관리 탭 (유연한 추가 기능 적용) */}
          <TabsContent value="events">
            <Card className="rounded-[32px] border-none shadow-sm p-10 bg-white">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">NEW EVENT</h2>
                  <p className="text-slate-400 font-bold mt-1">특별 행사 및 교육 일정 관리</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <Input placeholder="이벤트 제목" value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} className="h-14 rounded-xl border-slate-200 font-bold" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="date" value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} className="h-14 rounded-xl font-bold" />
                    <Input placeholder="장소" value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} className="h-14 rounded-xl font-bold" />
                  </div>
                  <Textarea placeholder="이벤트 상세 설명 (준비물, 시간표 등)" className="min-h-[120px] rounded-xl font-medium" value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} />
                </div>

                <div className="space-y-5">
                   <div className="h-full min-h-[200px] rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
                    {eventData.imageUrl ? (
                      <img src={eventData.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="event" />
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-slate-200 mb-2" />
                        <p className="text-sm font-bold text-slate-300 underline underline-offset-4 cursor-pointer" onClick={() => document.getElementById('event-img')?.click()}>이벤트 포스터 업로드</p>
                      </>
                    )}
                    <input type="file" id="event-img" className="hidden" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'event')} />
                   </div>
                </div>
              </div>

              <Button className="w-full mt-10 h-16 rounded-2xl bg-slate-900 text-white font-black text-xl hover:bg-black transition-all">
                이벤트 등록 및 공지 발송
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
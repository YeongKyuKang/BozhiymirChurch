"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, Users, Calendar, 
  Image as ImageIcon, Upload, Loader2, 
  Save, Activity, BookOpen
} from "lucide-react";
import { format } from "date-fns";

// 유저 관리 컴포넌트 임포트
import AdminUsersClient from "@/components/admin-users-client";

export default function AdminDashboard() {
  const supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // 데이터 상태
  const [stats, setStats] = useState({
    userCount: 0,
    eventCount: 0,
    wordCount: 0,
  });
  
  const [usersData, setUsersData] = useState<any[]>([]);

  // 말씀 카드 및 이벤트 데이터 상태
  const [isUploading, setIsUploading] = useState(false);
  const [wordData, setWordData] = useState({ title: "", content: "", date: format(new Date(), "yyyy-MM-dd"), imageUrl: "" });
  const [eventData, setEventData] = useState({ title: "", description: "", date: format(new Date(), "yyyy-MM-dd"), location: "", imageUrl: "" });

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. 유저 데이터 가져오기
      const { data: users, count: userCount } = await supabase.from("users").select("*", { count: 'exact' }).order("created_at", { ascending: false });
      
      // 2. 이벤트 수
      const { count: eventCount } = await supabase.from("events").select("*", { count: 'exact', head: true });
      
      // 3. 말씀 카드 수
      const { count: wordCount } = await supabase.from("word_posts").select("*", { count: 'exact', head: true });

      setUsersData(users || []);
      setStats({
        userCount: userCount || 0,
        eventCount: eventCount || 0,
        wordCount: wordCount || 0,
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  // --- [이미지 업로드 공통 로직] ---
  const handleImageUpload = async (file: File, target: 'word' | 'event') => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${target}_${Date.now()}.${fileExt}`;
      const bucket = target === 'word' ? 'word-backgrounds' : 'event-banners'; 

      // 1. Supabase Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from(bucket) 
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      if (target === 'word') setWordData({ ...wordData, imageUrl: publicUrl });
      else setEventData({ ...eventData, imageUrl: publicUrl });

    } catch (error: any) {
      alert("이미지 업로드 실패: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // --- 생성 핸들러 ---
  const handleCreate = async (type: 'word' | 'event') => {
    const isWord = type === 'word';
    const table = isWord ? "word_posts" : "events";
    const payload = isWord ? {
      title: wordData.title,
      content: wordData.content,
      word_date: wordData.date,
      image_url: wordData.imageUrl,
    } : {
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.date,
      location: eventData.location,
      image_url: eventData.imageUrl
    };

    const { error } = await supabase.from(table).insert([payload]);

    if (!error) {
      alert("성공적으로 등록되었습니다.");
      // 초기화
      if (isWord) setWordData({ title: "", content: "", date: format(new Date(), "yyyy-MM-dd"), imageUrl: "" });
      else setEventData({ title: "", description: "", date: format(new Date(), "yyyy-MM-dd"), location: "", imageUrl: "" });
    } else {
      alert("등록 실패: " + error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100/50 pb-20">
      {/* 헤더 영역 */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Admin Console</span>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {format(new Date(), "yyyy년 MM월 dd일")}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          
          {/* 상단 탭 네비게이션 */}
          <TabsList className="bg-white p-1 h-12 border shadow-sm rounded-lg grid grid-cols-3 w-full max-w-xl mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-black">
              <LayoutDashboard className="w-4 h-4" /> 오버뷰
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-black">
              <Users className="w-4 h-4" /> 유저 관리
            </TabsTrigger>
            <TabsTrigger value="contents" className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-black">
              <BookOpen className="w-4 h-4" /> 말씀/이벤트
            </TabsTrigger>
          </TabsList>

          {/* 1. 오버뷰 탭 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard title="전체 교인(유저)" count={stats.userCount} icon={<Users className="w-6 h-6 text-blue-600" />} desc="현재 등록된 활성 계정" />
              <StatsCard title="등록된 말씀 카드" count={stats.wordCount} icon={<BookOpen className="w-6 h-6 text-purple-600" />} desc="누적 말씀 카드 수" />
              <StatsCard title="예정된 이벤트" count={stats.eventCount} icon={<Calendar className="w-6 h-6 text-orange-600" />} desc="진행 중 또는 예정된 행사" />
            </div>
            
            {/* 최근 가입 유저 요약 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>최근 가입 유저</CardTitle>
                  <CardDescription>가장 최근에 가입한 성도 명단입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usersData.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                            {u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.nickname || "이름 없음"}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{format(new Date(u.created_at), "MM-dd")}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* 바로가기 */}
              <Card>
                 <CardHeader><CardTitle>빠른 작업</CardTitle></CardHeader>
                 <CardContent className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setActiveTab("contents")}>
                        <BookOpen className="w-6 h-6 mb-1"/>
                        말씀 카드 쓰기
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setActiveTab("contents")}>
                        <Calendar className="w-6 h-6 mb-1"/>
                        이벤트 등록
                    </Button>
                 </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 2. 유저 관리 탭 */}
          <TabsContent value="users">
            <AdminUsersClient initialUsers={usersData} />
          </TabsContent>

           {/* 3. 콘텐츠 관리 (말씀/이벤트) */}
          <TabsContent value="contents">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* 사이드 설명 */}
              <div className="lg:col-span-3 space-y-4">
                 <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">말씀 카드 작성</CardTitle>
                        <CardDescription>매일의 묵상을 업로드합니다.</CardDescription>
                    </CardHeader>
                 </Card>
                 <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">이벤트 등록</CardTitle>
                        <CardDescription>교회 행사를 공지합니다.</CardDescription>
                    </CardHeader>
                 </Card>
              </div>

              {/* 메인 에디터 영역 */}
              <div className="lg:col-span-9 space-y-10">
                
                {/* 섹션 1: 말씀 카드 */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6"/> 오늘의 말씀</h2>
                    <Button onClick={() => handleCreate('word')} disabled={isUploading} className="bg-blue-600 hover:bg-blue-700">
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
                        말씀 발행
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* 에디터 */}
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                           <Label>배경 이미지</Label>
                           <div className="flex items-center gap-2">
                             <Input type="file" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'word')} />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label>성경 구절 (제목)</Label>
                           <Input placeholder="예: 시편 23:1" value={wordData.title} onChange={e => setWordData({...wordData, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <Label>날짜</Label>
                           <Input type="date" value={wordData.date} onChange={e => setWordData({...wordData, date: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <Label>본문 내용</Label>
                           <Textarea className="min-h-[150px]" placeholder="말씀 본문을 입력하세요..." value={wordData.content} onChange={e => setWordData({...wordData, content: e.target.value})} />
                        </div>
                      </CardContent>
                    </Card>

                    {/* 미리보기 */}
                    <div className="flex justify-center xl:justify-start">
                        <div className="relative w-[320px] h-[480px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center text-white">
                             {wordData.imageUrl ? (
                                <img src={wordData.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="preview" />
                             ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                             )}
                             <div className="relative z-10 p-6 text-center">
                                <h3 className="text-2xl font-bold mb-4 drop-shadow-md">{wordData.title || "구절 입력"}</h3>
                                <p className="text-sm opacity-90 leading-relaxed whitespace-pre-wrap">{wordData.content || "본문 내용이 여기에 표시됩니다."}</p>
                             </div>
                        </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* 섹션 2: 이벤트 */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><Calendar className="w-6 h-6"/> 새 이벤트</h2>
                    <Button onClick={() => handleCreate('event')} disabled={isUploading} variant="default">
                        <Save className="w-4 h-4 mr-2"/> 이벤트 등록
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <Label>이벤트 포스터</Label>
                             <div className="border-2 border-dashed rounded-lg h-40 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors relative">
                                {eventData.imageUrl ? (
                                    <img src={eventData.imageUrl} className="absolute inset-0 w-full h-full object-cover rounded-lg" alt="event poster" />
                                ) : (
                                    <>
                                        <ImageIcon className="w-8 h-8 mb-2"/>
                                        <span className="text-xs">클릭하여 이미지 업로드</span>
                                    </>
                                )}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'event')} />
                             </div>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <Label>행사명</Label>
                             <Input value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} placeholder="예: 여름 성경 학교" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-2">
                                <Label>일시</Label>
                                <Input type="date" value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} />
                             </div>
                             <div className="space-y-2">
                                <Label>장소</Label>
                                <Input value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} placeholder="본당" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <Label>상세 설명</Label>
                             <Textarea value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} placeholder="행사 상세 내용..." />
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                </section>

              </div>
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}

// 통계 카드 컴포넌트
function StatsCard({ title, count, icon, desc }: { title: string, count: number, icon: React.ReactNode, desc: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}
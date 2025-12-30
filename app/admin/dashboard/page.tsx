"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  LayoutDashboard, Users, Calendar, 
  Image as ImageIcon, Loader2, 
  Save, Activity, BookOpen, Trash2, RefreshCw, Smartphone, Edit2, X
} from "lucide-react";
import { format } from "date-fns";
import { ko, enUS, ru } from "date-fns/locale"; 
import { useLanguage } from "@/contexts/language-context"; 
import { useAuth } from "@/contexts/auth-context";

import AdminUsersClient from "@/components/admin-users-client";

export default function AdminDashboard() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { t, language } = useLanguage(); 
  const { user, userProfile } = useAuth(); 

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    userCount: 0,
    eventCount: 0,
    wordCount: 0,
  });
  
  const [usersData, setUsersData] = useState<any[]>([]);
  const [recentWords, setRecentWords] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]); // 이벤트 목록

  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 말씀 카드 데이터
  const [wordData, setWordData] = useState({ title: "", content: "", date: format(new Date(), "yyyy-MM-dd"), imageUrl: "" });
  
  // 이벤트 데이터 & 수정 상태
  const [eventData, setEventData] = useState({ 
    id: "", // 수정 시 필요
    title: "", 
    description: "", 
    startDate: format(new Date(), "yyyy-MM-dd"), 
    endDate: "", 
    location: "", 
    imageUrl: "" 
  });
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  const getDateLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'ru': return ru;
      default: return ko;
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // 통계 데이터
    const { data: users, count: userCount } = await supabase.from("users").select("*", { count: 'exact' }).order("created_at", { ascending: false });
    const { count: eventCount } = await supabase.from("events").select("*", { count: 'exact', head: true });
    const { count: wordCount } = await supabase.from("word_posts").select("*", { count: 'exact', head: true });

    // 말씀 목록 (최근 5개)
    const { data: words } = await supabase.from("word_posts").select("*").order("word_date", { ascending: false }).limit(5);

    // [추가] 이벤트 전체 목록
    const { data: events } = await supabase.from("events").select("*").order("start_date", { ascending: false });

    setUsersData(users || []);
    setRecentWords(words || []);
    setEventsList(events || []);
    
    setStats({
      userCount: userCount || 0,
      eventCount: eventCount || 0,
      wordCount: wordCount || 0,
    });

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleImageUpload = async (file: File, target: 'word' | 'event') => {
    if (!file) return;
    setIsImageUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${target}_${Date.now()}.${fileExt}`;
      const bucket = target === 'word' ? 'word-backgrounds' : 'event-banners'; 

      const { error: uploadError } = await supabase.storage
        .from(bucket) 
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      if (target === 'word') setWordData({ ...wordData, imageUrl: publicUrl });
      else setEventData({ ...eventData, imageUrl: publicUrl });

    } catch (error: any) {
      alert(t('admin.alert.upload_error') + ": " + error.message);
    } finally {
      setIsImageUploading(false);
    }
  };

  // 말씀 카드 생성
  const handleCreateWord = async () => {
    if (!user) return alert(t('common.login_required')); 
    setIsSubmitting(true);

    try {
        const payload = {
          title: wordData.title,
          content: wordData.content,
          word_date: wordData.date,
          image_url: wordData.imageUrl,
          author_id: user.id,
          author_nickname: userProfile?.nickname || user.email?.split('@')[0] || "Admin"
        };

        const { error } = await supabase.from("word_posts").insert([payload]);

        if (error) {
          if (error.code === '23505') alert(t('admin.alert.duplicate_date'));
          else alert(t('admin.alert.error') + ": " + error.message);
        } else {
          alert(t('admin.alert.success'));
          setWordData({ title: "", content: "", date: format(new Date(), "yyyy-MM-dd"), imageUrl: "" });
          fetchData(); 
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  // 이벤트 생성 및 수정
  const handleSaveEvent = async () => {
    if (!user) return alert(t('common.login_required')); 
    setIsSubmitting(true);

    try {
        const payload = {
          title: eventData.title,
          description: eventData.description,
          start_date: eventData.startDate,
          end_date: eventData.endDate ? eventData.endDate : eventData.startDate,
          location: eventData.location,
          image_url: eventData.imageUrl
        };

        let error;

        if (isEditingEvent && eventData.id) {
            // 수정 (Update)
            const { error: updateError } = await supabase
                .from("events")
                .update(payload)
                .eq("id", eventData.id);
            error = updateError;
        } else {
            // 생성 (Insert)
            const { error: insertError } = await supabase
                .from("events")
                .insert([payload]);
            error = insertError;
        }

        if (error) {
          alert(t('admin.alert.error') + ": " + error.message);
        } else {
          alert(isEditingEvent ? "이벤트가 수정되었습니다." : t('admin.alert.success'));
          resetEventForm();
          fetchData(); 
        }
    } catch (err) {
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  const resetEventForm = () => {
    setEventData({ 
        id: "",
        title: "", 
        description: "", 
        startDate: format(new Date(), "yyyy-MM-dd"), 
        endDate: "", 
        location: "", 
        imageUrl: "" 
    });
    setIsEditingEvent(false);
  };

  const handleEditEventClick = (event: any) => {
      setEventData({
          id: event.id,
          title: event.title,
          description: event.description || "",
          startDate: event.start_date,
          endDate: event.end_date || "",
          location: event.location || "",
          imageUrl: event.image_url || ""
      });
      setIsEditingEvent(true);
      // 폼이 있는 상단으로 스크롤 이동
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteWord = async (id: string) => {
    if (!confirm(t('common.confirm_delete'))) return;
    const { error } = await supabase.from("word_posts").delete().eq("id", id);
    if (!error) {
      alert(t('common.delete') + "되었습니다.");
      fetchData();
    } else {
      alert(t('admin.alert.error') + ": " + error.message);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm(t('common.confirm_delete'))) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) {
      alert(t('common.delete') + "되었습니다.");
      fetchData();
      if (isEditingEvent && eventData.id === id) resetEventForm();
    } else {
      alert(t('admin.alert.error') + ": " + error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100/50 pb-20">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">{t('admin.header.title')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={fetchData} className="text-gray-500">
                <RefreshCw className="w-4 h-4 mr-2" /> {t('admin.common.refresh')}
            </Button>
            <div className="text-sm text-gray-500 font-medium">
                {format(new Date(), "PP", { locale: getDateLocale() })}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          
          {/* [수정] 탭 메뉴 4개로 분리 */}
          <TabsList className="bg-white p-1 h-12 border shadow-sm rounded-lg grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-black">
              <LayoutDashboard className="w-4 h-4" /> {t('admin.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-black">
              <Users className="w-4 h-4" /> {t('admin.tabs.users')}
            </TabsTrigger>
            <TabsTrigger value="words" className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-black">
              <BookOpen className="w-4 h-4" /> {t('admin.tabs.words')}
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-black">
              <Calendar className="w-4 h-4" /> {t('admin.tabs.events')}
            </TabsTrigger>
          </TabsList>

          {/* 1. 오버뷰 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard title={t('admin.stats.users.title')} count={stats.userCount} icon={<Users className="w-6 h-6 text-blue-600" />} desc={t('admin.stats.users.desc')} />
              <StatsCard title={t('admin.stats.words.title')} count={stats.wordCount} icon={<BookOpen className="w-6 h-6 text-purple-600" />} desc={t('admin.stats.words.desc')} />
              <StatsCard title={t('admin.stats.events.title')} count={stats.eventCount} icon={<Calendar className="w-6 h-6 text-orange-600" />} desc={t('admin.stats.events.desc')} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>{t('admin.recent_users.title')}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usersData.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                            {u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.nickname || t('admin.recent_users.no_name')}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{format(new Date(u.created_at), "MM-dd")}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                 <CardHeader><CardTitle>{t('admin.quick_actions.title')}</CardTitle></CardHeader>
                 <CardContent className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setActiveTab("words")}>
                        <BookOpen className="w-6 h-6 mb-1"/>
                        {t('admin.quick_actions.write_word')}
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setActiveTab("events")}>
                        <Calendar className="w-6 h-6 mb-1"/>
                        {t('admin.quick_actions.add_event')}
                    </Button>
                 </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 2. 유저 관리 */}
          <TabsContent value="users">
            <AdminUsersClient initialUsers={usersData} />
          </TabsContent>

          {/* 3. 말씀 카드 관리 (분리됨) */}
          <TabsContent value="words">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6"/> {t('admin.contents.word.section_title')}</h2>
                    <Button 
                        onClick={handleCreateWord} 
                        disabled={isImageUploading || isSubmitting} 
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
                        {t('admin.contents.word.submit_button')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    {/* 왼쪽: 에디터 */}
                    <div className="xl:col-span-7">
                        <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                            <Label>{t('admin.contents.word.label.image')}</Label>
                            <div className="flex items-center gap-2">
                                <div className="relative w-full">
                                    <Input type="file" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'word')} disabled={isImageUploading} />
                                    {isImageUploading && <span className="absolute right-3 top-2 text-xs text-blue-600 flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> {t('admin.common.uploading')}</span>}
                                </div>
                            </div>
                            </div>
                            <div className="space-y-2">
                            <Label>{t('admin.contents.word.label.title')}</Label>
                            <Input placeholder={t('admin.contents.word.placeholder.title')} value={wordData.title} onChange={e => setWordData({...wordData, title: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                            <Label>{t('admin.contents.word.label.date')}</Label>
                            <Input type="date" value={wordData.date} onChange={e => setWordData({...wordData, date: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                            <Label>{t('admin.contents.word.label.content')}</Label>
                            <Textarea className="min-h-[150px]" placeholder={t('admin.contents.word.placeholder.content')} value={wordData.content} onChange={e => setWordData({...wordData, content: e.target.value})} />
                            </div>
                        </CardContent>
                        </Card>
                    </div>

                    {/* 오른쪽: 미리보기 및 최근 목록 */}
                    <div className="xl:col-span-5 flex flex-col gap-6">
                        <div className="flex flex-col items-center">
                             <div className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-1">
                                <Smartphone className="w-4 h-4" /> {t('admin.contents.word.preview.mobile_label')}
                             </div>
                             <div className="aspect-[9/16] w-full max-w-[280px] bg-gray-900 rounded-[24px] overflow-hidden shadow-2xl relative border-4 border-gray-800">
                                 {wordData.imageUrl ? (
                                    <img src={wordData.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-70" alt="preview" />
                                 ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                         {isImageUploading ? <Loader2 className="w-8 h-8 animate-spin text-gray-400" /> : <span className="text-gray-500 text-xs">{t('admin.contents.word.preview.no_image')}</span>}
                                    </div>
                                 )}
                                 <div className="absolute inset-0 z-10 p-6 flex flex-col justify-center text-center text-white">
                                    <h3 className="text-xl font-bold mb-4 drop-shadow-md leading-tight">{wordData.title || t('admin.contents.word.preview.title_placeholder')}</h3>
                                    <p className="text-sm opacity-90 leading-relaxed whitespace-pre-wrap drop-shadow-sm line-clamp-[10]">{wordData.content || t('admin.contents.word.preview.content_placeholder')}</p>
                                    <div className="mt-6 pt-4 border-t border-white/20 inline-block">
                                        <p className="text-xs opacity-70">{wordData.date}</p>
                                    </div>
                                 </div>
                             </div>
                        </div>

                        <Card className="flex-1">
                            <CardHeader className="pb-2 pt-4 px-4">
                                <CardTitle className="text-sm text-gray-500">{t('admin.contents.word.recent_list_title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                {recentWords.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center py-4">{t('admin.contents.word.recent_list_empty')}</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {recentWords.map(post => (
                                            <li key={post.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <div className="w-8 h-8 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                                                        {post.image_url && <img src={post.image_url} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold truncate">{post.title}</p>
                                                        <p className="text-[10px] text-gray-500">{post.word_date}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={() => handleDeleteWord(post.id)}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
          </TabsContent>

          {/* 4. 이벤트 관리 (분리 및 기능 추가) */}
          <TabsContent value="events">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* 왼쪽: 이벤트 등록/수정 폼 */}
              <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="w-6 h-6"/> {isEditingEvent ? "이벤트 수정" : t('admin.contents.event.section_title')}
                    </h2>
                    {isEditingEvent && (
                        <Button variant="outline" size="sm" onClick={resetEventForm} className="text-gray-500">
                            <X className="w-4 h-4 mr-1"/> 취소
                        </Button>
                    )}
                  </div>
                  
                  <Card className={isEditingEvent ? "border-orange-400 shadow-md" : ""}>
                    <CardContent className="p-6 space-y-4">
                       <div className="space-y-2">
                          <Label>{t('admin.contents.event.label.poster')}</Label>
                          <div className="border-2 border-dashed rounded-lg h-40 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors relative">
                             {eventData.imageUrl ? (
                                 <img src={eventData.imageUrl} className="absolute inset-0 w-full h-full object-cover rounded-lg" alt="event poster" />
                             ) : (
                                 <>
                                     {isImageUploading ? <Loader2 className="w-8 h-8 animate-spin mb-2"/> : <ImageIcon className="w-8 h-8 mb-2"/>}
                                     <span className="text-xs">{isImageUploading ? t('admin.common.uploading') : t('admin.contents.event.upload_hint')}</span>
                                 </>
                             )}
                             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'event')} disabled={isImageUploading} />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <Label>{t('admin.contents.event.label.title')}</Label>
                          <Input value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} placeholder={t('admin.contents.event.placeholder.title')} />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                             <Label>{t('admin.contents.event.label.start_date')}</Label>
                             <Input type="date" value={eventData.startDate} onChange={e => setEventData({...eventData, startDate: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                             <Label>{t('admin.contents.event.label.end_date')}</Label>
                             <Input type="date" value={eventData.endDate} onChange={e => setEventData({...eventData, endDate: e.target.value})} />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <Label>{t('admin.contents.event.label.location')}</Label>
                          <Input value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} placeholder={t('admin.contents.event.placeholder.location')} />
                       </div>
                       <div className="space-y-2">
                          <Label>{t('admin.contents.event.label.description')}</Label>
                          <Textarea value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} placeholder={t('admin.contents.event.placeholder.description')} />
                       </div>

                       <Button onClick={handleSaveEvent} disabled={isImageUploading || isSubmitting} className="w-full" variant={isEditingEvent ? "default" : "secondary"}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : (isEditingEvent ? <Edit2 className="w-4 h-4 mr-2"/> : <Save className="w-4 h-4 mr-2"/>)}
                            {isEditingEvent ? "수정 완료 (Update)" : t('admin.contents.event.submit_button')}
                       </Button>
                    </CardContent>
                  </Card>
              </div>

              {/* 오른쪽: 이벤트 목록 (삭제/수정용) */}
              <div className="lg:col-span-7 space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-700">
                      등록된 이벤트 목록 ({eventsList.length})
                  </h2>
                  <div className="grid gap-4">
                      {eventsList.length === 0 ? (
                          <div className="text-center py-10 bg-white rounded-lg border border-dashed text-gray-400">등록된 이벤트가 없습니다.</div>
                      ) : (
                          eventsList.map(event => (
                              <Card key={event.id} className={`overflow-hidden transition-all ${isEditingEvent && eventData.id === event.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                                  <div className="flex">
                                      <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                                          {event.image_url ? (
                                              <img src={event.image_url} className="w-full h-full object-cover" alt="poster"/>
                                          ) : (
                                              <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8"/></div>
                                          )}
                                      </div>
                                      <div className="p-4 flex-1 flex flex-col justify-between">
                                          <div>
                                              <h3 className="font-bold text-lg">{event.title}</h3>
                                              <div className="text-xs text-gray-500 mt-1 flex gap-2">
                                                  <span className="bg-gray-100 px-2 py-0.5 rounded">{event.start_date} {event.end_date && `~ ${event.end_date}`}</span>
                                                  <span>{event.location}</span>
                                              </div>
                                              <p className="text-sm text-gray-600 mt-2 line-clamp-1">{event.description}</p>
                                          </div>
                                          <div className="flex justify-end gap-2 mt-2">
                                              <Button variant="outline" size="sm" onClick={() => handleEditEventClick(event)} className="h-8">
                                                  <Edit2 className="w-3 h-3 mr-1"/> {t('common.edit')}
                                              </Button>
                                              <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)} className="h-8">
                                                  <Trash2 className="w-3 h-3 mr-1"/> {t('common.delete')}
                                              </Button>
                                          </div>
                                      </div>
                                  </div>
                              </Card>
                          ))
                      )}
                  </div>
              </div>

            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}

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
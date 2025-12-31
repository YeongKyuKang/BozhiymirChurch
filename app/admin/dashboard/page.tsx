"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LayoutDashboard, Users, Calendar, 
  Image as ImageIcon, Loader2, 
  Save, Activity, BookOpen, Trash2, Smartphone, Edit2, PlusCircle, Search, RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { ko, enUS, ru } from "date-fns/locale"; 
import { useLanguage } from "@/contexts/language-context"; 
import { useAuth } from "@/contexts/auth-context";

import AdminUsersClient from "@/components/admin-users-client";

// 성경 책 이름 매핑 정보 (JSON 파일의 2글자 약어 'gn', 'ex' 등과 매칭)
const BIBLE_BOOK_NAMES: Record<string, { ko: string; ru: string; en: string }> = {
  // 구약 (Old Testament)
  gn: { ko: "창세기", ru: "Бытие", en: "Genesis" },
  ex: { ko: "출애굽기", ru: "Исход", en: "Exodus" },
  lv: { ko: "레위기", ru: "Левит", en: "Leviticus" },
  nm: { ko: "민수기", ru: "Числа", en: "Numbers" },
  dt: { ko: "신명기", ru: "Второзаконие", en: "Deuteronomy" },
  js: { ko: "여호수아", ru: "Иисус Навин", en: "Joshua" },
  jud: { ko: "사사기", ru: "Судьи", en: "Judges" },
  rt: { ko: "룻기", ru: "Руфь", en: "Ruth" },
  "1sm": { ko: "사무엘상", ru: "1-я Царств", en: "1 Samuel" },
  "2sm": { ko: "사무엘하", ru: "2-я Царств", en: "2 Samuel" },
  "1kg": { ko: "열왕기상", ru: "3-я Царств", en: "1 Kings" },
  "2kg": { ko: "열왕기하", ru: "4-я Царств", en: "2 Kings" },
  "1ch": { ko: "역대상", ru: "1-я Паралипоменон", en: "1 Chronicles" },
  "2ch": { ko: "역대하", ru: "2-я Паралипоменон", en: "2 Chronicles" },
  ez: { ko: "에스라", ru: "Ездра", en: "Ezra" },
  ne: { ko: "느헤미야", ru: "Неемия", en: "Nehemiah" },
  es: { ko: "에스더", ru: "Есфирь", en: "Esther" },
  jb: { ko: "욥기", ru: "Иов", en: "Job" },
  ps: { ko: "시편", ru: "Псалтирь", en: "Psalms" },
  prv: { ko: "잠언", ru: "Притчи", en: "Proverbs" },
  ec: { ko: "전도서", ru: "Екклесиаст", en: "Ecclesiastes" },
  sn: { ko: "아가", ru: "Песнь Песней", en: "Song of Solomon" },
  is: { ko: "이사야", ru: "Исаия", en: "Isaiah" },
  jr: { ko: "예레미야", ru: "Иеремия", en: "Jeremiah" },
  lm: { ko: "예레미야애가", ru: "Плач Иеремии", en: "Lamentations" },
  ek: { ko: "에스겔", ru: "Иезекииль", en: "Ezekiel" },
  dn: { ko: "다니엘", ru: "Даниил", en: "Daniel" },
  ho: { ko: "호세아", ru: "Осия", en: "Hosea" },
  jl: { ko: "요엘", ru: "Иоиль", en: "Joel" },
  am: { ko: "아모스", ru: "Амос", en: "Amos" },
  ob: { ko: "오바댜", ru: "Авдий", en: "Obadiah" },
  jn: { ko: "요나", ru: "Иона", en: "Jonah" },
  mi: { ko: "미가", ru: "Михей", en: "Micah" },
  na: { ko: "나훔", ru: "Наум", en: "Nahum" },
  ha: { ko: "하박국", ru: "Аввакум", en: "Habakkuk" },
  zp: { ko: "스바냐", ru: "Софония", en: "Zephaniah" },
  hg: { ko: "학개", ru: "Аггей", en: "Haggai" },
  zc: { ko: "스가랴", ru: "Захария", en: "Zechariah" },
  ml: { ko: "말라기", ru: "Малахия", en: "Malachi" },

  // 신약 (New Testament)
  mt: { ko: "마태복음", ru: "От Матфея", en: "Matthew" },
  mk: { ko: "마가복음", ru: "От Марка", en: "Mark" },
  lk: { ko: "누가복음", ru: "От Луки", en: "Luke" },
  jo: { ko: "요한복음", ru: "От Иоанна", en: "John" },
  act: { ko: "사도행전", ru: "Деяния", en: "Acts" },
  rm: { ko: "로마서", ru: "Римлянам", en: "Romans" },
  "1co": { ko: "고린도전서", ru: "1-е Коринфянам", en: "1 Corinthians" },
  "2co": { ko: "고린도후서", ru: "2-е Коринфянам", en: "2 Corinthians" },
  gl: { ko: "갈라디아서", ru: "Галатам", en: "Galatians" },
  eph: { ko: "에베소서", ru: "Ефесянам", en: "Ephesians" },
  ph: { ko: "빌립보서", ru: "Филиппийцам", en: "Philippians" },
  col: { ko: "골로새서", ru: "Колоссянам", en: "Colossians" },
  "1ts": { ko: "데살로니가전서", ru: "1-е Фессалоникийцам", en: "1 Thessalonians" },
  "2ts": { ko: "데살로니가후서", ru: "2-е Фессалоникийцам", en: "2 Thessalonians" },
  "1tm": { ko: "디모데전서", ru: "1-е Тимофею", en: "1 Timothy" },
  "2tm": { ko: "디모데후서", ru: "2-е Тимофею", en: "2 Timothy" },
  tt: { ko: "디도서", ru: "Титу", en: "Titus" },
  phm: { ko: "빌레몬서", ru: "Филимону", en: "Philemon" },
  heb: { ko: "히브리서", ru: "Евреям", en: "Hebrews" },
  jm: { ko: "야고보서", ru: "Иакова", en: "James" },
  "1pe": { ko: "베드로전서", ru: "1-е Петра", en: "1 Peter" },
  "2pe": { ko: "베드로후서", ru: "2-е Петра", en: "2 Peter" },
  "1jo": { ko: "요한1서", ru: "1-е Иоанна", en: "1 John" },
  "2jo": { ko: "요한2서", ru: "2-е Иоанна", en: "2 John" },
  "3jo": { ko: "요한3서", ru: "3-е Иоанна", en: "3 John" },
  jd: { ko: "유다서", ru: "Иуды", en: "Jude" },
  re: { ko: "요한계시록", ru: "Откровение", en: "Revelation" },
};

export default function AdminDashboard() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { t, language } = useLanguage(); 
  const { user } = useAuth(); 

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    userCount: 0,
    eventCount: 0,
    wordCount: 0,
  });
  
  const [usersData, setUsersData] = useState<any[]>([]);
  const [recentWords, setRecentWords] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]); 

  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 성경 데이터 상태
  const [bibleData, setBibleData] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("1");
  const [selectedVerse, setSelectedVerse] = useState("1");

  // 말씀 카드 생성 데이터
  const [wordData, setWordData] = useState({ title: "", content: "", date: format(new Date(), "yyyy-MM-dd"), imageUrl: "" });
  const [isEditWordOpen, setIsEditWordOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<any>(null);

  // 이벤트 데이터
  const [eventData, setEventData] = useState({ 
    title: "", description: "", startDate: format(new Date(), "yyyy-MM-dd"), endDate: "", location: "", imageUrl: "" 
  });
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const getDateLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'ru': return ru;
      default: return ko;
    }
  };

  // [수정] 성경 데이터 로드 및 이름 덮어쓰기
  useEffect(() => {
    const loadBible = async () => {
      try {
        const res = await fetch(`/bible/${language}.json`);
        const data = await res.json();
        
        // JSON 파일의 영어 이름을 현재 언어 설정에 맞는 이름으로 교체
        const localizedData = data.map((book: any) => {
          const abbrev = book.abbrev.toLowerCase();
          const localizedName = BIBLE_BOOK_NAMES[abbrev]?.[language as 'ko' | 'en' | 'ru'];
          
          return {
            ...book,
            name: localizedName || book.name
          };
        });

        setBibleData(localizedData);
      } catch (e) {
        console.error("Bible data load failed", e);
      }
    };
    loadBible();
  }, [language]);

  const fetchData = useCallback(async () => {
    const { data: users, count: userCount } = await supabase.from("users").select("*", { count: 'exact' }).order("created_at", { ascending: false });
    const { count: eventCount } = await supabase.from("events").select("*", { count: 'exact', head: true });
    const { count: wordCount } = await supabase.from("word_posts").select("*", { count: 'exact', head: true });

    const { data: words } = await supabase.from("word_posts").select("*").order("word_date", { ascending: false }).limit(5);
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

  const handleImageUpload = async (file: File, target: string) => {
    if (!file) return;
    setIsImageUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const isEvent = target.includes('event');
      const bucket = isEvent ? 'event-banners' : 'word-backgrounds';
      const fileName = `${isEvent ? 'event' : 'word'}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket) 
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      if (target === 'word') setWordData({ ...wordData, imageUrl: publicUrl });
      else if (target === 'edit-word' && editingWord) setEditingWord({ ...editingWord, imageUrl: publicUrl });
      else if (target === 'event') setEventData({ ...eventData, imageUrl: publicUrl });
      else if (target === 'edit-event' && editingEvent) setEditingEvent({ ...editingEvent, imageUrl: publicUrl });

    } catch (error: any) {
      alert(t('admin.alert.upload_error') + ": " + error.message);
    } finally {
      setIsImageUploading(false);
    }
  };

  // 성경 구절 적용 함수
  const applyBibleVerse = (isEdit = false) => {
    const book = bibleData.find(b => b.abbrev === selectedBook);
    if (!book) return;
    try {
      const verseText = book.chapters[parseInt(selectedChapter) - 1][parseInt(selectedVerse) - 1];
      const titleText = `${book.name} ${selectedChapter}:${selectedVerse}`;
      if (isEdit) {
        setEditingWord({ 
          ...editingWord, 
          title: titleText, 
          content: verseText, 
          book_id: selectedBook, 
          chapter_num: parseInt(selectedChapter), 
          verse_num: parseInt(selectedVerse) 
        });
      } else {
        setWordData({ ...wordData, title: titleText, content: verseText });
      }
    } catch (e) {
      alert(t('admin.alert.invalid_bible_ref') || "Invalid chapter or verse");
    }
  };

  const handleCreateWord = async () => {
    if (!user) return alert(t('common.login_required')); 
    setIsSubmitting(true);

    try {
        const { error } = await supabase.from("word_posts").insert([{
          title: wordData.title,
          content: wordData.content,
          word_date: wordData.date,
          image_url: wordData.imageUrl,
          author_id: user.id,
          author_nickname: user.nickname || user.email?.split('@')[0] || "Admin",
          // [중요] 성경 약어, 장, 절 정보를 저장
          book_id: selectedBook,
          chapter_num: parseInt(selectedChapter),
          verse_num: parseInt(selectedVerse)
        }]);

        if (error) throw error;
        alert(t('admin.alert.success'));
        setWordData({ title: "", content: "", date: format(new Date(), "yyyy-MM-dd"), imageUrl: "" });
        fetchData(); 
    } catch (err: any) {
        alert(t('admin.alert.error') + ": " + err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const openEditWordModal = (post: any) => {
    setEditingWord({
      id: post.id,
      title: post.title,
      content: post.content,
      date: post.word_date,
      imageUrl: post.image_url || "",
      book_id: post.book_id || "",
      chapter_num: post.chapter_num || 1,
      verse_num: post.verse_num || 1
    });
    setIsEditWordOpen(true);
  };

  const handleUpdateWord = async () => {
    if (!user || !editingWord) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("word_posts").update({
          title: editingWord.title,
          content: editingWord.content,
          word_date: editingWord.date,
          image_url: editingWord.imageUrl,
          // [중요] 업데이트 시에도 저장
          book_id: editingWord.book_id,
          chapter_num: editingWord.chapter_num,
          verse_num: editingWord.verse_num
        }).eq("id", editingWord.id);

      if (error) throw error;
      alert(t('admin.alert.success_update'));
      setIsEditWordOpen(false);
      fetchData();
    } catch (error: any) {
      alert(t('admin.alert.error') + ": " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWord = async (id: string) => {
    if (!confirm(t('common.confirm_delete'))) return;
    const { error } = await supabase.from("word_posts").delete().eq("id", id);
    if (!error) {
      alert(t('common.delete') + " " + (t('common.completed') || "completed."));
      fetchData();
    }
  };

  const handleCreateEvent = async () => {
    if (!user) return alert(t('common.login_required')); 
    setIsSubmitting(true);
    try {
        const { error } = await supabase.from("events").insert([{
          title: eventData.title,
          description: eventData.description,
          start_date: eventData.startDate,
          end_date: eventData.endDate ? eventData.endDate : eventData.startDate,
          location: eventData.location,
          image_url: eventData.imageUrl
        }]);

        if (error) throw error;
        alert(t('admin.alert.success'));
        setEventData({ title: "", description: "", startDate: format(new Date(), "yyyy-MM-dd"), endDate: "", location: "", imageUrl: "" });
        fetchData(); 
    } catch (err: any) {
        alert(t('admin.alert.error') + ": " + err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const openEditEventModal = (event: any) => {
    setEditingEvent({
        id: event.id,
        title: event.title,
        description: event.description || "",
        startDate: event.start_date,
        endDate: event.end_date || "",
        location: event.location || "",
        imageUrl: event.image_url || ""
    });
    setIsEditEventOpen(true);
  };

  const handleUpdateEvent = async () => {
    if (!user || !editingEvent) return;
    setIsSubmitting(true);
    try {
        const { error } = await supabase.from("events").update({
          title: editingEvent.title,
          description: editingEvent.description,
          start_date: editingEvent.startDate,
          end_date: editingEvent.endDate ? editingEvent.endDate : editingEvent.startDate,
          location: editingEvent.location,
          image_url: editingEvent.imageUrl
        }).eq("id", editingEvent.id);

        if (error) throw error;
        alert(t('admin.alert.success_update'));
        setIsEditEventOpen(false);
        fetchData();
    } catch (error: any) {
        alert(t('admin.alert.error') + ": " + error.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm(t('common.confirm_delete'))) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) {
      alert(t('common.delete') + " " + (t('common.completed') || "completed."));
      fetchData();
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100/50 pb-20 pt-24">
      
      <header className="bg-white border-b sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">{t('admin.header.title')}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 font-medium">
                {format(new Date(), "PP", { locale: getDateLocale() })}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          
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

          <TabsContent value="users">
            <AdminUsersClient initialUsers={usersData} />
          </TabsContent>

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
                    <div className="xl:col-span-7">
                        <Card>
                        <CardContent className="p-6 space-y-4">
                            {/* 성경 선택 UI */}
                            <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50 rounded-xl border border-dashed">
                              <div className="space-y-1">
                                <Label className="text-xs">Book</Label>
                                <Select value={selectedBook} onValueChange={setSelectedBook}>
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder={t('admin.bible.select_book') || "Select Book"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {bibleData.map(b => <SelectItem key={b.abbrev} value={b.abbrev}>{b.name}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Chapter</Label>
                                <Input value={selectedChapter} onChange={e => setSelectedChapter(e.target.value)} className="h-9" type="number" placeholder={t('admin.bible.chapter') || "Ch"} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Verse</Label>
                                <div className="flex gap-1">
                                  <Input value={selectedVerse} onChange={e => setSelectedVerse(e.target.value)} className="h-9" type="number" placeholder={t('admin.bible.verse') || "Vs"} />
                                  <Button size="icon" variant="secondary" className="h-9 w-9 shrink-0" onClick={() => applyBibleVerse(false)}><Search className="h-4 w-4"/></Button>
                                </div>
                              </div>
                            </div>

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
                                                <div className="flex gap-1">
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-400 hover:text-blue-600" onClick={() => openEditWordModal(post)}>
                                                      <Edit2 className="w-3 h-3" />
                                                  </Button>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={() => handleDeleteWord(post.id)}>
                                                      <Trash2 className="w-3 h-3" />
                                                  </Button>
                                                </div>
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

          <TabsContent value="events">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="w-6 h-6"/> {t('admin.contents.event.section_title')}
                    </h2>
                  </div>
                  
                  <Card>
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

                       <Button onClick={handleCreateEvent} disabled={isImageUploading || isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <PlusCircle className="w-4 h-4 mr-2"/>}
                            {t('admin.contents.event.submit_button')}
                       </Button>
                    </CardContent>
                  </Card>
              </div>

              <div className="lg:col-span-7 space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-700">
                      {t('admin.tabs.events')} ({eventsList.length})
                  </h2>
                  <div className="grid gap-4">
                      {eventsList.length === 0 ? (
                          <div className="text-center py-10 bg-white rounded-lg border border-dashed text-gray-400">{t('word.list.empty')}</div>
                      ) : (
                          eventsList.map(event => (
                              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                  <div className="flex">
                                      <div className="w-32 h-32 bg-gray-100 flex-shrink-0 relative">
                                          {event.image_url ? (
                                              <img src={event.image_url} className="w-full h-full object-cover" alt="poster"/>
                                          ) : (
                                              <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8"/></div>
                                          )}
                                      </div>
                                      <div className="p-4 flex-1 flex flex-col justify-between">
                                          <div>
                                              <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
                                              <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                                                  <span className="bg-gray-100 px-2 py-0.5 rounded">{event.start_date} {event.end_date && `~ ${event.end_date}`}</span>
                                                  <span>{event.location}</span>
                                              </div>
                                          </div>
                                          <div className="flex justify-end gap-2 mt-2">
                                              <Button variant="outline" size="sm" onClick={() => openEditEventModal(event)} className="h-8">
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

      <Dialog open={isEditWordOpen} onOpenChange={setIsEditWordOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('admin.contents.word.edit_title')}</DialogTitle>
            <DialogDescription>{t('admin.contents.word.edit_desc')}</DialogDescription>
          </DialogHeader>
          
          {editingWord && (
            <div className="grid gap-4 py-4">
              {/* 수정 팝업 내 성경 선택 UI */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg">
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Book" /></SelectTrigger>
                  <SelectContent>
                    {bibleData.map(b => <SelectItem key={b.abbrev} value={b.abbrev}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input value={selectedChapter} onChange={e => setSelectedChapter(e.target.value)} className="h-8 text-xs" placeholder={t('admin.bible.chapter') || "Ch"} />
                <div className="flex gap-1">
                  <Input value={selectedVerse} onChange={e => setSelectedVerse(e.target.value)} className="h-8 text-xs" placeholder={t('admin.bible.verse') || "Vs"} />
                  <Button size="icon" variant="secondary" className="h-8 w-8 shrink-0" onClick={() => applyBibleVerse(true)}><Search className="h-3 w-3"/></Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>{t('admin.contents.word.label.image')}</Label>
                <div className="flex items-center gap-2">
                    <Input type="file" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'edit-word')} disabled={isImageUploading} />
                    {editingWord.imageUrl && <div className="w-10 h-10 rounded overflow-hidden bg-gray-100"><img src={editingWord.imageUrl} className="w-full h-full object-cover"/></div>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>{t('admin.contents.word.label.title')}</Label>
                <Input value={editingWord.title} onChange={(e) => setEditingWord({ ...editingWord, title: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>{t('admin.contents.word.label.date')}</Label>
                <Input type="date" value={editingWord.date} onChange={(e) => setEditingWord({ ...editingWord, date: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>{t('admin.contents.word.label.content')}</Label>
                <Textarea value={editingWord.content} onChange={(e) => setEditingWord({ ...editingWord, content: e.target.value })} className="min-h-[100px]" />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditWordOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleUpdateWord} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
              {t('admin.contents.word.update_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('admin.contents.event.edit_title') || "Edit Event"}</DialogTitle>
            <DialogDescription>{t('admin.contents.event.edit_desc') || "Modify event details."}</DialogDescription>
          </DialogHeader>
          
          {editingEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>{t('admin.contents.event.label.poster')}</Label>
                <div className="flex items-center gap-2">
                    <Input type="file" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'edit-event')} disabled={isImageUploading} />
                    {editingEvent.imageUrl && <div className="w-10 h-10 rounded overflow-hidden bg-gray-100"><img src={editingEvent.imageUrl} className="w-full h-full object-cover"/></div>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>{t('admin.contents.event.label.title')}</Label>
                <Input value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                    <Label>{t('admin.contents.event.label.start_date')}</Label>
                    <Input type="date" value={editingEvent.startDate} onChange={(e) => setEditingEvent({ ...editingEvent, startDate: e.target.value })} />
                </div>
                <div className="grid gap-2">
                    <Label>{t('admin.contents.event.label.end_date')}</Label>
                    <Input type="date" value={editingEvent.endDate} onChange={(e) => setEditingEvent({ ...editingEvent, endDate: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>{t('admin.contents.event.label.location')}</Label>
                <Input value={editingEvent.location} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>{t('admin.contents.event.label.description')}</Label>
                <Textarea value={editingEvent.description} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} className="min-h-[100px]" />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEventOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleUpdateEvent} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
              {t('admin.contents.event.update_button') || "Update Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
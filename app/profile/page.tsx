"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, Mail, Camera, ShieldCheck, LogOut, 
  Loader2, Edit2, Check, X, Key, ChevronRight, Clock, ShieldAlert, Sparkles, AlertCircle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProfilePage() {
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);
  const router = useRouter();

  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // 수정 관련 상태
  const [isEditName, setIsEditName] = useState(false);
  const [isEditPw, setIsEditPw] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  // 1. 데이터 가져오기 로직 (새로고침 대응 강화)
  const fetchData = useCallback(async () => {
    try {
      // getSession 대신 getUser를 사용하여 서버측 세션 유효성을 더 정확히 체크합니다.
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        console.error("세션 없음:", authError);
        router.push("/login");
        return;
      }

      setUser(authUser);

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (profileData) {
        setProfile(profileData);
        setNickname(profileData.nickname || "");
      }
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  // 2. 인증 상태 실시간 감지 (새로고침 시 세션 증발 방지)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/login");
      } else if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        fetchData();
      }
    });

    fetchData(); // 컴포넌트 마운트 시 초기 데이터 로드

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchData, router]);

  // 3. 교인 인증 로직 (무한 루프 방지 및 정확한 에러 핸들링)
  const handleCodeVerify = async () => {
    if (!code.trim()) {
      alert("코드를 입력해주세요.");
      return;
    }

    setUpdating(true);
    try {
      // 코드 존재 여부 확인
      const { data: codeData, error: fetchError } = await supabase
        .from("registration_codes")
        .select("*")
        .eq("code", code.trim().toUpperCase())
        .eq("is_used", false)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!codeData) {
        alert("유효하지 않거나 이미 사용된 코드입니다.");
        setUpdating(false);
        return;
      }

      // 코드 사용 처리 (이때 DB 트리거가 users 테이블의 role을 변경함)
      const { error: updateError } = await supabase
        .from("registration_codes")
        .update({ 
          is_used: true, 
          used_by_user_id: user.id, 
          used_at: new Date().toISOString() 
        })
        .eq("code", code.trim().toUpperCase());

      if (updateError) throw updateError;

      alert("🎉 인증이 완료되었습니다!");
      setShowVerifyInput(false);
      setCode("");
      
      // 즉시 최신 프로필 정보 반영
      await fetchData();
      
    } catch (err: any) {
      console.error("인증 오류:", err.message);
      alert("인증 처리 중 오류가 발생했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  // 4. 로그아웃 로직 (확실한 세션 종료)
  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.refresh(); // 페이지 상태 초기화
      router.push("/login");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // 쿨타임 계산기
  const getDaysRemaining = (lastDate: string | null, cooldownDays: number) => {
    if (!lastDate) return 0;
    const diff = (new Date().getTime() - new Date(lastDate).getTime()) / (1000 * 3600 * 24);
    const remaining = Math.ceil(cooldownDays - diff);
    return remaining > 0 ? remaining : 0;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0057B7]">
      <Loader2 className="w-12 h-12 animate-spin text-[#FFDD00]" />
    </div>
  );

  const nameRemaining = getDaysRemaining(profile?.last_name_change, 30);
  const pwRemaining = getDaysRemaining(profile?.last_pw_change, 30);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#0057B7] via-[#f8faff] to-[#f8faff] pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-xl space-y-6">
          
          {/* 프로필 헤더 */}
          <Card className="rounded-[48px] border-none shadow-2xl bg-white/90 backdrop-blur-md p-10 text-center ring-1 ring-white/20">
            <div className="relative w-36 h-36 mx-auto mb-6">
              <div className="w-full h-full rounded-[56px] bg-gradient-to-tr from-[#FFDD00] to-[#FFE543] p-1 shadow-xl">
                <div className="w-full h-full rounded-[52px] bg-white overflow-hidden flex items-center justify-center">
                  {profile?.profile_picture_url ? (
                    <img src={profile.profile_picture_url} className="w-full h-full object-cover" />
                  ) : (
                    <User size={56} className="text-[#0057B7]/20" />
                  )}
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-black text-[#0057B7] tracking-tighter italic uppercase mb-4">{profile?.nickname || "사용자"}</h2>
            <div className="flex flex-col items-center gap-4">
              <Badge className={`px-6 py-2 rounded-2xl font-black uppercase shadow-md ${profile?.role === 'guest' ? 'bg-slate-100 text-slate-400' : 'bg-[#FFDD00] text-[#0057B7]'}`}>
                {profile?.role === 'guest' ? '🚫 Unverified' : '✨ Verified Member'}
              </Badge>
              {profile?.role === 'guest' && !showVerifyInput && (
                <Button onClick={() => setShowVerifyInput(true)} className="bg-[#FFDD00] text-[#0057B7] hover:bg-[#0057B7] hover:text-white font-black rounded-2xl shadow-xl transition-all">
                  <Sparkles size={18} className="mr-2" /> START VERIFICATION
                </Button>
              )}
            </div>
          </Card>

          {/* 코드 입력창 */}
          {showVerifyInput && (
            <Card className="rounded-[40px] border-none shadow-2xl bg-[#FFDD00] p-8 animate-in slide-in-from-top-4 duration-500">
              <div className="flex justify-between items-center mb-6 text-[#0057B7]">
                <h3 className="text-xl font-black italic flex items-center gap-2"><ShieldAlert /> ENTER CODE</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowVerifyInput(false)}><X /></Button>
              </div>
              <div className="flex flex-col gap-3">
                <Input placeholder="CH-2025-XXXX" value={code} onChange={e => setCode(e.target.value)} className="h-14 rounded-2xl border-none text-xl font-black text-center text-[#0057B7]" />
                <Button onClick={handleCodeVerify} disabled={updating} className="h-14 rounded-2xl bg-[#0057B7] text-white font-black hover:bg-[#004494]">
                  {updating ? <Loader2 className="animate-spin" /> : "ACTIVATE NOW"}
                </Button>
              </div>
            </Card>
          )}

          {/* 정보 리스트 */}
          <Card className="rounded-[40px] border-none shadow-sm bg-white overflow-hidden ring-1 ring-slate-100">
            <CardContent className="p-0 divide-y divide-slate-50">
              {/* 이름 수정 */}
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-[#0057B7]/5 flex items-center justify-center text-[#0057B7]"><User size={26} /></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Nickname</p>
                      {isEditName ? (
                        <div className="mt-2 space-y-2">
                          <Input value={nickname} onChange={e => setNickname(e.target.value)} className="h-10 font-black" />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => {/* 업데이트 로직 */}} className="bg-[#0057B7]">SAVE</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditName(false)}>CANCEL</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="font-black text-slate-800 text-xl tracking-tight">{profile?.nickname}</p>
                      )}
                    </div>
                  </div>
                  {!isEditName && <Button size="icon" variant="ghost" disabled={nameRemaining > 0} onClick={() => setIsEditName(true)} className="text-slate-200"><Edit2 size={18} /></Button>}
                </div>
              </div>

              {/* 비밀번호 변경 */}
              <div className="p-8">
                <button onClick={() => setIsEditPw(!isEditPw)} disabled={pwRemaining > 0} className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFDD00]/10 flex items-center justify-center text-[#CCB000]"><Key size={26} /></div>
                    <p className="font-black text-slate-700 text-xl">Change Password</p>
                  </div>
                  <ChevronRight size={20} className={`text-slate-300 transition-transform ${isEditPw ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* 이메일 */}
              <div className="p-8 flex items-center gap-5 opacity-60">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300"><Mail size={26} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Email</p>
                  <p className="font-bold text-slate-500">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="pt-6 flex justify-center">
            <Button variant="ghost" onClick={handleLogout} className="text-slate-300 font-bold hover:text-[#0057B7]">
              <LogOut size={18} className="mr-2" /> LOGOUT
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
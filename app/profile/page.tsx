"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, Mail, LogOut, Loader2, Edit2, X, Key, ChevronRight, ShieldAlert, Sparkles, AlertTriangle
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, signOut, updateUserProfile } = useAuth();
  const router = useRouter();

  // 상태 관리
  const [updating, setUpdating] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditPw, setIsEditPw] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  // ★ 디버깅용 상태: 5초 타임아웃 체크
  const [timeoutError, setTimeoutError] = useState(false);

  // 1. 디버깅 로그 및 5초 타임아웃 설정
  useEffect(() => {
    // 콘솔에 현재 상태 출력 (디버깅용)
    console.log("🔍 [ProfilePage Debug]", { 
      authLoading, 
      hasUser: !!user, 
      userEmail: user?.email,
      hasProfile: !!userProfile,
      profileRole: userProfile?.role
    });

    let timer: NodeJS.Timeout;

    // 로딩 중이라면 5초 타이머 시작
    if (authLoading) {
      timer = setTimeout(() => {
        console.warn("⚠️ [ProfilePage] 로딩 시간 5초 초과! 강제 진단 모드 전환");
        setTimeoutError(true);
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [authLoading, user, userProfile]);

  // 2. 초기 데이터 세팅 및 리다이렉트 (무한 루프 방지를 위해 의존성 최소화)
  useEffect(() => {
    // 로딩이 끝났는데 유저가 없으면 로그인 페이지로
    if (!authLoading && !user) {
      console.log("⚠️ [ProfilePage] 인증되지 않은 사용자 -> 로그인 이동");
      router.push("/login");
      return;
    }

    // 유저 프로필이 있고 닉네임 상태가 비어있을 때만 동기화
    if (userProfile?.nickname && nickname === "") {
      console.log("✅ [ProfilePage] 프로필 닉네임 동기화:", userProfile.nickname);
      setNickname(userProfile.nickname);
    }
  }, [authLoading, user, userProfile, router]); // nickname은 의존성에서 제외하여 루프 방지

  // 3. 닉네임 수정
  const handleUpdateNickname = async () => {
    if (!nickname.trim()) return;
    
    // 30일 제한 체크
    if (userProfile?.last_name_change) {
      const lastChange = new Date(userProfile.last_name_change).getTime();
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - lastChange < thirtyDaysInMs) {
        alert("닉네임은 30일에 한 번만 변경할 수 있습니다.");
        return;
      }
    }

    setUpdating(true);
    const { error } = await updateUserProfile({ 
      nickname: nickname.trim(),
      // last_name_change: new Date().toISOString() // DB 컬럼 있으면 주석 해제
    });

    if (error) {
      alert("수정 실패: " + error.message);
    } else {
      setIsEditName(false);
      alert("닉네임이 변경되었습니다.");
    }
    setUpdating(false);
  };

  // 4. 교인 인증
  const handleCodeVerify = async () => {
    if (!code.trim() || !user) return;
    setUpdating(true);
    try {
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

      const { error: updateError } = await supabase
        .from("registration_codes")
        .update({ 
          is_used: true, 
          used_by_user_id: user.id, 
          used_at: new Date().toISOString() 
        })
        .eq("id", codeData.id);

      if (updateError) throw updateError;

      // 강제 프로필 새로고침
      await updateUserProfile({}); 
      alert("🎉 인증 완료!");
      setShowVerifyInput(false);
      setCode("");
    } catch (err: any) {
      console.error(err);
      alert("오류 발생: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // 5. 비밀번호 변경
  const handleChangePassword = async () => {
    if (password.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    setUpdating(true);
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      alert("변경 실패: " + error.message);
    } else {
      await updateUserProfile({ 
        // last_pw_change: new Date().toISOString() // DB 컬럼 있으면 주석 해제
      });
      alert("비밀번호가 변경되었습니다.");
      setIsEditPw(false);
      setPassword("");
    }
    setUpdating(false);
  };

  // ★ 로딩 화면 (타임아웃 시 진단 화면 표시)
  if (authLoading) {
    if (timeoutError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-bold text-slate-800">로딩 시간이 너무 오래 걸립니다.</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm text-sm text-slate-600 max-w-md w-full">
            <p className="font-bold mb-2 text-red-600">진단 정보 (개발자용):</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Auth Loading:</strong> {authLoading ? "TRUE (멈춤)" : "FALSE"}</li>
              <li><strong>User Logged In:</strong> {user ? "YES" : "NO"}</li>
              <li><strong>Email:</strong> {user?.email || "N/A"}</li>
              <li><strong>Profile Loaded:</strong> {userProfile ? "YES" : "NO"}</li>
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              * AuthContext에서 loading 상태가 false로 변하지 않고 있습니다. <br/>
              * 미들웨어 설정이나 AuthProvider 초기화 로직을 확인해주세요.
            </p>
          </div>
          <div className="flex gap-2 mt-4">
             <Button variant="outline" onClick={() => window.location.reload()}>페이지 새로고침</Button>
             <Button variant="destructive" onClick={async () => { await signOut(); router.push('/login'); }}>로그아웃 후 다시 시도</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0057B7]">
        <Loader2 className="w-12 h-12 animate-spin text-[#FFDD00]" />
        <p className="text-white/80 mt-4 text-sm font-medium animate-pulse">
          사용자 정보를 불러오는 중... (최대 5초)
        </p>
      </div>
    );
  }

  // 데이터 로딩은 끝났는데 유저가 없는 경우 (useEffect에서 리다이렉트 되겠지만, 찰나의 순간 방어)
  if (!user) return null;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#0057B7] via-[#f8faff] to-[#f8faff] pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-xl space-y-6">
          
          {/* 프로필 헤더 */}
          <Card className="rounded-[48px] border-none shadow-2xl bg-white/90 backdrop-blur-md p-10 text-center ring-1 ring-white/20">
            <div className="relative w-36 h-36 mx-auto mb-6">
              <div className="w-full h-full rounded-[56px] bg-gradient-to-tr from-[#FFDD00] to-[#FFE543] p-1 shadow-xl">
                <div className="w-full h-full rounded-[52px] bg-white overflow-hidden flex items-center justify-center">
                  {userProfile?.profile_picture_url ? (
                    <img src={userProfile.profile_picture_url} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <User size={56} className="text-[#0057B7]/20" />
                  )}
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-black text-[#0057B7] tracking-tighter italic uppercase mb-4">
              {userProfile?.nickname || user.email?.split('@')[0]}
            </h2>
            <div className="flex flex-col items-center gap-4">
              <Badge className={`px-6 py-2 rounded-2xl font-black uppercase shadow-md ${userProfile?.role === 'guest' ? 'bg-slate-100 text-slate-400' : 'bg-[#FFDD00] text-[#0057B7]'}`}>
                {userProfile?.role === 'guest' ? '🚫 Unverified' : `✨ ${userProfile?.role?.toUpperCase()} Member`}
              </Badge>
              {userProfile?.role === 'guest' && !showVerifyInput && (
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
                <Input 
                  placeholder="CH-2025-XXXX" 
                  value={code} 
                  onChange={e => setCode(e.target.value)} 
                  className="h-14 rounded-2xl border-none text-xl font-black text-center text-[#0057B7] bg-white/90 placeholder:text-[#0057B7]/30" 
                />
                <Button onClick={handleCodeVerify} disabled={updating} className="h-14 rounded-2xl bg-[#0057B7] text-white font-black hover:bg-[#004494]">
                  {updating ? <Loader2 className="animate-spin" /> : "ACTIVATE NOW"}
                </Button>
              </div>
            </Card>
          )}

          {/* 정보 리스트 */}
          <Card className="rounded-[40px] border-none shadow-sm bg-white overflow-hidden ring-1 ring-slate-100">
            <CardContent className="p-0 divide-y divide-slate-50">
              {/* 닉네임 수정 */}
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-[#0057B7]/5 flex items-center justify-center text-[#0057B7]"><User size={26} /></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Nickname</p>
                      {isEditName ? (
                        <div className="mt-2 flex gap-2">
                          <Input value={nickname} onChange={e => setNickname(e.target.value)} className="h-10 font-black" />
                          <Button size="sm" onClick={handleUpdateNickname} disabled={updating} className="bg-[#0057B7]">SAVE</Button>
                          <Button size="sm" variant="ghost" onClick={() => setIsEditName(false)}><X size={16} /></Button>
                        </div>
                      ) : (
                        <p className="font-black text-slate-800 text-xl tracking-tight">{nickname || userProfile?.nickname || "설정해주세요"}</p>
                      )}
                    </div>
                  </div>
                  {!isEditName && <Button size="icon" variant="ghost" onClick={() => setIsEditName(true)} className="text-slate-200"><Edit2 size={18} /></Button>}
                </div>
              </div>

              {/* 비밀번호 변경 UI */}
              <div className="p-8 space-y-4">
                <button onClick={() => setIsEditPw(!isEditPw)} className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFDD00]/10 flex items-center justify-center text-[#CCB000]"><Key size={26} /></div>
                    <p className="font-black text-slate-700 text-xl">Change Password</p>
                  </div>
                  <ChevronRight size={20} className={`text-slate-300 transition-transform ${isEditPw ? 'rotate-90' : ''}`} />
                </button>
                {isEditPw && (
                  <div className="pl-19 pt-2 flex flex-col gap-3 animate-in fade-in duration-300">
                    <Input 
                      type="password" 
                      placeholder="New Password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="rounded-xl border-slate-100"
                    />
                    <Button onClick={handleChangePassword} disabled={updating} className="bg-[#FFDD00] text-[#0057B7] font-bold">
                      {updating ? <Loader2 className="animate-spin" /> : "UPDATE PASSWORD"}
                    </Button>
                  </div>
                )}
              </div>

              {/* 이메일 (읽기 전용) */}
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
            <Button variant="ghost" onClick={() => { signOut(); router.push('/login'); }} className="text-slate-300 font-bold hover:text-[#0057B7]">
              <LogOut size={18} className="mr-2" /> LOGOUT
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
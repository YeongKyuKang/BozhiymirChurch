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
  User, Mail, LogOut, Loader2, Edit2, X, Key, ChevronRight, ShieldAlert, Sparkles 
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, signOut, updateUserProfile } = useAuth();
  const router = useRouter();

  const [updating, setUpdating] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditPw, setIsEditPw] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  // ★ 수정된 진단 함수: 유저가 없어도 실행되어 상태를 알려줌
  const checkDatabaseConnection = async () => {
    try {
      // 1. 현재 세션(토큰) 확인
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      const userId = user?.id || session?.user?.id;
      
      let dbResult = "조회 안 함 (로그인 필요)";
      let dbErrorMsg = "없음";

      // 2. DB 직접 조회 시도 (로그인 된 경우에만)
      if (userId) {
        const { data, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
         if (dbError) dbErrorMsg = dbError.message;
         dbResult = data ? `✅ 있음 (닉네임: ${data.nickname})` : "❌ 없음 (데이터가 비어있음)";
      }

      // 3. 진단 결과 출력
      alert(
        `[🔍 DB 연결 진단 결과]\n\n` +
        `1. User ID (Context): ${user?.id || "❌ 없음 (Context 유실)"}\n` +
        `2. Auth Token (Supabase): ${session ? "✅ 보유함" : "❌ 없음"}\n` +
        `3. DB 조회 에러: ${dbErrorMsg}\n` +
        `4. DB 데이터: ${dbResult}`
      );
    } catch (e: any) {
      alert("진단 중 스크립트 에러: " + e.message);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      // 리다이렉트 대신 여기서도 진단을 위해 잠시 주석 처리 가능하나, 
      // 일단 로그인 페이지로 보내는 로직은 유지
       router.push("/login");
       return;
    }
    if (userProfile?.nickname && nickname === "") {
      setNickname(userProfile.nickname);
    }
  }, [authLoading, user, userProfile, router, nickname]);

  const handleUpdateNickname = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (userProfile?.last_name_change) {
      const lastChangeDate = new Date(userProfile.last_name_change);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastChangeDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays < 30) {
        const remainingDays = 30 - diffDays;
        alert(`닉네임은 30일에 한 번만 변경 가능합니다.\n약 ${remainingDays}일 뒤에 다시 시도해주세요.`);
        return;
      }
    }

    setUpdating(true);
    
    const { error } = await updateUserProfile({ 
      nickname: nickname.trim(),
      last_name_change: new Date().toISOString()
    });

    if (error) {
      alert("변경 실패: " + error.message);
    } else {
      setIsEditName(false);
      alert("닉네임이 변경되었습니다.");
    }
    setUpdating(false);
  };

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

      await updateUserProfile({}); 
      alert("🎉 인증 완료!");
      setShowVerifyInput(false);
      setCode("");
    } catch (err: any) {
      alert("오류 발생: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

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
        last_pw_change: new Date().toISOString() 
      });
      alert("비밀번호가 변경되었습니다.");
      setIsEditPw(false);
      setPassword("");
    }
    setUpdating(false);
  };

  if (authLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0057B7]">
        <Loader2 className="w-12 h-12 animate-spin text-[#FFDD00]" />
        <p className="text-white/80 mt-4 text-sm font-medium">Loading Profile...</p>
      </div>
    );
  }

  // ★ user가 없어도 진단 버튼은 보이게 하기 위해 null 리턴 제거 (대신 내용은 조건부 렌더링)
  // if (!user) return null; 

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#0057B7] via-[#f8faff] to-[#f8faff] pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-xl space-y-6">
          
          <div className="flex justify-center mb-4">
            <Button 
              onClick={checkDatabaseConnection} 
              className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg animate-pulse"
            >
              🚨 DB 연결 진단하기 (클릭)
            </Button>
          </div>

          {/* 유저가 있을 때만 프로필 카드 표시 */}
          {user && (
          <>
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

            <Card className="rounded-[40px] border-none shadow-sm bg-white overflow-hidden ring-1 ring-slate-100">
              <CardContent className="p-0 divide-y divide-slate-50">
                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-[#0057B7]/5 flex items-center justify-center text-[#0057B7]"><User size={26} /></div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Nickname</p>
                        {isEditName ? (
                          <div className="mt-2 flex gap-2">
                            <Input value={nickname} onChange={e => setNickname(e.target.value)} className="h-10 font-black" />
                            <Button size="sm" onClick={handleUpdateNickname} disabled={updating} className="bg-[#0057B7] text-white">SAVE</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditName(false)}><X size={16} /></Button>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                              <p className="font-black text-slate-800 text-xl tracking-tight">{userProfile?.nickname || "설정해주세요"}</p>
                              {userProfile?.last_name_change && (
                                  <span className="text-xs text-slate-300 mt-1">
                                      Last changed: {new Date(userProfile.last_name_change).toLocaleDateString()}
                                  </span>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                    {!isEditName && <Button size="icon" variant="ghost" onClick={() => setIsEditName(true)} className="text-slate-200"><Edit2 size={18} /></Button>}
                  </div>
                </div>

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
              <Button variant="ghost" onClick={() => signOut()} className="text-slate-300 font-bold hover:text-[#0057B7]">
                <LogOut size={18} className="mr-2" /> LOGOUT
              </Button>
            </div>
          </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
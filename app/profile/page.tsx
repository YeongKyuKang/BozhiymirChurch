"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Edit, Save, X, Loader2, Lock, KeyRound, CheckCircle2 } from "lucide-react"
import imageCompression from "browser-image-compression"

export default function ProfilePage() {
  const { user, userProfile, userRole, loading, updateUserProfile, updatePassword, verifyRegistrationCode, uploadProfilePicture } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPwd, setIsChangingPwd] = useState(false)
  const [editData, setEditData] = useState({ nickname: "", gender: "" })
  const [newPassword, setNewPassword] = useState("")
  const [regCode, setRegCode] = useState("")
  
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("")
  const [updateLoading, setUpdateLoading] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false) 
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (userProfile) {
      setEditData({ nickname: userProfile.nickname || "", gender: userProfile.gender || "" })
    }
  }, [user, loading, router, userProfile])

  // 하루 1회 시도 제한 체크 (Registration Code)
  const checkCodeAttempt = () => {
    const lastAttempt = localStorage.getItem(`code_attempt_${user?.id}`);
    if (lastAttempt) {
      const lastDate = new Date(lastAttempt).toDateString();
      const today = new Date().toDateString();
      if (lastDate === today) return false;
    }
    return true;
  };

  const handleRegisterCode = async () => {
    setError(""); setMessage("");
    if (!checkCodeAttempt()) {
      setError("등록 코드는 하루에 한 번만 시도할 수 있습니다.");
      return;
    }
    setUpdateLoading(true);
    const { error: codeErr } = await verifyRegistrationCode(regCode);
    if (codeErr) {
      setError(codeErr.message);
      localStorage.setItem(`code_attempt_${user?.id}`, new Date().toISOString());
    } else {
      setMessage("정회원으로 등급이 조정되었습니다!");
      setRegCode("");
    }
    setUpdateLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true); setError("");
    try {
      const compressedFile = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1024 });
      setProfilePicture(compressedFile);
      const reader = new FileReader();
      reader.onload = (e) => setProfilePicturePreview(e.target?.result as string);
      reader.readAsDataURL(compressedFile);
    } catch (err) { setError("이미지 압축 실패"); }
    finally { setIsCompressing(false); }
  };

  const handleSaveProfile = async () => {
    setUpdateLoading(true); setError(""); setMessage("");
    try {
      if (profilePicture) {
        const { error: upErr } = await uploadProfilePicture(profilePicture);
        if (upErr) throw upErr;
      }
      const { error: profErr } = await updateUserProfile({
        nickname: editData.nickname || null,
        gender: editData.gender as any || null,
      });
      if (profErr) throw profErr;
      setMessage("프로필이 성공적으로 업데이트되었습니다.");
      setIsEditing(false);
      setProfilePicture(null);
    } catch (err: any) { setError(err.message); }
    finally { setUpdateLoading(false); }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) { setError("비밀번호는 6자 이상이어야 합니다."); return; }
    setUpdateLoading(true); setError(""); setMessage("");
    const { error: pwdErr } = await updatePassword(newPassword);
    if (pwdErr) setError(pwdErr.message);
    else {
      setMessage("비밀번호가 변경되었습니다.");
      setIsChangingPwd(false);
      setNewPassword("");
    }
    setUpdateLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
    </div>
  );

  if (!user || !userProfile) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl space-y-6">
        
        {/* 1. Guest 회원용 등록 코드 섹션 */}
        {userRole === "user" && !userProfile.nickname && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-5 h-5" /> 정회원 등록
              </CardTitle>
              <CardDescription>배정받은 코드를 입력하여 정회원 권한을 획득하세요. (1일 1회 제한)</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input placeholder="등록 코드 입력" value={regCode} onChange={(e) => setRegCode(e.target.value)} />
              <Button onClick={handleRegisterCode} disabled={updateLoading || !regCode}>등록</Button>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold">프로필 설정</CardTitle>
              <CardDescription>회원님의 기본 정보를 관리합니다.</CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" /> 수정
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {message && <Alert className="bg-green-50 text-green-700 border-green-200"><AlertDescription>{message}</AlertDescription></Alert>}
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-sm">
                  <AvatarImage src={profilePicturePreview || userProfile.profile_picture_url || ""} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-3xl">
                    {userProfile.nickname?.[0] || user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm" className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 shadow-lg"
                    onClick={() => fileInputRef.current?.click()} disabled={isCompressing}
                  >
                    {isCompressing ? <Loader2 className="animate-spin w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  </Button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <p className="text-xs text-gray-400 italic">※ 프로필 사진/닉네임 변경은 30일에 1회 가능합니다.</p>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">이메일</label>
                <div className="p-2 bg-gray-100 rounded text-gray-600">{user.email}</div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">닉네임</label>
                {isEditing ? (
                  <Input value={editData.nickname} onChange={(e) => setEditData({...editData, nickname: e.target.value})} />
                ) : (
                  <div className="p-2 border-b font-medium">{userProfile.nickname || "미설정"}</div>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">성별</label>
                {isEditing ? (
                  <Select value={editData.gender} onValueChange={(v) => setEditData({...editData, gender: v})}>
                    <SelectTrigger><SelectValue placeholder="성별 선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 border-b font-medium capitalize">{userProfile.gender || "미설정"}</div>
                )}
              </div>
              
              <div className="flex items-center gap-4 border-t pt-4">
                <Badge variant={userRole === "admin" ? "default" : "secondary"} className="px-3 py-1">{userRole}</Badge>
                <span className="text-sm text-gray-400">가입일: {new Date(userProfile.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={handleSaveProfile} disabled={updateLoading || isCompressing}>
                  {updateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 저장
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>취소</Button>
              </div>
            )}

            {/* 비밀번호 변경 섹션 */}
            <div className="border-t pt-8 mt-4">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-gray-500" /> 보안 설정
              </h3>
              {!isChangingPwd ? (
                <Button variant="outline" onClick={() => setIsChangingPwd(true)}>
                  <KeyRound className="w-4 h-4 mr-2" /> 비밀번호 변경
                </Button>
              ) : (
                <div className="space-y-4 bg-slate-100 p-4 rounded-lg">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">새 비밀번호</label>
                    <Input type="password" placeholder="6자 이상 입력" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handlePasswordChange} disabled={updateLoading}>변경 적용</Button>
                    <Button variant="ghost" onClick={() => setIsChangingPwd(false)}>취소</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
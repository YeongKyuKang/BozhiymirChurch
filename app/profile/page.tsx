"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context" // [추가] 언어 컨텍스트
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Camera, ShieldAlert, Loader2, Save, User, Edit2, X, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import imageCompression from "browser-image-compression"
import { format, addDays, isAfter } from "date-fns"
import { updatePasswordAction, registerCodeAction } from "@/app/actions/auth"

export default function ProfilePage() {
  const { user, updateProfile, updateProfilePicture } = useAuth()
  const { t } = useLanguage() // [추가] t 함수 사용
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)

  // 닉네임 상태
  const [nickname, setNickname] = useState("")
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [isConfirmNicknameOpen, setIsConfirmNicknameOpen] = useState(false)

  // 비밀번호 상태
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false)

  // 가입 코드 상태
  const [regCode, setRegCode] = useState("")

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "")
    }
  }, [user])

  // 30일 제한 계산
  const lastNickChangeDate = user?.last_name_change ? new Date(user.last_name_change) : null
  const nextAvailableNickDate = lastNickChangeDate ? addDays(lastNickChangeDate, 30) : new Date()
  const canEditNickname = !lastNickChangeDate || isAfter(new Date(), nextAvailableNickDate)

  const lastPwChangeDate = user?.last_pw_change ? new Date(user.last_pw_change) : null
  const nextAvailablePwDate = lastPwChangeDate ? addDays(lastPwChangeDate, 30) : new Date()
  const canEditPassword = !lastPwChangeDate || isAfter(new Date(), nextAvailablePwDate)

  // 프로필 사진 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({ 
        title: t('register.error_invalid_image') || "Invalid file", 
        description: t('register.error_invalid_image') || "Please select an image file.", 
        variant: "destructive" 
      })
      return
    }

    try {
      setIsCompressing(true)
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1024, useWebWorker: true }
      const compressedFile = await imageCompression(file, options)

      setIsLoading(true)
      const { error } = await updateProfilePicture(compressedFile)

      if (error) throw error
      toast({ 
        title: t('profile.alert.success_update') || "Success", 
        description: "Profile picture updated." 
      })
    } catch (error: any) {
      console.error(error)
      toast({ 
        title: t('common.error') || "Error", 
        description: error.message || "Failed to update picture.", 
        variant: "destructive" 
      })
    } finally {
      setIsCompressing(false)
      setIsLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // 닉네임 변경
  const executeUpdateNickname = async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const { error } = await updateProfile({
        nickname: nickname,
        last_name_change: new Date().toISOString(),
      })

      if (error) throw error

      toast({ 
        title: t('profile.alert.success_update') || "Success", 
        description: "Nickname updated successfully." 
      })
      setIsEditingNickname(false)
    } catch (error: any) {
      toast({ 
        title: t('common.error') || "Error", 
        description: error.message || "Failed to update profile.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
      setIsConfirmNicknameOpen(false)
    }
  }

  // 비밀번호 유효성 검사
  const handlePasswordSubmit = () => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

    if (!newPassword || !confirmPassword) {
      toast({ 
        title: t('common.error') || "Error", 
        description: "Please fill in all fields.", 
        variant: "destructive" 
      })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ 
        title: t('common.error') || "Error", 
        description: t('register.error_password_match') || "Passwords do not match.", 
        variant: "destructive" 
      })
      return
    }
    if (!passwordRegex.test(newPassword)) {
      toast({
        title: "Weak Password",
        description: t('register.error_password_length') || "Min. 8 chars with at least 1 special character.",
        variant: "destructive",
      })
      return
    }

    setIsConfirmPasswordOpen(true)
  }

  const executeUpdatePassword = async () => {
    try {
      setIsLoading(true)
      console.log("[v0] Starting password update...")

      const result = await updatePasswordAction(newPassword)

      if (result.error) {
        console.log("[v0] Password update error:", result.error)

        let errorMessage = result.error

        // 서버 에러 메시지를 클라이언트 다국어로 변환 시도
        if (errorMessage.includes("different")) {
             errorMessage = t('profile.error_password_different') || "New password should be different.";
        } else if (errorMessage.includes("least")) {
             errorMessage = t('register.error_password_length') || "Password too short.";
        }

        console.log("[v0] Password update failed:", errorMessage)
        toast({
          title: t('common.error') || "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      console.log("[v0] Password update completed successfully")

      toast({
        title: t('profile.alert.success_update') || "Success",
        description: "Password updated successfully.",
      })

      setNewPassword("")
      setConfirmPassword("")
      setIsEditingPassword(false)
    } catch (error: any) {
      console.error("[v0] Unexpected error in password update:", error)
      toast({
        title: t('common.error') || "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      })
    } finally {
      console.log("[v0] Resetting loading state")
      setIsLoading(false)
      setIsConfirmPasswordOpen(false)
    }
  }

  const handleRegisterCode = async () => {
    if (!regCode.trim()) {
      toast({
        title: t('common.error') || "Error",
        description: t('profile.alert_enter_code') || "Please enter the code.",
        variant: "destructive",
      })
      return
    }

    if (!user?.id) {
      toast({
        title: t('common.error') || "Error",
        description: t('common.login_required') || "Login required.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      console.log("[v0] Starting code registration:", regCode)

      const result = await registerCodeAction(regCode.trim(), user.id)
      console.log("[v0] Registration result:", result)

      if (result.error) {
        console.log("[v0] Code registration error:", result.error)
        toast({
          title: "Failed",
          description: t('profile.error_invalid_code') || result.error,
          variant: "destructive",
        })
      } else {
        console.log("[v0] Code registered successfully")
        toast({
          title: "Welcome!",
          description: t('profile.success_verify') || "Upgrade successful.",
        })
        setRegCode("")
        // Refresh the page to update user role
        window.location.reload()
      }
    } catch (error: any) {
      console.error("[v0] Unexpected error during code registration:", error)
      toast({
        title: t('common.error') || "Error",
        description: error.message || "Unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      console.log("[v0] Resetting loading state")
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero Section */}
      <div className="bg-[#0F172A] text-white py-12 border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-white shadow-2xl">
                <AvatarImage src={user.profile_picture_url || "/placeholder-user.jpg"} className="object-cover" />
                <AvatarFallback className="text-2xl bg-slate-800 text-white">
                  {user.nickname?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="picture-upload"
                className={`absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-500 transition-all shadow-lg border-2 border-[#0F172A] ${
                  isLoading || isCompressing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isCompressing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera size={18} />}
                <Input
                  ref={fileInputRef}
                  id="picture-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading || isCompressing}
                />
              </Label>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black italic tracking-tight mb-2">
            {user.nickname || t('profile.default_nickname') || "My Profile"}
          </h1>
          <div className="flex justify-center items-center gap-2">
            <Badge variant="secondary" className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 font-bold px-3 py-1">
              {user.role.toUpperCase()}
            </Badge>
            <span className="text-slate-400 text-sm">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto py-12 px-4 space-y-8">
        {/* Basic Information & Password */}
        <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200 overflow-hidden">
          <CardHeader className="bg-white px-8 pt-8 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <User size={24} />
              </div>
              <div>
                {/* [수정] 다국어 적용 */}
                <CardTitle className="text-xl font-bold text-slate-900">{t('profile.settings_title') || "Basic Information"}</CardTitle>
                <CardDescription>{t('profile.settings_desc') || "Manage your display name and security details."}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-8">
            {/* Nickname Section */}
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">{t('register.label_nickname') || "Nickname"}</Label>
              <div className="flex gap-3">
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  disabled={!isEditingNickname || isLoading}
                  placeholder={t('register.placeholder_nickname') || "Enter nickname"}
                  className={`h-12 rounded-xl border-slate-200 focus:bg-white transition-all ${isEditingNickname ? "bg-white border-blue-400 ring-2 ring-blue-100" : "bg-slate-50"}`}
                />

                {!isEditingNickname ? (
                  <Button
                    onClick={() => setIsEditingNickname(true)}
                    disabled={!canEditNickname}
                    className="h-12 w-24 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold shadow-md shrink-0"
                  >
                    <Edit2 className="h-4 w-4 mr-1" /> {t('common.edit') || "Edit"}
                  </Button>
                ) : (
                  <div className="flex gap-2 shrink-0">
                    <Button
                      onClick={() => setIsConfirmNicknameOpen(true)}
                      disabled={isLoading || nickname.trim() === ""}
                      className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-md"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-1" />
                      )}
                      {t('common.save') || "Save"}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditingNickname(false)
                        setNickname(user.nickname || "")
                      }}
                      variant="outline"
                      disabled={isLoading}
                      className="h-12 rounded-xl border-slate-200 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {!canEditNickname && (
                <div className="flex items-center gap-2 mt-2 text-xs font-medium text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {/* [수정] 30일 제한 메시지 다국어 처리 필요 (일단 기본 텍스트 유지하되 포맷팅만) */}
                    {t('profile.limit_30days_nickname') || "You can change your nickname once every 30 days."}
                    <br />
                    <strong>{format(nextAvailableNickDate, "yyyy-MM-dd")}</strong> {t('profile.limit_available_after') || "available after."}
                  </span>
                </div>
              )}
            </div>

            {/* Gender Section */}
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">{t('register.label_gender') || "Gender"}</Label>
              <Input
                value={user.gender ? (user.gender === "male" ? t('register.gender_male') || "Male" : t('register.gender_female') || "Female") : "Not Set"}
                disabled
                className="h-12 rounded-xl border-slate-200 bg-slate-100 text-slate-500 font-medium cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 pl-1">*{t('profile.gender_locked') || "Gender cannot be changed."}</p>
            </div>

            <div className="h-px bg-slate-100 my-6" />

            {/* Password Section */}
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">{t('register.label_password') || "Password"}</Label>

              {!isEditingPassword ? (
                <div className="flex gap-3">
                  <Input
                    value="••••••••"
                    disabled
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-500 font-medium tracking-widest cursor-not-allowed"
                  />
                  <Button
                    onClick={() => setIsEditingPassword(true)}
                    disabled={!canEditPassword}
                    className="h-12 w-24 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold shadow-md shrink-0"
                  >
                    <Edit2 className="h-4 w-4 mr-1" /> {t('common.edit') || "Edit"}
                  </Button>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-600">{t('profile.new_password') || "New Password"}</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t('register.placeholder_password') || "Min. 8 chars"}
                      disabled={isLoading}
                      className="h-11 rounded-xl bg-white border-slate-200 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-600">{t('register.label_confirm_password') || "Confirm Password"}</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('register.placeholder_confirm_password') || "Confirm new password"}
                      disabled={isLoading}
                      className="h-11 rounded-xl bg-white border-slate-200 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-2 justify-end">
                    <Button
                      onClick={() => {
                        setIsEditingPassword(false)
                        setNewPassword("")
                        setConfirmPassword("")
                      }}
                      variant="outline"
                      disabled={isLoading}
                      className="h-10 px-4 rounded-xl border-slate-200 hover:bg-white text-slate-600"
                    >
                      {t('common.cancel') || "Cancel"}
                    </Button>
                    <Button
                      onClick={handlePasswordSubmit}
                      disabled={isLoading || !newPassword}
                      className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {t('common.save') || "Save"}
                    </Button>
                  </div>
                </div>
              )}

              {!canEditPassword && !isEditingPassword && (
                <div className="flex items-center gap-2 mt-2 text-xs font-medium text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {t('profile.limit_30days_password') || "Password can be changed once every 30 days."}
                    <br />
                    <strong>{format(nextAvailablePwDate, "yyyy-MM-dd")}</strong> {t('profile.limit_available_after') || "available after."}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registration Code (Guest only) */}
        {user.role === "guest" && (
          <Card className="rounded-[32px] border-2 border-dashed border-blue-200 bg-blue-50/50 shadow-none">
            <CardHeader className="px-8 pt-8 pb-2">
              <div className="flex items-center gap-3 text-blue-700">
                <ShieldAlert className="h-6 w-6" />
                <CardTitle className="text-xl font-bold">{t('profile.verify_title') || "Upgrade Account"}</CardTitle>
              </div>
              <CardDescription className="text-blue-600/80">
                {t('profile.verify_description') || "Enter your registration code."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="flex gap-3">
                <Input
                  value={regCode}
                  onChange={(e) => setRegCode(e.target.value)}
                  placeholder={t('profile.placeholder_code') || "e.g. MEMBER-2025"}
                  disabled={isLoading}
                  className="h-12 rounded-xl border-blue-200 bg-white focus:ring-blue-500"
                />
                <Button
                  onClick={handleRegisterCode}
                  disabled={isLoading || !regCode.trim()}
                  className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-md"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {t('profile.btn_verify') || "Verify"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 닉네임 변경 팝업 */}
      <AlertDialog open={isConfirmNicknameOpen} onOpenChange={setIsConfirmNicknameOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">{t('profile.modal_nickname_title') || "Change Nickname?"}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              {t('profile.modal_nickname_desc') || "You cannot change it again for 30 days."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg" disabled={isLoading}>
              {t('common.cancel') || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeUpdateNickname}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {t('common.change') || "Change"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 비밀번호 변경 팝업 */}
      <AlertDialog open={isConfirmPasswordOpen} onOpenChange={setIsConfirmPasswordOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">
              {t('profile.modal_password_title') || "Change Password?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              {t('profile.modal_password_desc') || "You cannot change it again for 30 days."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg" disabled={isLoading}>
              {t('common.cancel') || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeUpdatePassword}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {t('common.change') || "Change"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
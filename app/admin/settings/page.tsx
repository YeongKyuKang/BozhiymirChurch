// app/admin/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase"; // 클라이언트용 Supabase 인스턴스
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast, Toaster } from "sonner"; // 토스트 알림
import Header from "@/components/header"; // ✅ 추가: Header 컴포넌트 임포트
import Footer from "@/components/footer"; // ✅ 추가: Footer 컴포넌트 임포트

export default function AdminSettingsPage() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isAdminPasswordSet, setIsAdminPasswordSet] = useState<boolean | null>(null); // 관리자 비밀번호 설정 여부
  const [fetchSettingsLoading, setFetchSettingsLoading] = useState(true);

  // 관리자 권한 확인 및 현재 비밀번호 설정 상태 가져오기
  useEffect(() => {
    if (!authLoading) {
      if (!user || userRole !== 'admin') {
        router.push('/'); // 관리자가 아니면 홈으로 리다이렉트
        return;
      }
      
      const fetchAdminSettings = async () => {
        setFetchSettingsLoading(true);
        // 클라이언트에서 서비스 역할 키를 직접 사용해서는 안 됩니다.
        // API 라우트를 통해 안전하게 비밀번호 설정 여부를 확인해야 합니다.
        // 여기서는 임시로 admin_settings 테이블의 존재 여부로 판단합니다.
        // 실제 프로덕션에서는 별도의 API 엔드포인트를 만들어 확인하는 것이 더 안전합니다.
        const { data, error } = await supabase
          .from('admin_settings')
          .select('id, delete_password_hash')
          .eq('id', 1)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116은 데이터 없음 오류
          console.error("관리자 설정 불러오기 오류:", error);
          setIsAdminPasswordSet(false); // 오류 발생 시 설정 안 된 것으로 간주
          toast.error("관리자 설정을 불러오는 데 실패했습니다.");
        } else if (data && data.delete_password_hash) {
          setIsAdminPasswordSet(true);
        } else {
          setIsAdminPasswordSet(false);
        }
        setFetchSettingsLoading(false);
      };
      fetchAdminSettings();
    }
  }, [authLoading, user, userRole, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: '새 비밀번호는 최소 6자 이상이어야 합니다.' });
      setIsSubmitting(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/set-admin-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword,
          currentAdminPassword: isAdminPasswordSet ? currentPassword : undefined // 이미 설정되어 있다면 현재 비밀번호 포함
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '비밀번호 설정/변경에 실패했습니다.');
      }

      setMessage({ type: 'success', text: result.message });
      toast.success(result.message);
      
      // 성공 후 폼 초기화 및 상태 업데이트
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsAdminPasswordSet(true); // 비밀번호가 이제 설정되었음을 표시

    } catch (error: any) {
      console.error("비밀번호 설정/변경 오류:", error);
      setMessage({ type: 'error', text: `비밀번호 설정/변경 중 오류 발생: ${error.message}` });
      toast.error(`비밀번호 설정/변경 중 오류 발생: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || fetchSettingsLoading || (!user && !authLoading) || (user && userRole !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        {fetchSettingsLoading ? "설정 불러오는 중..." : "관리자 권한이 필요합니다."}
      </div>
    );
  }

  return (
    <> {/* ✅ 추가: Fragment로 감싸기 */}
      <Header /> {/* ✅ 추가: Header 컴포넌트 추가 */}
      <div className="min-h-screen bg-gray-100 p-8 pt-24 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900">
                관리자 비밀번호 설정
              </CardTitle>
              <CardDescription>
                {isAdminPasswordSet ? 
                  "관리자 비밀번호를 변경합니다. 보안을 위해 주기적으로 변경해주세요." :
                  "관리자 비밀번호가 아직 설정되지 않았습니다. 지금 설정해주세요."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-4">
                    {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    <AlertTitle>{message.type === 'error' ? "오류!" : "성공!"}</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                {isAdminPasswordSet && (
                  <div>
                    <Label htmlFor="currentPassword" className="mb-2 block">현재 관리자 비밀번호</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="현재 비밀번호를 입력하세요"
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="newPassword" className="mb-2 block">새 관리자 비밀번호</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmNewPassword" className="mb-2 block">새 관리자 비밀번호 확인</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    isAdminPasswordSet ? "비밀번호 변경" : "비밀번호 설정"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer /> {/* ✅ 추가: Footer 컴포넌트 추가 */}
      <Toaster /> {/* 토스트 메시지를 표시하기 위한 Toaster 컴포넌트 */}
    </>
  );
}

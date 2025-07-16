// app/admin/settings/page.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, KeyRound } from "lucide-react";

export default function AdminSettingsPage() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();

  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || userRole !== 'admin') {
        router.push('/');
      }
    }
  }, [authLoading, user, userRole, router]);

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (adminPassword !== confirmPassword) {
      setMessage({ type: 'error', text: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다." });
      setIsSubmitting(false);
      return;
    }

    if (adminPassword.length < 6) {
      setMessage({ type: 'error', text: "비밀번호는 최소 6자 이상이어야 합니다." });
      setIsSubmitting(false);
      return;
    }

    try {
      // Supabase Edge Function 또는 Admin API를 통해 비밀번호 변경
      // 클라이언트에서 직접 user.update()를 사용하면 보안 문제가 있을 수 있으므로
      // 여기서는 Next.js API 라우트를 통해 서버에서 처리하도록 가정합니다.
      const response = await fetch('/api/admin/set-admin-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: adminPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "비밀번호 변경 실패");
      }

      setMessage({ type: 'success', text: "관리자 비밀번호가 성공적으로 변경되었습니다!" });
      setAdminPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error changing admin password:", err);
      setMessage({ type: 'error', text: `비밀번호 변경에 실패했습니다: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (!user && !authLoading) || (user && userRole !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        관리자 권한이 필요합니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 pt-24 px-4"> {/* Admin Dashboard style */}
      <div className="container mx-auto max-w-3xl"> {/* max-w-5xl -> max-w-3xl for forms */}
        <h1 className="text-4xl font-bold text-center mb-12">사이트 설정</h1>
        
        <Card className="shadow-lg bg-gray-800 border border-gray-700 text-white"> {/* Admin Dashboard card style */}
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">관리자 비밀번호 변경</CardTitle>
            <CardDescription className="text-gray-400">관리자 계정의 비밀번호를 변경합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangeAdminPassword} className="space-y-6">
              {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'error' ? 'bg-red-900 text-white border-red-700' : 'bg-green-900 text-white border-green-700'}>
                  {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  <AlertTitle>{message.type === 'error' ? "오류!" : "성공!"}</AlertTitle>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="adminPassword" className="mb-2 block text-gray-300">새 비밀번호</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="mb-2 block text-gray-300">새 비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    변경 중...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    비밀번호 변경
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

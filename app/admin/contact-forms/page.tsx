// app/admin/contact-forms/page.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // useRouter 임포트
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Trash2, MessageCircle, ArrowLeft } from "lucide-react"; // ArrowLeft 아이콘 추가
import { format } from "date-fns";

interface ContactFormEntry {
  id: string;
  first_name: string; // full_name -> first_name
  last_name: string; // 추가: last_name
  email: string;
  phone: string | null; // phone_number -> phone
  interests: string[] | Record<string, boolean> | null; // interests 타입 변경
  message: string | null; // message 타입 변경
  is_read: boolean; // is_read 추가
  created_at: string;
}

export default function AdminContactFormsPage() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter(); // useRouter 훅 사용

  const [formEntries, setFormEntries] = useState<ContactFormEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isDeletingEntry, setIsDeletingEntry] = useState(false);

  const fetchFormEntries = useCallback(async () => {
    setLoadingEntries(true);
    const { data, error } = await supabase
      .from('contact_forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching form entries:", error);
      setMessage({ type: 'error', text: "문의 양식 목록을 불러오는 데 실패했습니다." });
    } else {
      setFormEntries(data || []);
    }
    setLoadingEntries(false);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user || userRole !== 'admin') {
        router.push('/');
        return;
      }
      fetchFormEntries();
    }
  }, [authLoading, user, userRole, fetchFormEntries, router]);

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("정말로 이 문의 양식을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setIsDeletingEntry(true);
    setMessage(null);

    const { error } = await supabase
      .from('contact_forms')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error("Error deleting form entry:", error);
      setMessage({ type: 'error', text: `문의 양식 삭제에 실패했습니다: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: "문의 양식이 성공적으로 삭제되었습니다!" });
      fetchFormEntries(); // 목록 새로고침
    }
    setIsDeletingEntry(false);
  };

  if (authLoading || (!user && !authLoading) || (user && userRole !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        관리자 권한이 필요합니다.
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 pt-24 px-4">
      <div className="container mx-auto max-w-3xl">
              {/* 뒤로가기 버튼을 좌측 상단에 배치 */}
              <div className="mb-8"> {/* 제목 위쪽에 여백 추가 */}
                <Button
                  variant="outline"
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  뒤로가기
                </Button>
              </div>
        <Card className="shadow-lg bg-gray-800 border border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">제출된 문의</CardTitle>
            <CardDescription className="text-gray-400">사용자들이 제출한 모든 문의 양식을 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'error' ? 'bg-red-900 text-white border-red-700 mb-4' : 'bg-green-900 text-white border-green-700 mb-4'}>
                {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertTitle>{message.type === 'error' ? "오류!" : "성공!"}</AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {loadingEntries ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                <span className="ml-3 text-gray-300">문의 목록 불러오는 중...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full bg-gray-700 rounded-md overflow-hidden">
                  <TableHeader className="bg-gray-600">
                    <TableRow>
                      {/* ContactFormEntry 인터페이스에 맞춰 수정 */}
                      <TableHead className="text-gray-200">이름</TableHead>
                      <TableHead className="text-gray-200">이메일</TableHead>
                      <TableHead className="text-gray-200">전화</TableHead>
                      <TableHead className="text-gray-200">관심분야</TableHead>
                      <TableHead className="text-gray-200">메시지</TableHead>
                      <TableHead className="text-gray-200">읽음</TableHead>
                      <TableHead className="text-gray-200">날짜</TableHead>
                      <TableHead className="text-gray-200 text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formEntries.map((entry) => (
                      <TableRow key={entry.id} className="border-b border-gray-600 last:border-b-0 hover:bg-gray-600">
                        <TableCell className="py-3 px-4 text-gray-200">{entry.first_name} {entry.last_name}</TableCell>
                        <TableCell className="py-3 px-4 text-gray-200">{entry.email}</TableCell>
                        <TableCell className="py-3 px-4 text-gray-200">{entry.phone || '-'}</TableCell>
                        <TableCell className="py-3 px-4 text-gray-200">
                          {Array.isArray(entry.interests)
                            ? entry.interests.join(', ')
                            : (entry.interests && typeof entry.interests === 'object'
                              ? Object.keys(entry.interests).filter(key => entry.interests && (entry.interests as Record<string, boolean>)[key]).join(', ')
                              : '-')
                          }
                        </TableCell>
                        <TableCell className="py-3 px-4 text-gray-200 max-w-[200px] truncate">{entry.message || '-'}</TableCell>
                        <TableCell className="py-3 px-4 text-gray-200">
                          {entry.is_read ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-gray-200">{format(new Date(entry.created_at), 'yyyy-MM-dd HH:mm')}</TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteEntry(entry.id)}
                            disabled={isDeletingEntry}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isDeletingEntry ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

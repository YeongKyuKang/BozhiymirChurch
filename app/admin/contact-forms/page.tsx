// app/admin/contact-forms/page.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Trash2, MessageCircle } from "lucide-react";
import { format } from "date-fns";

interface ContactFormEntry {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  age_group: string | null;
  interests: string[] | null;
  message: string;
  receive_updates: boolean;
  type: string | null; // 예: 'join_request', 'general_inquiry'
  subject: string | null; // 문의 제목
  created_at: string;
}

export default function AdminContactFormsPage() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 pt-24 px-4"> {/* Admin Dashboard style */}
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-12">문의 양식 관리</h1>
        
        <Card className="shadow-lg bg-gray-800 border border-gray-700 text-white"> {/* Admin Dashboard card style */}
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
                <Table className="min-w-full bg-gray-700 rounded-md overflow-hidden"> {/* Table style */}
                  <TableHeader className="bg-gray-600">
                    <TableRow>
                      <TableHead className="text-gray-200">유형</TableHead>
                      <TableHead className="text-gray-200">제목</TableHead>
                      <TableHead className="text-gray-200">이름</TableHead>
                      <TableHead className="text-gray-200">이메일</TableHead>
                      <TableHead className="text-gray-200">메시지</TableHead>
                      <TableHead className="text-gray-200">날짜</TableHead>
                      <TableHead className="text-gray-200 text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formEntries.map((entry) => (
                      <TableRow key={entry.id} className="border-b border-gray-600 last:border-b-0 hover:bg-gray-600">
                        <TableCell className="py-3 px-4 text-gray-200">{entry.type || '일반'}</TableCell>
                        <TableCell className="py-3 px-4 text-gray-200">{entry.subject || '-'}</TableCell>
                        <TableCell className="py-3 px-4 text-gray-200">{entry.full_name}</TableCell>
                        <TableCell className="py-3 px-4 text-gray-200">{entry.email}</TableCell>
                        <TableCell className="py-3 px-4 text-gray-200 max-w-[200px] truncate">{entry.message}</TableCell>
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

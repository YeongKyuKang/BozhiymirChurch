// components/admin-contact-forms-client.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, MailOpen, AlertCircle, Clock } from "lucide-react"; // Clock 아이콘 임포트 추가 (이전 오류 해결용)
import { format } from "date-fns";
import { Database } from "@/lib/supabase"; // Database 타입 임포트

// ContactForm 타입을 lib/supabase.ts의 Database에서 직접 가져옵니다.
type ContactForm = Database['public']['Tables']['contact_forms']['Row'];

interface AdminContactFormsClientProps {
  initialContactForms: ContactForm[];
}

export default function AdminContactFormsClient({ initialContactForms }: AdminContactFormsClientProps) {
  const [contactForms, setContactForms] = useState<ContactForm[]>(initialContactForms);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setContactForms(initialContactForms);
  }, [initialContactForms]);

  const handleMarkAsRead = async (formId: string) => {
    setLoadingStates(prev => ({ ...prev, [formId]: true }));
    try {
      const response = await fetch(`/api/admin/contact-forms/${formId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update form status.');
      }

      setContactForms(prevForms =>
        prevForms.map(form =>
          form.id === formId ? { ...form, is_read: true } : form
        )
      );
    } catch (error: any) {
      console.error(`Error marking form ${formId} as read:`, error);
      alert(`문의를 읽음으로 표시하는 데 실패했습니다: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [formId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Form Submissions</h1>

        {contactForms.length === 0 ? (
          <p className="text-gray-600 text-lg text-center mt-10">현재 제출된 문의 양식이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {contactForms.map((form) => (
              <Card key={form.id} className={form.is_read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-200 shadow-md"}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      {form.first_name} {form.last_name}
                      {!form.is_read && (
                        <Badge variant="destructive" className="ml-2">New</Badge>
                      )}
                    </CardTitle>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {/* Clock 아이콘 사용 */}
                      {format(new Date(form.created_at), 'yyyy년 MM월 dd일 HH:mm')}
                    </div>
                  </div>
                  <CardDescription className="flex items-center space-x-2">
                    <span>{form.email}</span>
                    {form.phone && <span>| {form.phone}</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{form.message || '메시지 없음'}</p>
                  
                  {/* interests 렌더링 로직 */}
                  {form.interests && (
                    (Array.isArray(form.interests) && form.interests.length > 0) ||
                    (!Array.isArray(form.interests) && typeof form.interests === 'object' && Object.keys(form.interests).length > 0)
                  ) && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Interests:</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(form.interests) ? (
                          // interests가 배열인 경우
                          form.interests.map((interest, idx) => (
                            <Badge key={idx} variant="secondary">{interest}</Badge>
                          ))
                        ) : (
                          // interests가 객체인 경우 (Record<string, boolean>)
                          Object.entries(form.interests as Record<string, boolean>)
                            .filter(([, value]) => value) // 값이 true인 항목만 필터링
                            .map(([key], idx) => (
                              <Badge key={idx} variant="secondary">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Badge>
                            ))
                        )}
                      </div>
                    </div>
                  )}

                  {!form.is_read ? (
                    <Button
                      onClick={() => handleMarkAsRead(form.id)}
                      disabled={loadingStates[form.id]}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loadingStates[form.id] ? (
                        '표시 중...'
                      ) : (
                        <>
                          <MailOpen className="h-4 w-4 mr-2" /> Mark as Read
                        </>
                      )}
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Check className="h-3 w-3 mr-1" /> Read
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

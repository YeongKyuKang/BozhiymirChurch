// app/admin/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen, Calendar, Users, Settings, ArrowLeft } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();

  // 관리자 권한 확인
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        권한 확인 중...
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    router.push('/');
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        관리자 권한이 필요합니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 pt-24 px-4">
      <div className="container mx-auto max-w-5xl">
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

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">관리자 대시보드</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 말씀 게시물 관리 카드 */}
          <Card className="bg-gray-800 text-white shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <CardTitle className="text-2xl font-bold">말씀 게시물 관리</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6">말씀 게시물을 작성, 편집 및 삭제합니다.</p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
                <Link href="/admin/word-posts">게시물 관리</Link>
              </Button>
            </CardContent>
          </Card>

          {/* 이벤트 관리 카드 */}
          <Card className="bg-gray-800 text-white shadow-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
              <CardTitle className="text-2xl font-bold">이벤트 관리</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6">교회 이벤트를 생성, 편집 및 관리합니다.</p>
              <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-3 rounded-lg">
                <Link href="/admin/events">이벤트 관리</Link>
              </Button>
            </CardContent>
          </Card>

          {/* 사용자 관리 카드 (기존) */}
          <Card className="bg-gray-800 text-white shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-green-400" />
              <CardTitle className="text-2xl font-bold">사용자 관리</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6">사용자 계정 및 권한을 관리합니다.</p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg">
                <Link href="/admin/users">사용자 관리</Link>
              </Button>
            </CardContent>
          </Card>

          {/* 문의 양식 관리 카드 (기존) */}
          <Card className="bg-gray-800 text-white shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-purple-400" />
              <CardTitle className="text-2xl font-bold">문의 양식 관리</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6">제출된 문의 양식을 확인하고 관리합니다.</p>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg">
                <Link href="/admin/contact-forms">문의 관리</Link>
              </Button>
            </CardContent>
          </Card>

          {/* 설정 카드 (기존) */}
          <Card className="bg-gray-800 text-white shadow-lg border border-gray-700 hover:border-orange-500 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <Settings className="h-16 w-16 mx-auto mb-4 text-orange-400" />
              <CardTitle className="text-2xl font-bold">사이트 설정</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6">사이트 전반적인 설정을 변경합니다.</p>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg">
                <Link href="/admin/settings">설정 관리</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

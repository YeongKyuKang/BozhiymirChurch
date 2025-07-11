// components/admin-users-client.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase"; 
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Trash2, User, Settings } from "lucide-react"; 
import { format } from "date-fns";
import { Database } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch"; 
import { toast, Toaster } from "sonner"; 


// User 타입 정의 (Database에서 필요한 필드를 직접 가져옴)
type UserProfile = Database['public']['Tables']['users']['Row'];

interface AdminUsersClientProps {
  initialUsers: UserProfile[];
}

export default function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState<Record<string, boolean>>({}); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [deleteMessage, setDeleteMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null); 

  // initialUsers가 변경될 때마다 사용자 목록 업데이트 (서버에서 다시 가져올 때)
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // 관리자 권한 없는 경우 리다이렉트 (클라이언트 측에서 한번 더)
  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'admin')) {
      router.push('/');
    }
  }, [authLoading, user, userRole, router]);

  const handleDeleteClick = (userId: string) => {
    setDeletingUserId(userId);
    setAdminPassword(""); 
    setDeleteMessage(null); 
    setDialogOpen(true); 
  };

  const confirmDelete = async () => {
    if (!deletingUserId) return;

    setIsDeleting(true);
    setDeleteMessage(null); 

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: deletingUserId, adminPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '사용자 삭제에 실패했습니다.');
      }

      toast.success(`사용자 '${deletingUserId}'가 성공적으로 삭제되었습니다.`);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== deletingUserId)); 
      
      router.refresh(); 

    } catch (error: any) {
      console.error("User deletion error:", error);
      setDeleteMessage({ type: 'error', text: `사용자 삭제 중 오류 발생: ${error.message}` });
      toast.error(`사용자 삭제 중 오류 발생: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setDeletingUserId(null); 
      setAdminPassword(""); 
      setDialogOpen(false); 
    }
  };

  // can_comment 토글 핸들러
  const handleToggleCanComment = async (userId: string, currentCanComment: boolean) => {
    setPermissionLoading(prev => ({ ...prev, [userId]: true }));
    const newCanCommentStatus = !currentCanComment;
    
    try {
      const passwordPrompt = prompt("댓글 권한을 변경하려면 관리자 비밀번호를 입력하세요.");
      if (!passwordPrompt) {
        setPermissionLoading(prev => ({ ...prev, [userId]: false }));
        toast.info("관리자 비밀번호 입력이 취소되었습니다.");
        return;
      }

      const response = await fetch('/api/admin/update-user-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, can_comment: newCanCommentStatus, adminPassword: passwordPrompt }), // ✅ 수정: prompt로 받은 비밀번호를 직접 전달
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '권한 변경에 실패했습니다.');
      }

      toast.success(`사용자 '${userId}'의 댓글 권한이 성공적으로 변경되었습니다.`);
      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === userId ? { ...u, can_comment: newCanCommentStatus } : u))
      );
      router.refresh(); 
    } catch (error: any) {
      console.error("Permission update error:", error);
      toast.error(`권한 변경 중 오류 발생: ${error.message}`);
    } finally {
      setPermissionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'default';
      case 'child':
        return 'secondary';
      default:
        return 'outline';
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
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-3xl font-bold text-gray-900">
              <User className="h-7 w-7" />
              <span>사용자 관리</span>
            </CardTitle>
            <CardDescription>
              교회에 등록된 사용자 계정을 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {deleteMessage && ( 
              <Alert variant={deleteMessage.type === 'error' ? 'destructive' : 'default'} className="mb-4">
                {deleteMessage.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertTitle>{deleteMessage.type === 'error' ? "오류!" : "성공!"}</AlertTitle>
                <AlertDescription>{deleteMessage.text}</AlertDescription>
              </Alert>
            )}

            {users.length === 0 ? (
              <p className="text-center text-gray-600 py-10">등록된 사용자가 없습니다.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이메일</TableHead><TableHead>닉네임</TableHead><TableHead>역할</TableHead><TableHead>댓글 권한</TableHead><TableHead>가입일</TableHead><TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userItem) => (
                    <TableRow key={userItem.id}>
                      <TableCell className="font-medium">{userItem.email}</TableCell><TableCell>{userItem.nickname || '-'}</TableCell><TableCell>
                        <Badge variant={getRoleBadgeVariant(userItem.role)}>
                          {userItem.role === 'admin' ? '관리자' : userItem.role === 'user' ? '멤버' : '어린이'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {userItem.id === user?.id ? ( 
                          <Badge variant="secondary">본인</Badge>
                        ) : (
                          <Switch
                            checked={userItem.can_comment}
                            onCheckedChange={() => handleToggleCanComment(userItem.id, userItem.can_comment)}
                            disabled={permissionLoading[userItem.id] || isDeleting}
                          />
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(userItem.created_at), 'yyyy-MM-dd')}</TableCell><TableCell className="text-right">
                        {userItem.id === user?.id ? ( 
                          <Button variant="outline" size="sm" disabled>본인</Button>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(userItem.id)}
                            disabled={isDeleting || permissionLoading[userItem.id]}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 삭제 확인 AlertDialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 이 사용자를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              사용자 계정 및 관련 데이터(게시물, 댓글 등)가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 삭제를 진행하려면 관리자 비밀번호를 입력하세요.
            </AlertDialogDescription>
            {deleteMessage && deleteMessage.type === 'error' && ( 
              <Alert variant="destructive">
                <AlertTitle>오류!</AlertTitle>
                <AlertDescription>{deleteMessage.text}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="adminPassword">관리자 비밀번호</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="관리자 비밀번호를 입력하세요"
                  disabled={isDeleting}
                />
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => setDialogOpen(false)}>취소</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting || adminPassword.length === 0}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '삭제'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster /> 
    </div>
  );
}

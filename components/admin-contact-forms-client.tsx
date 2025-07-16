// components/admin-users-client.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Trash2, Edit, User as UserIcon, X } from "lucide-react"; // ArrowLeft 아이콘 제거
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

interface UserProfile {
  id: string;
  email: string;
  nickname: string | null;
  role: string | null;
  created_at: string;
  can_comment: boolean;
}

interface AdminUsersClientProps {
  initialUsers: UserProfile[];
}

export default function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  // const [adminPasswordForPerms, setAdminPasswordForPerms] = useState(""); // 사용되지 않는 상태 제거

  // initialUsers가 변경될 때마다 users 상태 업데이트
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        nickname,
        role,
        created_at,
        can_comment
      `);

    if (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: 'error', text: "사용자 목록을 불러오는 데 실패했습니다." });
    } else {
      setUsers(data || []);
    }
    setLoadingUsers(false);
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'admin')) {
      router.push('/');
    }
  }, [authLoading, user, userRole, router]);


  const handleUpdateRole = async (userId: string) => {
    setIsUpdatingRole(true);
    setMessage(null);

    if (!newRole) {
      setMessage({ type: 'error', text: "새로운 역할을 선택해주세요." });
      setIsUpdatingRole(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error("Error updating user role:", error);
        setMessage({ type: 'error', text: `역할 업데이트에 실패했습니다: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: "사용자 역할이 성공적으로 업데이트되었습니다!" });
        setEditingUserId(null);
        setNewRole("");
        fetchUsers();
      }
    } catch (err) {
      console.error("Unexpected error during role update:", err);
      setMessage({ type: 'error', text: "역할 업데이트 중 예상치 못한 오류가 발생했습니다." });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`정말로 사용자 ${userEmail}을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    setIsDeletingUser(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "사용자 삭제 실패");
      }

      setMessage({ type: 'success', text: "사용자가 성공적으로 삭제되었습니다!" });
      fetchUsers();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setMessage({ type: 'error', text: `사용자 삭제에 실패했습니다: ${err.message}` });
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleToggleCanComment = async (userId: string, currentCanCommentStatus: boolean) => {
    setMessage(null);
    const newCanCommentStatus = !currentCanCommentStatus;

    const password = prompt("이 권한을 변경하려면 관리자 비밀번호를 입력하세요:");
    if (!password) {
      setMessage({ type: 'error', text: "관리자 비밀번호가 입력되지 않았습니다. 권한 변경이 취소되었습니다." });
      return;
    }

    try {
      const response = await fetch('/api/admin/update-user-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, can_comment: newCanCommentStatus, adminPassword: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "권한 업데이트 실패");
      }

      setMessage({ type: 'success', text: `사용자의 댓글 허용 권한이 성공적으로 ${newCanCommentStatus ? '활성화' : '비활성화'}되었습니다!` });
      fetchUsers();
    } catch (err: any) {
      console.error("Error updating can_comment:", err);
      setMessage({ type: 'error', text: `권한 업데이트에 실패했습니다: ${err.message}` });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-16 pt-0 px-4"> {/* pt-0 조정 */}
      <div className="container mx-auto max-w-5xl">
        <Card className="shadow-lg bg-gray-800 border border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">사용자 목록</CardTitle>
            <CardDescription className="text-gray-400">등록된 사용자 계정을 확인하고 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'error' ? 'bg-red-900 text-white border-red-700 mb-4' : 'bg-green-900 text-white border-green-700 mb-4'}>
                {message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertTitle>{message.type === 'error' ? "오류!" : "성공!"}</AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                <span className="ml-3 text-gray-300">사용자 목록 불러오는 중...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full bg-gray-700 rounded-md overflow-hidden">
                  <TableHeader className="bg-gray-600">
                    <TableRow>
                      <TableHead className="text-gray-200">이메일</TableHead>
                      <TableHead className="text-gray-200">닉네임</TableHead>
                      <TableHead className="text-gray-200">역할</TableHead>
                      <TableHead className="text-gray-200">가입일</TableHead>
                      <TableHead className="text-gray-200">댓글 허용</TableHead>
                      <TableHead className="text-gray-200 text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userItem) => (
                      <TableRow key={userItem.id} className="border-b border-gray-600 last:border-b-0 hover:bg-gray-600">
                        <TableCell className="py-3 px-4 text-gray-200">{userItem.email}</TableCell>
                        <TableCell className="py-3 px-4 text-gray-200">{userItem.nickname || '-'}</TableCell>
                        <TableCell className="py-3 px-4">
                          {editingUserId === userItem.id ? (
                            <Select value={newRole} onValueChange={setNewRole}>
                              <SelectTrigger className="w-[120px] bg-gray-600 text-white border-gray-500">
                                <SelectValue placeholder="역할 선택" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 text-white border-gray-600">
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              userItem.role === 'admin' ? 'bg-yellow-500 text-gray-900' : 'bg-blue-500 text-white'
                            }`}>
                              {userItem.role || 'user'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-gray-200">{format(new Date(userItem.created_at), 'yyyy-MM-dd')}</TableCell>
                        <TableCell className="py-3 px-4">
                            <Checkbox
                                checked={userItem.can_comment}
                                onCheckedChange={() => handleToggleCanComment(userItem.id, userItem.can_comment)}
                                disabled={userItem.role === 'admin'}
                                className="border-blue-500 data-[state=checked]:bg-blue-700 data-[state=checked]:text-white"
                            />
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          {editingUserId === userItem.id ? (
                            <div className="flex space-x-2 justify-end">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateRole(userItem.id)}
                                disabled={isUpdatingRole}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {isUpdatingRole ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingUserId(null)}
                                disabled={isUpdatingRole}
                                className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex space-x-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => { setEditingUserId(userItem.id); setNewRole(userItem.role || 'user'); }}
                                className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(userItem.id, userItem.email)}
                                disabled={isDeletingUser}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                {isDeletingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          )}
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

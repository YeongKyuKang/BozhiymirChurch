'use client'

import { useState, useEffect } from 'react'
import { Database } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

type UserProfile = Database['public']['Tables']['users']['Row']
type UserRole = UserProfile['role']

// [수정 1] props 인터페이스에 initialUsers 추가
interface AdminUsersClientProps {
  initialUsers: UserProfile[]
}

// [수정 2] 파라미터에서 initialUsers 받기
export default function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const { t } = useLanguage()
  // [수정 3] 초기값을 전달받은 initialUsers로 설정
  const [users, setUsers] = useState<UserProfile[]>(initialUsers || [])
  // [수정 4] 데이터가 있으면 로딩 false, 없으면 true로 시작
  const [loading, setLoading] = useState(initialUsers ? false : true)
  
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null)

  useEffect(() => {
    // 만약 초기 데이터가 없거나 갱신이 필요하다면 fetch 실행
    if (initialUsers && initialUsers.length > 0) return;

    const fetchUsers = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        toast.error(t('Error fetching users.')) 
      } else {
        setUsers(data || [])
      }
      setLoading(false)
    }

    fetchUsers()
  }, [t, initialUsers])

  const handlePermissionChange = async (
    userId: string,
    canComment: boolean,
  ) => {
    if (!user) return

    const response = await fetch('/api/admin/update-user-permission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, can_comment: canComment }), // canComment -> can_comment로 키 이름 주의 (API 스펙에 맞춤)
    })

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, can_comment: canComment } : u,
        ),
      )
      toast.success(t('Permission updated successfully.')) 
    } else {
      toast.error(t('Error updating permission.')) 
    }
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const response = await fetch('/api/admin/update-user-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    })

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      )
      toast.success(t('User role updated successfully.')) 
    } else {
      const error = await response.json()
      toast.error(
        `${t('Error updating user role')}: ${error.error || t('Unknown error')}`, 
      )
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete || !password) return

    const response = await fetch('/api/admin/delete-user', { // 경로 앞에 /api가 빠져있을 수 있어 확인 필요
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userToDelete.id, password }),
    })

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== userToDelete.id),
      )
      toast.success(t('User deleted successfully.')) 
      setUserToDelete(null)
      setPassword('')
    } else {
      const error = await response.json()
      toast.error(
        `${t('Error deleting user')}: ${error.error || t('Unknown error')}`, 
      )
    }
  }

  if (loading) {
    return <div>{t('Loading...')}</div> 
  }

  const filteredUsers = users.filter((u) => u.id !== user?.id)

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{t('User Management')}</h1>
      <h2 className="text-xl font-semibold">{t('All Users')}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('Email')}</TableHead>
            <TableHead>{t('Role')}</TableHead>
            <TableHead>{t('Can Comment')}</TableHead>
            <TableHead>{t('Change Role')}</TableHead>
            <TableHead>{t('Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Switch
                  checked={user.can_comment ?? false}
                  onCheckedChange={(checked) =>
                    handlePermissionChange(user.id, checked)
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={user.role || 'user'}
                  onValueChange={(newRole) =>
                    handleRoleChange(user.id, newRole as UserRole)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder={t('Select role')} /> 
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t('Administrator')}</SelectItem> 
                    <SelectItem value="user">{t('User')}</SelectItem> 
                    <SelectItem value="child">{t('Child')}</SelectItem> 
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setUserToDelete(user)}
                    >
                      {t('Delete User')} 
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle> 
                      <AlertDialogDescription>
                        {t("User '")}
                        <strong>{user.email}</strong>
                        {t("' will be permanently deleted. This action cannot be undone.")}
                        <br />
                        <br />
                        {t('Please enter the admin password to confirm.')} 
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('Admin Password')} 
                      className="mt-2 rounded border p-2 w-full"
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                        {t('Cancel')} 
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteUser}>
                        {t('Confirm Delete')} 
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
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

interface AdminUsersClientProps {}

export default function AdminUsersClient({}: AdminUsersClientProps) {
  const { t } = useLanguage() // t 함수 가져오기
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(t('Error fetching users.')) 
      } else {
        setUsers(data || [])
      }
      setLoading(false)
    }

    fetchUsers()
  }, [t])

  const handlePermissionChange = async (
    userId: string,
    canComment: boolean,
  ) => {
    if (!user) return

    const response = await fetch('/api/admin/update-user-permission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, canComment }),
    })

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, can_comment: canComment } : u,
        ),
      )
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.success(t('Permission updated successfully.')) 
    } else {
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
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
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.success(t('User role updated successfully.')) 
    } else {
      const error = await response.json()
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.error(
        `${t('Error updating user role')}: ${error.error || t('Unknown error')}`, 
      )
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete || !password) return

    const response = await fetch('/admin/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userToDelete.id, password }),
    })

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== userToDelete.id),
      )
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.success(t('User deleted successfully.')) 
      setUserToDelete(null)
      setPassword('')
    } else {
      const error = await response.json()
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.error(
        `${t('Error deleting user')}: ${error.error || t('Unknown error')}`, 
      )
    }
  }

  if (loading) {
     // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
    return <div>{t('Loading...')}</div> 
  }

  const filteredUsers = users.filter((u) => u.id !== user?.id)

  return (
    <div>
       {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
      <h1 className="mb-4 text-2xl font-bold">{t('User Management')}</h1>
      <h2 className="text-xl font-semibold">{t('All Users')}</h2>
      <Table>
        <TableHeader>
          <TableRow>
             {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
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
                  value={user.role}
                  onValueChange={(newRole) =>
                    handleRoleChange(user.id, newRole as UserRole)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                     {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                    <SelectValue placeholder={t('Select role')} /> 
                  </SelectTrigger>
                  <SelectContent>
                     {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
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
                       {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                      {t('Delete User')} 
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                       {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                      <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle> 
                      <AlertDialogDescription>
                         {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                        {t("User '")}
                        <strong>{user.email}</strong>
                        {t("' will be permanently deleted. This action cannot be undone.")}
                        <br />
                        <br />
                         {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                        {t('Please enter the admin password to confirm.')} 
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
                      placeholder={t('Admin Password')} 
                      className="mt-2 rounded border p-2"
                    />
                    <AlertDialogFooter>
                       {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                      <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                        {t('Cancel')} 
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteUser}>
                         {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
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
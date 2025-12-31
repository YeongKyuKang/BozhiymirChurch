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
import { Filter, Trash2 } from 'lucide-react'

type UserProfile = Database['public']['Tables']['users']['Row']
type UserRole = UserProfile['role']

interface AdminUsersClientProps {
  initialUsers: UserProfile[]
}

export default function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const { t } = useLanguage()
  const [users, setUsers] = useState<UserProfile[]>(initialUsers || [])
  const [loading, setLoading] = useState(initialUsers ? false : true)
  
  // 필터 상태 관리
  const [roleFilter, setRoleFilter] = useState<string>('all') // all, admin, user, guest, child
  const [commentFilter, setCommentFilter] = useState<string>('all') // all, allowed, blocked

  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (initialUsers && initialUsers.length > 0) {
        setUsers(initialUsers);
        return;
    }

    const fetchUsers = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        toast.error(t('admin.users.fetch_error') || 'Error fetching users.') 
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
      body: JSON.stringify({ userId, can_comment: canComment }),
    })

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, can_comment: canComment } : u,
        ),
      )
      toast.success(t('admin.users.permission_updated') || 'Permission updated successfully.') 
    } else {
      const err = await response.json();
      toast.error((t('admin.users.permission_error') || 'Error updating permission.') + (err.error ? `: ${err.error}` : '')) 
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
      toast.success(t('admin.users.role_updated') || 'User role updated successfully.') 
    } else {
      const error = await response.json()
      toast.error(
        `${t('admin.users.role_error') || 'Error updating user role'}: ${error.error || t('common.unknown_error')}`, 
      )
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete || !password) return

    const response = await fetch('/api/admin/delete-user', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userToDelete.id, password }),
    })

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== userToDelete.id),
      )
      toast.success(t('admin.users.deleted') || 'User deleted successfully.') 
      setUserToDelete(null)
      setPassword('')
    } else {
      const error = await response.json()
      toast.error(
        `${t('admin.users.delete_error') || 'Error deleting user'}: ${error.error || t('common.unknown_error')}`, 
      )
    }
  }

  if (loading) {
    return <div>{t('common.loading') || 'Loading...'}</div> 
  }

  // 필터링 로직
  const filteredUsers = users.filter((u) => {
    if (u.id === user?.id) return false;

    const roleMatch = roleFilter === 'all' || u.role === roleFilter;
    
    let commentMatch = true;
    if (commentFilter === 'allowed') commentMatch = u.can_comment === true;
    if (commentFilter === 'blocked') commentMatch = u.can_comment === false; 

    return roleMatch && commentMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold">{t('admin.users.title') || 'User Management'}</h1>
            <h2 className="text-sm text-gray-500">{t('admin.users.subtitle_all') || 'All Users'}: {filteredUsers.length} / {users.length}</h2>
        </div>
        
        {/* 필터링 UI */}
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border">
                <Filter className="w-4 h-4 ml-2 text-gray-400" />
                
                {/* Role Filter */}
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[130px] border-0 focus:ring-0 h-8 text-xs">
                        {/* [수정] Placeholder 번역 */}
                        <SelectValue placeholder={t('admin.users.filter.role_placeholder') || "Role"} />
                    </SelectTrigger>
                    <SelectContent>
                        {/* [수정] 옵션 텍스트 번역 */}
                        <SelectItem value="all">{t('admin.users.filter.all_roles') || "All Roles"}</SelectItem>
                        <SelectItem value="admin">{t('admin.role.admin') || "Admin"}</SelectItem>
                        <SelectItem value="user">{t('admin.role.user') || "User"}</SelectItem>
                        <SelectItem value="guest">{t('admin.role.guest') || "Guest"}</SelectItem>
                        <SelectItem value="child">{t('admin.role.child') || "Child"}</SelectItem>
                    </SelectContent>
                </Select>

                <div className="w-px h-4 bg-gray-200"></div>

                {/* Comment Filter */}
                <Select value={commentFilter} onValueChange={setCommentFilter}>
                    <SelectTrigger className="w-[140px] border-0 focus:ring-0 h-8 text-xs">
                         {/* [수정] Placeholder 번역 */}
                        <SelectValue placeholder={t('admin.users.filter.permission_placeholder') || "Permission"} />
                    </SelectTrigger>
                    <SelectContent>
                        {/* [수정] 옵션 텍스트 번역 */}
                        <SelectItem value="all">{t('admin.users.filter.all_permissions') || "All Permissions"}</SelectItem>
                        <SelectItem value="allowed">{t('admin.users.filter.allowed') || "Can Comment"}</SelectItem>
                        <SelectItem value="blocked">{t('admin.users.filter.blocked') || "Blocked"}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>{t('login.label_email') || 'Email'}</TableHead>
                <TableHead>{t('admin.users.col_role') || 'Role'}</TableHead>
                <TableHead>{t('admin.users.col_comment') || 'Can Comment'}</TableHead>
                <TableHead>{t('admin.users.col_change_role') || 'Change Role'}</TableHead>
                <TableHead>{t('admin.users.col_actions') || 'Actions'}</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {filteredUsers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        {/* [수정] 빈 결과 메시지 번역 */}
                        {t('admin.users.filter.no_results') || "No users found matching filters."}
                    </TableCell>
                </TableRow>
            ) : (
                filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell>
                        <div className="flex flex-col">
                            <span>{user.email}</span>
                            <span className="text-xs text-gray-400">{user.nickname}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'user' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {user.role}
                        </span>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Switch
                            checked={user.can_comment ?? false}
                            onCheckedChange={(checked) =>
                                handlePermissionChange(user.id, checked)
                            }
                            />
                            <span className="text-xs text-gray-400 w-12">
                                {/* [수정] 상태 텍스트 번역 */}
                                {user.can_comment 
                                  ? (t('admin.users.status_allowed') || 'Allowed') 
                                  : (t('admin.users.status_blocked') || 'Blocked')}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Select
                        value={user.role || 'user'}
                        onValueChange={(newRole) =>
                            handleRoleChange(user.id, newRole as UserRole)
                        }
                        >
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder={t('admin.users.select_role') || 'Select role'} /> 
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">{t('admin.role.admin') || 'Administrator'}</SelectItem> 
                            <SelectItem value="user">{t('admin.role.user') || 'User'}</SelectItem> 
                            <SelectItem value="child">{t('admin.role.child') || 'Child'}</SelectItem> 
                            <SelectItem value="guest">{t('admin.role.guest') || 'Guest'}</SelectItem> 
                        </SelectContent>
                        </Select>
                    </TableCell>
                    <TableCell>
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setUserToDelete(user)}
                            >
                            <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('common.confirm_title') || 'Are you sure?'}</AlertDialogTitle> 
                            <AlertDialogDescription>
                                {t("admin.users.delete_confirm_prefix") || "User '"}
                                <strong>{user.email}</strong>
                                {t("admin.users.delete_confirm_suffix") || "' will be permanently deleted. This action cannot be undone."}
                                <br />
                                <br />
                                {t('admin.users.enter_admin_pw') || 'Please enter the admin password to confirm.'} 
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('admin.users.admin_pw_placeholder') || 'Admin Password'} 
                            className="mt-2 rounded border p-2 w-full"
                            />
                            <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                                {t('common.cancel') || 'Cancel'} 
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteUser}>
                                {t('common.delete') || 'Confirm Delete'} 
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                    </TableRow>
                ))
            )}
            </TableBody>
        </Table>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context' // useLanguage 임포트
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminSettingsPage() {
  const { session, userProfile, loading } = useAuth()
  const { t } = useLanguage() // t 함수 가져오기
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 접근 제어
  useEffect(() => {
    if (!loading && !session) {
      redirect('/login')
    }
  }, [session, loading])

  if (loading || !userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
         {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
        <p>{t('Loading...')}</p>
      </div>
    )
  }

  if (userProfile.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
         {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
        <p>{t('Access Denied. Only administrators can access this page.')}</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.error(t('New passwords do not match.'))
      return
    }
    if (newPassword.length < 6) {
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.error(t('Password must be at least 6 characters long.'))
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/admin/set-admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const result = await response.json()

      if (response.ok) {
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.success(t('Admin password changed successfully.'))
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(`${t('Error changing password')}: ${result.error}`)
      }
    } catch (error) {
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.error(t('An unexpected error occurred.'))
      console.error('Error setting admin password:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
           {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
          <CardTitle>{t('Admin Settings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
               {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
              <Label htmlFor="currentPassword">{t('Current Password')}</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
               {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
              <Label htmlFor="newPassword">{t('New Password')}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
               {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
              <Label htmlFor="confirmPassword">{t('Confirm New Password')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
             {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('Changing...') : t('Change Password')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
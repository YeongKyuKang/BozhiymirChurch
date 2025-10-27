'use client'

import WordPostsClient from './word-posts-client'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminWordPostsPage() {
  const { session, userProfile, loading } = useAuth()
  const { t } = useLanguage()

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

  return (
    <div className="container mx-auto p-4">
      <WordPostsClient />
    </div>
  )
}
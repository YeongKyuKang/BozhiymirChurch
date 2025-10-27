'use client'

import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context' // 1. useLanguage 훅 임포트
import Link from 'next/link'

export default function AdminPage() {
  const { userProfile } = useAuth()
  const { t } = useLanguage() // 2. t 함수 초기화

  if (!userProfile || userProfile.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t('admin.accessDenied')}</p> {/* 3. 번역 적용 */}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">{t('admin.dashboard.title')}</h1> {/* 3. 번역 적용 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/users"
          className="rounded-lg bg-gray-100 p-4 hover:bg-gray-200"
        >
          <h2 className="text-xl font-semibold">
            {t('admin.dashboard.userManagement.title')} {/* 3. 번역 적용 */}
          </h2>
          <p>{t('admin.dashboard.userManagement.description')}</p> {/* 3. 번역 적용 */}
        </Link>
        <Link
          href="/admin/events"
          className="rounded-lg bg-gray-100 p-4 hover:bg-gray-200"
        >
          <h2 className="text-xl font-semibold">
            {t('admin.dashboard.eventManagement.title')} {/* 3. 번역 적용 */}
          </h2>
          <p>{t('admin.dashboard.eventManagement.description')}</p> {/* 3. 번역 적용 */}
        </Link>
        <Link
          href="/admin/word-posts"
          className="rounded-lg bg-gray-100 p-4 hover:bg-gray-200"
        >
          <h2 className="text-xl font-semibold">
            {t('admin.dashboard.wordPostManagement.title')} {/* 3. 번역 적용 */}
          </h2>
          <p>{t('admin.dashboard.wordPostManagement.description')}</p> {/* 3. 번역 적용 */}
        </Link>
        <Link
          href="/admin/contact-forms"
          className="rounded-lg bg-gray-100 p-4 hover:bg-gray-200"
        >
          <h2 className="text-xl font-semibold">
            {t('admin.dashboard.contactForms.title')} {/* 3. 번역 적용 */}
          </h2>
          <p>{t('admin.dashboard.contactForms.description')}</p> {/* 3. 번역 적용 */}
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-lg bg-gray-100 p-4 hover:bg-gray-200"
        >
          <h2 className="text-xl font-semibold">
            {t('admin.dashboard.adminSettings.title')} {/* 3. 번역 적용 */}
          </h2>
          <p>{t('admin.dashboard.adminSettings.description')}</p> {/* 3. 번역 적용 */}
        </Link>
        <Link
          href="/admin/content-edit"
          className="rounded-lg bg-gray-100 p-4 hover:bg-gray-200"
        >
          <h2 className="text-xl font-semibold">
            {t('admin.dashboard.contentEdit.title')} {/* 3. 번역 적용 */}
          </h2>
          <p>{t('admin.dashboard.contentEdit.description')}</p> {/* 3. 번역 적용 */}
        </Link>
      </div>
    </div>
  )
}
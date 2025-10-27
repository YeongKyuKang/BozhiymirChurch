'use client'

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context' // 1. useLanguage 임포트

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth() // ★ 이전에 signInWithPassword로 바꿨던 것을 다시 signIn으로 수정
  const { t } = useLanguage() // 2. t 함수 가져오기
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !password) {
      // 3. 번역 키를 실제 영어 텍스트로 변경
      setError(t('Email and password are required')) 
      setLoading(false)
      return
    }

    const { error: signInError } = await signIn(email, password) // ★ signIn 사용

    if (signInError) {
      // Supabase 오류 메시지는 (주로 영어이므로) 번역하지 않음
      setError(signInError.message) 
    } else {
      router.push('/') // 로그인 성공 시 홈으로 리디렉션
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
            <Card className="w-full max-w-sm">
              <CardHeader className="text-center">
                 {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                <CardTitle className="text-2xl font-bold text-gray-900">{t('Welcome Back')}</CardTitle>
                <CardDescription>{t('Sign in to your Bozhiymir Church account')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                     {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                    <Label htmlFor="email">{t('Email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                       // 3. 번역 키를 실제 영어 텍스트로 변경
                      placeholder={t('Enter your email')}
                    />
                  </div>
                  <div className="space-y-2">
                     {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                    <Label htmlFor="password">{t('Password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                       // 3. 번역 키를 실제 영어 텍스트로 변경
                      placeholder={t('Enter your password')}
                    />
                  </div>
                   {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('Signing In...') : t('Sign In')}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                     {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                    {t("Don't have an account?")}{' '}
                    <Link
                      href="/register"
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      {t('Sign up')}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
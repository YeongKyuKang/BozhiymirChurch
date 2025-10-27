'use client'

import type React from 'react'
import { useState, useRef } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Upload } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context' // 1. useLanguage 임포트
import imageCompression from 'browser-image-compression'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { signUp } = useAuth()
  const { t } = useLanguage() // 2. t 함수 가져오기
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 3. 번역 키를 실제 영어 텍스트로 변경
        setError(t('Profile picture must be less than 5MB')) 
        return
      }

      if (!file.type.startsWith('image/')) {
         // 3. 번역 키를 실제 영어 텍스트로 변경
        setError(t('Please select a valid image file'))
        return
      }

      setError('')

      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        }
        const compressedFile = await imageCompression(file, options)

        setProfilePicture(compressedFile)
        const reader = new FileReader()
        reader.onload = (e) => {
          setProfilePicturePreview(e.target?.result as string)
        }
        reader.readAsDataURL(compressedFile)
      } catch (compressionError) {
         // 3. 번역 키를 실제 영어 텍스트로 변경
        setError(t('Failed to compress the image. Please try another file.'))
        console.error(compressionError)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (!nickname.trim()) {
       // 3. 번역 키를 실제 영어 텍스트로 변경
      setError(t('Nickname is required'))
      setLoading(false)
      return
    }

    if (nickname.length < 2) {
       // 3. 번역 키를 실제 영어 텍스트로 변경
      setError(t('Nickname must be at least 2 characters long'))
      setLoading(false)
      return
    }

    if (!gender) {
       // 3. 번역 키를 실제 영어 텍스트로 변경
      setError(t('Please select your gender'))
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
       // 3. 번역 키를 실제 영어 텍스트로 변경
      setError(t('Passwords do not match'))
      setLoading(false)
      return
    }

    if (password.length < 6) {
       // 3. 번역 키를 실제 영어 텍스트로 변경
      setError(t('Password must be at least 6 characters long'))
      setLoading(false)
      return
    }

    const { error: signUpError } = await signUp(email, password, nickname, gender)

    if (signUpError) {
      // Supabase 오류 메시지 (영어)는 그대로 표시
      setError(signUpError.message)
    } else {
       // 3. 번역 키를 실제 영어 텍스트로 변경
      setSuccess(t('Registration successful! Please check your email to verify your account.'))
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }

    setLoading(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                 {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                <CardTitle className="text-2xl font-bold text-gray-900">{t('Join Our Community')}</CardTitle>
                <CardDescription>{t('Create your Bozhiymir Church account')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  {/* Profile Picture Upload */}
                  <div className="space-y-2">
                     {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                    <Label>{t('Profile Picture (Optional)')}</Label>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage
                            src={profilePicturePreview || '/placeholder.svg'}
                          />
                          <AvatarFallback className="text-lg">
                            {nickname ? (
                              getInitials(nickname)
                            ) : (
                              <Camera className="w-8 h-8" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                      <p className="text-xs text-gray-500 text-center">
                        {t('Click the upload button to add a profile picture')}
                        <br />
                        {t('(Max 5MB, JPG/PNG only)')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                     {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                    <Label htmlFor="nickname">{t('Nickname')} *</Label>
                    <Input
                      id="nickname"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                       // 3. 번역 키를 실제 영어 텍스트로 변경
                      placeholder={t('Enter your preferred nickname')}
                      maxLength={50}
                    />
                     {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                    <p className="text-xs text-gray-500">{t('This is how other members will see you')}</p>
                  </div>

                  <div className="space-y-2">
                     {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                    <Label htmlFor="gender">{t('Gender')} *</Label>
                    <Select
                      value={gender}
                      onValueChange={(value) =>
                        setGender(value as 'male' | 'female')
                      }
                      required
                    >
                      <SelectTrigger>
                         {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                        <SelectValue placeholder={t('Select your gender')} />
                      </SelectTrigger>
                      <SelectContent>
                         {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                        <SelectItem value="male">{t('Male')}</SelectItem>
                        <SelectItem value="female">{t('Female')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Registration code 입력 필드 제거됨 */}

                  <div className="space-y-2">
                     {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                    <Label htmlFor="email">{t('Email')} *</Label>
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
                    <Label htmlFor="password">{t('Password')} *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                       // 3. 번역 키를 실제 영어 텍스트로 변경
                      placeholder={t('Enter your password')}
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                     {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                    <Label htmlFor="confirmPassword">{t('Confirm Password')} *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                       // 3. 번역 키를 실제 영어 텍스트로 변경
                      placeholder={t('Confirm your password')}
                    />
                  </div>
                   {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('Creating Account...') : t('Create Account')}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                     {/* 3. 번역 키를 실제 영어 텍스트로 변경 */}
                    {t('Already have an account?')}{' '}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      {t('Sign in')}
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
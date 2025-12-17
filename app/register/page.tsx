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
import { useLanguage } from '@/contexts/language-context'
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
  const { t } = useLanguage()
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t('register.error_file_size')) 
        return
      }

      if (!file.type.startsWith('image/')) {
        setError(t('register.error_invalid_image'))
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
        setError(t('register.error_compression'))
        console.error(compressionError)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!nickname.trim()) {
      setError(t('register.error_nickname_required'))
      setLoading(false)
      return
    }

    if (nickname.length < 2) {
      setError(t('register.error_nickname_length'))
      setLoading(false)
      return
    }

    if (!gender) {
      setError(t('register.error_gender_required'))
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError(t('register.error_password_match'))
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError(t('register.error_password_length'))
      setLoading(false)
      return
    }

    const { error: signUpError } = await signUp(email, password, nickname, gender)

    if (signUpError) {
      setError(signUpError.message)
    } else {
      setSuccess(t('register.success_registration'))
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
                <CardTitle className="text-2xl font-bold text-gray-900">{t('register.title')}</CardTitle>
                <CardDescription>{t('register.description')}</CardDescription>
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

                  <div className="space-y-2">
                    <Label>{t('register.label_profile_picture')}</Label>
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
                      <p className="text-xs text-gray-500 text-center">
                        {t('register.text_upload_instruction')}
                        <br />
                        {t('register.text_upload_limits')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nickname">{t('register.label_nickname')} *</Label>
                    <Input
                      id="nickname"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                      placeholder={t('register.placeholder_nickname')}
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500">{t('register.text_nickname_hint')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">{t('register.label_gender')} *</Label>
                    <Select
                      value={gender}
                      onValueChange={(value) =>
                        setGender(value as 'male' | 'female')
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('register.placeholder_gender')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('register.gender_male')}</SelectItem>
                        <SelectItem value="female">{t('register.gender_female')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('register.label_email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={t('register.placeholder_email')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('register.label_password')} *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={t('register.placeholder_password')}
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('register.label_confirm_password')} *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder={t('register.placeholder_confirm_password')}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('register.btn_creating_account') : t('register.btn_create_account')}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    {t('register.text_already_have_account')}{' '}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      {t('register.link_sign_in')}
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
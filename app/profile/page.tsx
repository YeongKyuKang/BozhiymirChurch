"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Edit, Save, X } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
// Import the image compression library
import imageCompression from "browser-image-compression"

export default function ProfilePage() {
  const { user, userProfile, userRole, loading, updateUserProfile, uploadProfilePicture } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    nickname: "",
    gender: "",
  })
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("")
  const [updateLoading, setUpdateLoading] = useState(false)
  // New state to indicate compression is in progress
  const [isCompressing, setIsCompressing] = useState(false) 
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    if (userProfile) {
      setEditData({
        nickname: userProfile.nickname || "",
        gender: userProfile.gender || "",
      })
    }
  }, [user, loading, router, userProfile])

  // Modified function to compress the image before setting it to state
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      // Set loading state for compression
      setIsCompressing(true)
      setError("")
      
      try {
        // Set compression options: target size 500KB and max width 1024px
        const options = {
          maxSizeMB: 0.5, // (0.5MB = 500KB)
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        }
        const compressedFile = await imageCompression(file, options)

        // The file size check is now less strict, as we are compressing it
        if (compressedFile.size > 5 * 1024 * 1024) { 
            setError("Profile picture is too large even after compression.")
            return
        }

        console.log('original file size', file.size, 'compressed file size', compressedFile.size) // For debugging
        
        setProfilePicture(compressedFile)
        const reader = new FileReader()
        reader.onload = (e) => {
          setProfilePicturePreview(e.target?.result as string)
        }
        reader.readAsDataURL(compressedFile)
        
      } catch (compressionError) {
        setError("Failed to compress the image. Please try another file.")
        console.error(compressionError)
      } finally {
        // Unset loading state
        setIsCompressing(false)
      }
    }
  }

  const handleSave = async () => {
    setUpdateLoading(true)
    setError("")
    setMessage("")

    try {
      // Upload profile picture if selected
      if (profilePicture) {
        const { error: uploadError } = await uploadProfilePicture(profilePicture)
        if (uploadError) {
          setError("Failed to upload profile picture: " + uploadError.message)
          setUpdateLoading(false)
          return
        }
      }

      // Update profile data
      const { error: updateError } = await updateUserProfile({
        nickname: editData.nickname || null,
        gender: (editData.gender as any) || null,
      })

      if (updateError) {
        setError("Failed to update profile: " + updateError.message)
      } else {
        setMessage("Profile updated successfully!")
        setIsEditing(false)
        setProfilePicture(null)
        setProfilePicturePreview("")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    }

    setUpdateLoading(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      nickname: userProfile?.nickname || "",
      gender: userProfile?.gender || "",
    })
    setProfilePicture(null)
    setProfilePicturePreview("")
    setError("")
    setMessage("")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getGenderDisplay = (gender: string | null) => {
    switch (gender) {
      case "male":
        return "Male"
      case "female":
        return "Female"
      default:
        return "Not specified"
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || !userProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Profile</CardTitle>
                    <CardDescription>Your Bozhiymir Church account information</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profilePicturePreview || userProfile.profile_picture_url || ""} />
                      <AvatarFallback className="text-2xl">
                        {userProfile.nickname ? (
                          getInitials(userProfile.nickname)
                        ) : user.email ? (
                          getInitials(user.email)
                        ) : (
                          <Camera className="w-12 h-12" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isCompressing} // Disable button while compressing
                      >
                        {isCompressing ? (
                          <div className="w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isCompressing} // Disable input while compressing
                      />
                      <p className="text-xs text-gray-500 text-center">
                        Click the camera icon to change your profile picture
                        {isCompressing && " (Compressing...)"}
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Nickname</label>
                      {isEditing ? (
                        <Input
                          value={editData.nickname}
                          onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
                          placeholder="Enter your nickname"
                          maxLength={50}
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile.nickname || "Not set"}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      {isEditing ? (
                        <Select
                          value={editData.gender}
                          onValueChange={(value) => setEditData({ ...editData, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-gray-900">{getGenderDisplay(userProfile.gender)}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <div className="mt-1">
                        <Badge variant={userRole === "admin" ? "default" : "secondary"}>
                          {userRole === "admin" ? "Administrator" : "Member"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500">Member Since</label>
                      <p className="text-gray-900">{new Date(userProfile.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button onClick={handleSave} disabled={updateLoading || isCompressing}>
                      <Save className="w-4 h-4 mr-2" />
                      {updateLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" disabled={isCompressing}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}

                {userRole === "admin" && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Access</h3>
                    <p className="text-gray-600 mb-4">
                      You have administrator privileges and can manage website content.
                    </p>
                    <a
                      href="/admin"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Go to Admin Panel
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
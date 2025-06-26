"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ProfilePage() {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
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
                <CardTitle className="text-2xl font-bold text-gray-900">Profile</CardTitle>
                <CardDescription>Your Bozhiymir Church account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{user.email}</p>
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
                      <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

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

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bozhiymir Church - Welcome to Our Community",
  description:
    "A welcoming community in Portland where families grow together in faith and fellowship. Supporting Ukrainian children with love and hope.",
  keywords: "church, bozhiymir, worship, community, faith, events, kids, family, ukrainian, portland",
  authors: [{ name: "Bozhiymir Church" }],
  generator: "v0.dev",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Suspense>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

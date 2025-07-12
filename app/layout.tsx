import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next" // Vercel 애널리틱스 컴포넌트
import { Suspense } from "react" // Suspense 임포트

import "./globals.css"

// AuthProvider를 import 하는 라인이 누락되어 있었습니다. 다시 추가합니다.
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

// Next.js 14의 메타데이터 권장 사항에 따라 'metadata' 객체를 수정합니다.
// 'viewport'와 'themeColor'는 'metadata'에서 제거하고 별도의 'viewport' 객체로 분리합니다.
export const metadata: Metadata = {
  title: "Bozhiymir Church - Welcome to Our Community",
  description:
    "A welcoming community in Poland where families grow together in faith and fellowship. Supporting Ukrainian children with love and hope.",
  keywords: "church, bozhiymir, worship, community, faith, events, kids, family, ukrainian, Poland",
  authors: [{ name: "Bozhiymir Church" }],
  generator: 'v0.dev'
}

// 'viewport'와 'themeColor'를 별도의 'export const viewport' 객체로 분리하여 추가합니다.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA 관련 링크 및 메타 태그는 계속 주석 처리합니다. */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
        {/* <meta name="apple-mobile-web-app-capable" content="yes" /> */}
        {/* <meta name="apple-mobile-web-app-status-bar-style" content="default" /> */}
        {/* <meta name="apple-mobile-web-app-title" content="Bozhiymir Church" /> */}
      </head>
      <body className={inter.className}>
        {/* AuthContext를 모든 하위 컴포넌트에 제공하기 위해
          <AuthProvider>로 children과 Analytics 컴포넌트를 감쌉니다.
          이렇게 해야 useAuth() 훅이 정상적으로 동작합니다.
        */}
        <AuthProvider>
          {/* useSearchParams 오류 해결을 위해 Suspense로 children을 감쌉니다. */}
          <Suspense fallback={<div>로딩 중...</div>}>
            {children}
          </Suspense>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}

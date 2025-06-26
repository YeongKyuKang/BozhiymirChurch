import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next" // Vercel 애널리틱스 컴포넌트
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// Next.js 14의 메타데이터 권장 사항에 따라 'metadata' 객체를 수정합니다.
// 'viewport'와 'themeColor'는 'metadata'에서 제거하고 별도의 'viewport' 객체로 분리합니다.
export const metadata: Metadata = {
  title: "Bozhiymir Church - Welcome to Our Community",
  description:
    "A welcoming community in Portland where families grow together in faith and fellowship. Supporting Ukrainian children with love and hope.",
  keywords: "church, bozhiymir, worship, community, faith, events, kids, family, ukrainian, portland",
  authors: [{ name: "Bozhiymir Church" }],
  generator: 'v0.dev'
}

// 'viewport'와 'themeColor'를 별도의 'export const viewport' 객체로 분리하여 추가합니다.
// 이는 Next.js 14에서 권장하는 메타데이터 설정 방식입니다.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // 사용자가 확대/축소하지 못하게 하려면 이 라인을 유지합니다.
  themeColor: '#2563eb', // themeColor도 viewport 객체 안에 포함됩니다.
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        PWA (Progressive Web App) 기능과 관련된 <head> 태그들을 제거했습니다.
        이전 로그에서 manifest.json 및 icon-192x192.png 파일이 없어서 404 오류가 발생했기 때문입니다.
        만약 PWA 기능을 나중에 추가할 계획이라면,
        public 폴더에 해당 파일들을 직접 생성한 후 이 태그들을 다시 추가할 수 있습니다.
      */}
      <head>
        {/* <link rel="icon" href="/favicon.ico" sizes="any" /> // 웹사이트 파비콘은 여기에 추가할 수 있습니다. */}
      </head>
      <body className={inter.className}>
        {children}
        <Analytics /> {/* Vercel 애널리틱스 컴포넌트는 body 태그 안에 그대로 유지합니다. */}
      </body>
    </html>
  )
}
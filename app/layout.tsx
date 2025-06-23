import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Boshmir Church - Welcome to Our Community",
  description:
    "A welcoming community where families grow together in faith and fellowship. Stay updated with our latest events, announcements, and activities.",
  keywords: "church, boshmir, worship, community, faith, events, kids, family",
  authors: [{ name: "Boshmir Church" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Boshmir Church" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

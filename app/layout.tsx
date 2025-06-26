import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bozhiymir Church - Welcome to Our Community",
  description:
    "A welcoming community in Portland where families grow together in faith and fellowship. Supporting Ukrainian children with love and hope.",
  keywords: "church, bozhiymir, worship, community, faith, events, kids, family, ukrainian, portland",
  authors: [{ name: "Bozhiymir Church" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#2563eb",
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
        <meta name="apple-mobile-web-app-title" content="Bozhiymir Church" />
      </head>
      <body 
        className={inter.className}>{children}
        <Analytics />
      </body>
    </html>
  )
}

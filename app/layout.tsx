import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import "./globals.css";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bozhiymir Church",
  description: "A welcoming community in Poland where families grow together in faith and fellowship.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
            <Analytics />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

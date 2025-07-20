// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
  },
  // i18n 설정 추가
  i18n: {
    locales: ['en', 'ko', 'ru'], // 지원하는 모든 언어 추가
    defaultLocale: 'en', // 기본 언어 설정
  },
}

export default nextConfig
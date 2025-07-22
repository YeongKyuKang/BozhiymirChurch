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
        locales: ['en'], // 'en' (영어)만 유일한 지원 로케일로 정의합니다.
        defaultLocale: 'en', // 기본 로케일을 'en'으로 설정합니다.
        localeDetection: false, // 브라우저의 언어 설정에 따른 자동 로케일 감지 및 리디렉션을 비활성화합니다.
    },
}

export default nextConfig
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placeholder.svg'], // 외부 이미지 도메인 허용
    unoptimized: true,
  },
  // Next.js 16에서는 webpackBuildWorker가 기본값이거나 필요 없을 수 있으나, 
  // 유지해도 무방합니다. (혹시 빌드 에러나면 제거하세요)
  experimental: {
    webpackBuildWorker: true,
  },
  
  // ★ 중요: App Router에서는 아래 i18n 설정을 제거해야 합니다.
  // i18n: { ... }  <-- 삭제됨
}

export default nextConfig
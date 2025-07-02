// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 중 편의를 위해 ESLint 및 TypeScript 오류 무시 설정이 있었으나,
  // 프로덕션 빌드 시에는 코드 품질과 안정성을 위해 이 설정을 비활성화하는 것이 좋습니다.
  // 따라서 해당 라인을 제거하거나 false로 설정합니다.
  // eslint: {
  //   ignoreDuringBuilds: false, // false로 변경하거나 라인 제거
  // },
  // typescript: {
  //   ignoreBuildErrors: false, // false로 변경하거나 라인 제거
  // },
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
  // Enable PWA features
  experimental: {
    webpackBuildWorker: true,
  },
}

export default nextConfig
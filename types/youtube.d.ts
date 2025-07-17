// types/youtube.d.ts (New file)

// Window 인터페이스를 확장하여 YouTube IFrame Player API 관련 속성을 추가합니다.
interface Window {
  YT: any; // YT 객체
  onYouTubeIframeAPIReady: (() => void) | undefined; // API 로드 완료 시 호출되는 콜백 함수
}
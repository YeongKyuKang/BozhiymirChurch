"use client";

import { useState, useEffect, useRef } from 'react';

// 홈페이지에 필요한 컴포넌트들을 직접 임포트합니다.
import Header from "@/components/header";
import Footer from "@/components/footer";
import HomePageClient from "@/components/home-page-client";
import { supabase } from "@/lib/supabase";

// --- YouTube 플레이어 컴포넌트 ---
const YouTubePlayer = ({ videoId, onEnd }: { videoId: string; onEnd: () => void }) => {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    console.log("LOG: YouTubePlayer - 컴포넌트 마운트됨. API 로드 시작.");

    // YouTube API 스크립트를 로드하는 함수
    const loadYouTubeAPI = () => {
      // API가 이미 로드되었는지 확인
      if (window.YT && typeof window.YT.Player === 'function') {
        console.log("LOG: YouTubePlayer - API가 이미 로드되어 있어 바로 플레이어 생성.");
        createPlayer();
        return;
      }
      
      const scriptId = 'youtube-iframe-api';
      if (document.getElementById(scriptId)) {
        console.log("LOG: YouTubePlayer - 스크립트 태그는 있지만, API 객체 대기 중.");
        window.onYouTubeIframeAPIReady = createPlayer;
        return;
      }
      
      console.log("LOG: YouTubePlayer - 새로운 API 스크립트 태그 생성.");
      const tag = document.createElement('script');
      tag.id = scriptId;
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = createPlayer; // API가 준비되면 플레이어를 생성하는 전역 콜백 함수
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    };

    // 플레이어를 생성하는 함수
    const createPlayer = () => {
      if (!document.getElementById('player-container')) {
          console.error("LOG: YouTubePlayer - 'player-container'를 찾을 수 없음!");
          return;
      }
      if (playerRef.current) playerRef.current.destroy();
      
      playerRef.current = new window.YT.Player('player-container', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, showinfo: 0, rel: 0, fs: 1, playsinline: 1 },
        events: {
          'onReady': (event: any) => {
            console.log("LOG: YouTubePlayer - 플레이어 준비 완료 (onReady). 음소거 후 재생 시작.");
            event.target.playVideo();
          },
          'onStateChange': (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              console.log("LOG: YouTubePlayer - 영상 재생 종료됨 (onStateChange).");
              onEnd();
            }
          }
        }
      });
       console.log("LOG: YouTubePlayer - 플레이어 생성 완료.");
    };

    loadYouTubeAPI();

    return () => { // 컴포넌트 언마운트 시 정리
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [videoId, onEnd]);

  return <div id="player-container" className="absolute inset-0"></div>;
};


// --- 메인 페이지 컴포넌트 ---
export default function Page() {
  const [view, setView] = useState<'checking' | 'video' | 'home'>('checking');
  const [homePageContent, setHomePageContent] = useState<Record<string, any> | null>(null);
  const effectRan = useRef(false); // StrictMode의 이중 실행을 방지하기 위한 Ref

  console.log(`%c[상태 변경] 현재 뷰: ${view}`, 'color: yellow; font-weight: bold;');

  // 1. 어떤 화면을 보여줄지 결정 (최초 1회만 실행)
  useEffect(() => {
    // 개발 환경의 이중 실행 방지
    if (effectRan.current === true) return;
    effectRan.current = true;

    console.log("%c[최초 실행] 어떤 뷰를 보여줄지 결정합니다.", 'color: lightblue;');
    const today = new Date();
    // 목표 날짜: 2025년 7월 18일
    const isTargetDate = today.getDate() === 18 && today.getMonth() === 6 && today.getFullYear() === 2025;
    
    // --- 로컬 테스트용 ---
    const shouldShowWelcomeVideo = true; 
    // -------------------

    const videoHasBeenPlayed = sessionStorage.getItem('welcomeVideoPlayed');
    console.log(`[정보] 목표일? ${isTargetDate}, 테스트모드? ${shouldShowWelcomeVideo}, 영상 본 적 있나? ${videoHasBeenPlayed}`);

    if (shouldShowWelcomeVideo && !videoHasBeenPlayed) {
      console.log("%c[결정] 'video' 뷰를 보여줍니다.", 'color: lightgreen;');
      setView('video');
      sessionStorage.setItem('welcomeVideoPlayed', 'true');
    } else {
      console.log("%c[결정] 'home' 뷰를 보여줍니다.", 'color: orange;');
      setView('home');
    }
  }, []); // 빈 배열로 최초 1회만 실행되도록 보장

  // 2. 홈페이지를 보여줘야 할 때, 콘텐츠 데이터 가져오기
  useEffect(() => {
    if (view === 'home' && !homePageContent) {
      console.log("%c[데이터 로딩] 'home' 뷰이므로, 홈페이지 콘텐츠 로딩을 시작합니다.", 'color: cyan;');
      const fetchContent = async () => {
        const { data, error } = await supabase.from("content").select("*").eq('page', 'home');
        if (error) {
          console.error("[에러] 콘텐츠 로딩 중 에러 발생:", error);
          setHomePageContent({});
        } else {
          const contentMap: Record<string, any> = {};
          data.forEach(item => {
            if (!contentMap[item.section]) {
              contentMap[item.section] = {};
            }
            contentMap[item.section][item.key] = item.value;
          });
          console.log("%c[데이터 로딩] 홈페이지 콘텐츠 로딩 완료.", 'color: cyan;');
          setHomePageContent(contentMap);
        }
      };
      fetchContent();
    }
  }, [view, homePageContent]);

  // 영상 재생이 끝나면 호출되는 함수
  const handleVideoEnd = () => {
    console.log("%c[이벤트] 영상 재생 종료됨. 'home' 뷰로 전환합니다.", 'color: magenta;');
    setView('home');
  };

  // --- 현재 상태에 따라 적절한 화면을 렌더링 ---
  if (view === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (view === 'video') {
    return (
      <main className="fixed inset-0 bg-black z-[100]">
        {/* ▼▼▼ 여기에 원하시는 YouTube 영상 ID를 넣어주세요. ▼▼▼ */}
        <YouTubePlayer videoId="zfBt4tA3XSA" onEnd={handleVideoEnd} />
      </main>
    );
  }

  if (view === 'home') {
    // homePageContent가 로드될 때까지 로딩 상태를 표시합니다.
    if (!homePageContent) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <p>Loading Homepage...</p>
        </div>
      );
    }
    // homePageContent가 로드되면 홈페이지를 렌더링합니다.
    return (
      <>
        <Header />
        <HomePageClient initialContent={homePageContent} />
        <Footer />
      </>
    );
  }

  return null; // 렌더링할 것이 없는 경우 (도달하지 않아야 함)
}

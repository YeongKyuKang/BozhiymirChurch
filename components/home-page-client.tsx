"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X } from "lucide-react";
import HeroSection from "@/components/hero-section";
import CommunitySection from "@/components/community-section";
import MinistriesShowcase from "@/components/ministries-showcase";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context"; // 1. useLanguage 훅 임포트

export default function HomePageClient() {
    const { userRole } = useAuth();
    const router = useRouter();
    const { t } = useLanguage(); // 2. t 함수 가져오기

    const [isPageEditing, setIsPageEditing] = useState(false);
    const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
    const [isSavingAll, setIsSavingAll] = useState(false);
    const [initialContent, setInitialContent] = useState<Record<string, any> | null>(null);

    // 데이터 로딩 로직 (원본 파일과 동일)
    useEffect(() => {
        const fetchContent = async () => {
            const { data, error } = await supabase.from("content").select("*").eq('page', 'home');
            if (error) {
                console.error("[에러] 콘텐츠 로딩 중 에러 발생:", error);
                setInitialContent({});
            } else {
                const contentMap: Record<string, any> = {};
                data.forEach(item => {
                    if (!contentMap[item.section]) {
                        contentMap[item.section] = {};
                    }
                    contentMap[item.section][item.key] = item.value;
                });
                setInitialContent(contentMap);
            }
        };
        fetchContent();
    }, []);


    const handleContentChange = (section: string, key: string, value: string) => {
        setChangedContent(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] || {}),
                [key]: value
            }
        }));
    };

    const handleSaveAll = async () => {
        setIsSavingAll(true);
        let updateCount = 0;
        let revalidated = false;

        for (const section in changedContent) {
            for (const key in changedContent[section]) {
                const value = changedContent[section][key];
                const { error } = await supabase.from('content').upsert({
                    page: 'home',
                    section: section,
                    key: key,
                    value: value,
                    updated_at: new Date().toISOString()
                });

                if (error) {
                    console.error(`Error updating content for home.${section}.${key}:`, error);
                } else {
                    updateCount++;
                }
            }
        }

        if (updateCount > 0) {
            try {
                const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/`);
                if (!revalidateResponse.ok) {
                    const errorData = await revalidateResponse.json();
                    console.error("Revalidation failed:", errorData.message);
                } else {
                    revalidated = true;
                    console.log("Homepage revalidated successfully!");
                }
            } catch (err) {
                console.error("Failed to call revalidate API:", err);
            }
        }

        setChangedContent({});
        setIsPageEditing(false);
        setIsSavingAll(false);

        // 3. alert 텍스트에 t() 함수 적용
        if (updateCount > 0 && revalidated) {
            alert(t("Homepage has been updated. Please refresh to see changes."));
        } else if (updateCount > 0 && !revalidated) {
            alert(t("Content saved, but page revalidation failed. Manual refresh may be needed."));
        } else {
            alert(t("No changes were saved or saving failed."));
        }
    };

    const handleCancelAll = () => {
         // 3. confirm 텍스트에 t() 함수 적용
        if (confirm(t("Are you sure you want to cancel all changes?"))) {
            setChangedContent({});
            setIsPageEditing(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* 전역 편집 모드 버튼 (원본 파일과 동일) */}
            {userRole === 'admin' && (
                <div className="fixed top-24 right-8 z-50 flex flex-col space-y-2">
                    {!isPageEditing ? (
                        <Button variant="outline" size="icon" onClick={() => setIsPageEditing(true)}>
                            <Settings className="h-5 w-5" />
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" size="icon" onClick={handleSaveAll} disabled={isSavingAll}>
                                {isSavingAll ? <span className="animate-spin text-blue-500">🔄</span> : <Save className="h-5 w-5 text-green-600" />}
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleCancelAll} disabled={isSavingAll}>
                                <X className="h-5 w-5 text-red-600" />
                            </Button>
                        </>
                    )}
                </div>
            )}

            {/* 하위 섹션 컴포넌트 호출 (원본 파일과 동일, initialContent가 null일 때를 대비해 || {} 추가) */}
            <HeroSection
                heroContent={initialContent?.hero || {}}
                isEditingPage={isPageEditing}
                onContentChange={handleContentChange}
            />
            <CommunitySection
                initialContent={initialContent || {}}
                isEditingPage={isPageEditing}
                onContentChange={handleContentChange}
            />
            <MinistriesShowcase
                initialContent={initialContent || {}}
                isEditingPage={isPageEditing}
                onContentChange={handleContentChange}
            />
        </div>
    );
}
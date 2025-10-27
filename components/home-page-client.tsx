"use client";

import * as React from "react";
import { useState, useEffect } from "react";
// ★ 1. userRole 대신 userProfile을 가져옵니다. ★
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X } from "lucide-react";
import HeroSection from "@/components/hero-section";
import CommunitySection from "@/components/community-section";
import MinistriesShowcase from "@/components/ministries-showcase";
import { useLanguage } from "@/contexts/language-context"; // 번역 기능은 유지

export default function HomePageClient() {
    // ★ 1. userRole 대신 userProfile 사용 ★
    const { userProfile } = useAuth();
    // const router = useRouter(); // ★ 2. router 제거 ★
    const { t } = useLanguage(); // 번역 함수 가져오기

    const [isPageEditing, setIsPageEditing] = useState(false);
    const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
    const [isSavingAll, setIsSavingAll] = useState(false);
    const [initialContent, setInitialContent] = useState<Record<string, any> | null>(null);

    // 데이터 로딩 로직 (롤백된 원본 코드와 동일)
    useEffect(() => {
        const fetchContent = async () => {
            const { data, error } = await supabase.from("content").select("*").eq('page', 'home');
            if (error) {
                console.error("[Error] Fetching content failed:", error);
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
        const secretToken = process.env.NEXT_PUBLIC_MY_SECRET_TOKEN;

        if (!secretToken) {
            console.error("Revalidation secret token is not defined!");
            alert(t("Configuration error: Cannot revalidate page. Please contact support."));
            setIsSavingAll(false);
            return;
        }


        for (const section in changedContent) {
            for (const key in changedContent[section]) {
                const value = changedContent[section][key];
                const { error } = await supabase.from('content').upsert(
                    { page: 'home', section: section, key: key, value: value },
                    { onConflict: 'page, section, key' }
                );

                if (error) {
                    console.error(`Error updating content for home.${section}.${key}:`, error);
                } else {
                    updateCount++;
                }
            }
        }

        if (updateCount > 0) {
            try {
                const revalidateResponse = await fetch(`/api/revalidate?secret=${secretToken}&path=/`);
                if (!revalidateResponse.ok) {
                    const errorData = await revalidateResponse.json().catch(() => ({ message: 'Unknown revalidation error' }));
                    console.error("Revalidation failed:", errorData.message);
                    alert(t("Content saved, but page refresh might be needed manually due to a revalidation issue."));
                } else {
                    revalidated = true;
                    console.log("Homepage revalidated successfully!");
                    alert(t("Homepage has been updated successfully!"));
                }
            } catch (err) {
                console.error("Failed to call revalidate API:", err);
                 alert(t("Content saved, but an error occurred during page revalidation. Please refresh manually."));
            }
        } else {
            alert(t("No changes were saved."));
        }


        setChangedContent({});
        setIsPageEditing(false);
        setIsSavingAll(false);
    };


    const handleCancelAll = () => {
        if (confirm(t("Are you sure you want to cancel all changes?"))) {
            setChangedContent({});
            setIsPageEditing(false);
        }
    };

    if (initialContent === null) {
        return <div className="min-h-screen flex items-center justify-center">{t("Loading...")}</div>;
    }


    return (
        <div className="min-h-screen">
            {/* ★ 1. userRole 대신 userProfile?.role 사용 ★ */}
            {userProfile?.role === 'admin' && (
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

            {/* 하위 섹션 컴포넌트 호출 (롤백된 원본 코드와 동일) */}
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
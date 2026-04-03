"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Play, Square, Volume2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";

import { useEffect, useState } from "react";
import { getCourseStopInfo, completeExploration } from "@/lib/api";

export default function ArrivalView() {
  const router = useRouter();
  const [stopInfo, setStopInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLastStop, setIsLastStop] = useState(false);
  const [finishing, setFinishing] = useState(false);
  
  // TTS & AI Story State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAiStory, setShowAiStory] = useState(false);
  const aiStoryText = "TTS테스트입니다. 숨은한옥카페전통과 현대가 공존하는 휴식공간인데 이런씩으로 말하면 괜찮겠죠?";

  useEffect(() => {
    const courseId = localStorage.getItem("currentCourseId");
    const stopOrder = localStorage.getItem("currentStopOrder") || "1";
    const totalStopsCount = localStorage.getItem("currentCourseStopsCount") || "1";

    if (courseId) {
      getCourseStopInfo(Number(courseId), Number(stopOrder))
        .then((res) => {
          if (res) {
            setStopInfo(res);
            setLoading(false);
            setIsLastStop(Number(stopOrder) >= Number(totalStopsCount));

            // 실시간 방문 기록 업데이트
            if (res.id !== undefined) {
              const visitedJson = localStorage.getItem("visitedSpotIds") || "[]";
              let visitedList: number[] = JSON.parse(visitedJson);
              if (!visitedList.includes(res.id)) {
                visitedList.push(res.id);
                localStorage.setItem("visitedSpotIds", JSON.stringify(visitedList));
              }
            }
          } else {
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleTts = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("이 브라우저는 음성 안내를 지원하지 않습니다.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // 모바일 브라우저의 경우 가끔 일시정지 상태로 시작하는 경우가 있어 강제로 resume 호출
      window.speechSynthesis.resume();
      
      const utterance = new SpeechSynthesisUtterance(aiStoryText);
      utterance.lang = "ko-KR";
      utterance.rate = 1.0; // 속도 (0.1 ~ 10)
      utterance.pitch = 1.0; // 피치 (0 ~ 2)
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error("TTS Error:", event);
        setIsSpeaking(false);
      };
      
      // 기존에 말하고 있는 것이 있다면 취소하고 새로 시작
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFinishExploration = async () => {
    try {
      setFinishing(true);
      
      const courseId = localStorage.getItem("currentCourseId");
      const rawStartTime = localStorage.getItem("explorationStartTime") || "";
      const distance = localStorage.getItem("explorationDistance");
      
      const endTime = new Date().toISOString().split('.')[0] + 'Z';
      const formattedStartTime = rawStartTime.split('.')[0].replace('Z', '') + 'Z';

      if (!courseId || !rawStartTime) {
        router.push("/record");
        return;
      }

      const visitedJson = localStorage.getItem("visitedSpotIds") || "[]";
      let visitedList: number[] = JSON.parse(visitedJson);

      const requestData = {
        courseId: Number(courseId),
        startTime: formattedStartTime,
        endTime: endTime,
        distance: Number(distance) || 0,
        visitedSpotIds: visitedList
      };

      const res = await completeExploration(requestData);
      localStorage.setItem("lastExplorationResult", JSON.stringify(res));
      
      localStorage.removeItem("explorationStartTime");
      localStorage.removeItem("explorationDistance");
      localStorage.removeItem("visitedSpotIds");
      
      router.push("/record");
    } catch (error: any) {
      console.error("Failed to complete exploration:", error);
      router.push("/record");
    } finally {
      setFinishing(false);
    }
  };

  const handleNext = () => {
    if (stopInfo && stopInfo.id !== undefined) {
      const visitedJson = localStorage.getItem("visitedSpotIds") || "[]";
      let visitedList: number[] = JSON.parse(visitedJson);
      if (!visitedList.includes(stopInfo.id)) {
        visitedList.push(stopInfo.id);
        localStorage.setItem("visitedSpotIds", JSON.stringify(visitedList));
      }
    }

    if (isLastStop) {
      handleFinishExploration();
    } else {
      const currentOrder = Number(localStorage.getItem("currentStopOrder") || "1");
      localStorage.setItem("currentStopOrder", (currentOrder + 1).toString());
      router.push("/navigation");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f3f4f6' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!stopInfo) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f3f4f6' }}>
        <div>정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#ffffff",
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}
      >
      {/* Header Image */}
      <div style={{ position: "relative", height: "35vh", width: "100%", backgroundColor: "#e5e7eb" }}>
        <img 
          src={stopInfo.imageUrl || "https://images.unsplash.com/photo-1542159676-47b2ae60baf4?auto=format&fit=crop&q=80&w=600"} 
          alt={stopInfo.name} 
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <button 
          onClick={() => router.back()}
          style={{ position: "absolute", top: "20px", left: "20px", backgroundColor: "white", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        >
          <ArrowLeft size={24} color="#111827" />
        </button>
      </div>

      <div style={{ flex: 1, padding: "32px 24px", display: "flex", flexDirection: "column", backgroundColor: "white" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>{stopInfo.name}</h2>
          <p style={{ fontSize: "15px", color: "#4b5563", lineHeight: "1.6" }}>
            {stopInfo.description || "이 장소에 대한 상세 설명이 제공되지 않았습니다."}
          </p>
        </div>

        {/* AI Story Section (Expandable) */}
        <div 
          onClick={() => setShowAiStory(!showAiStory)}
          style={{ 
            backgroundColor: "#f9fafb", 
            borderRadius: "16px", 
            padding: "20px", 
            display: "flex", 
            flexDirection: "column",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)", 
            border: "1px solid #e5e7eb", 
            marginBottom: "24px", 
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Volume2 size={20} color="#59d58d" />
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>AI 장소 가이드</span>
            </div>
            <div 
              onClick={handleToggleTts}
              style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: isSpeaking ? "#ef4444" : "#59d58d", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            >
              {isSpeaking ? <Square size={16} color="white" fill="white" /> : <Play size={18} color="white" fill="white" style={{ marginLeft: "2px" }} />}
            </div>
          </div>
          
          {showAiStory && (
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e5e7eb", animation: "fadeIn 0.3s ease" }}>
              <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                {aiStoryText}
              </p>
            </div>
          )}
        </div>

        <button 
          className="btn-primary" 
          style={{ marginBottom: "16px" }} 
          onClick={handleNext}
          disabled={finishing}
        >
          {finishing ? "처리 중..." : (isLastStop ? "탐방 완료" : "다음 경유지 안내")}
        </button>

        {!isLastStop && (
          <button 
            style={{ width: "100%", padding: "14px 24px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", color: "#6b7280", border: "1px solid #e5e7eb", backgroundColor: "white" }}
            onClick={handleFinishExploration}
            disabled={finishing}
          >
            {finishing ? "처리 중..." : "탐방 종료"}
          </button>
        )}
      </div>

      <BottomNav />
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

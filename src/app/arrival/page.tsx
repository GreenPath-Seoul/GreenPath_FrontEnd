"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import BottomNav from "@/components/BottomNav";

import { useEffect, useState } from "react";
import { getCourseStopInfo, completeExploration } from "@/lib/api";

export default function ArrivalView() {
  const router = useRouter();
  const [stopInfo, setStopInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLastStop, setIsLastStop] = useState(false);
  const [finishing, setFinishing] = useState(false);

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
  }, []);

  const handleFinishExploration = async () => {
    try {
      setFinishing(true);
      
      const courseId = localStorage.getItem("currentCourseId");
      const rawStartTime = localStorage.getItem("explorationStartTime") || "";
      const distance = localStorage.getItem("explorationDistance");
      
      // 밀리초를 제외한 ISO 문자열 생성
      const endTime = new Date().toISOString().split('.')[0] + 'Z';
      const formattedStartTime = rawStartTime.split('.')[0].replace('Z', '') + 'Z';

      if (!courseId || !rawStartTime) {
        router.push("/record");
        return;
      }

      // 최종 방문 목록 가져오기
      const visitedJson = localStorage.getItem("visitedSpotIds") || "[]";
      let visitedList: number[] = JSON.parse(visitedJson);

      const requestData = {
        courseId: Number(courseId),
        startTime: formattedStartTime,
        endTime: endTime,
        distance: Number(distance) || 0,
        visitedSpotIds: visitedList
      };

      console.log("--- 탐방 시간 정보 확인 ---");
      console.log("시작 시간 (startTime):", requestData.startTime, `(원래 값: ${rawStartTime})`);
      console.log("종료 시간 (endTime):", requestData.endTime);
      console.log("------------------------");
      console.log(">>> [보내는 데이터] 전체 요청:", requestData);

      const res = await completeExploration(requestData);
      
      console.log("<<< [받은 데이터] 탐방 완료 결과:", res);

      localStorage.setItem("lastExplorationResult", JSON.stringify(res));
      
      // 탐방 세션 초기화
      localStorage.removeItem("explorationStartTime");
      localStorage.removeItem("explorationDistance");
      localStorage.removeItem("visitedSpotIds");
      
      router.push("/record");
    } catch (error: any) {
      console.error("Failed to complete exploration:", error);
      if (error.response?.data) {
        console.error("Error response details:", error.response.data);
      }
      router.push("/record");
    } finally {
      setFinishing(false);
    }
  };

  const handleNext = () => {
    // 현재 경유지 방문 기록
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
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!stopInfo) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      <div style={{ position: "relative", height: "35vh", width: "100%" }}>
        <img 
          src={stopInfo.imageUrl || "https://images.unsplash.com/photo-1542159676-47b2ae60baf4?auto=format&fit=crop&q=80&w=600"} 
          alt={stopInfo.name} 
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

        {/* AI Story Button */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb", marginBottom: "24px", cursor: "pointer" }}>
          <span style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>AI 스토리 듣기</span>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#59d58d", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={20} color="white" style={{ marginLeft: "4px" }} />
          </div>
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
    </div>
  );
}

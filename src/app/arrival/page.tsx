"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import BottomNav from "@/components/BottomNav";

import { useEffect, useState } from "react";
import { getCourseStopInfo } from "@/lib/api";

export default function ArrivalView() {
  const router = useRouter();
  const [stopInfo, setStopInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLastStop, setIsLastStop] = useState(false);

  useEffect(() => {
    const courseId = localStorage.getItem("currentCourseId");
    const stopOrder = localStorage.getItem("currentStopOrder") || "1";
    const totalStopsCount = localStorage.getItem("currentCourseStopsCount") || "1";

    if (courseId) {
      getCourseStopInfo(Number(courseId), Number(stopOrder))
        .then((res) => {
          setStopInfo(res);
          setLoading(false);
          setIsLastStop(Number(stopOrder) >= Number(totalStopsCount));
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleNext = () => {
    if (isLastStop) {
      router.push("/record");
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
    <div className="container" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
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

        <button className="btn-primary" style={{ marginBottom: "16px" }} onClick={handleNext}>
          {isLastStop ? "탐방 완료" : "다음 경유지 안내"}
        </button>

        {!isLastStop && (
          <button 
            style={{ width: "100%", padding: "14px 24px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", color: "#6b7280", border: "1px solid #e5e7eb", backgroundColor: "white" }}
            onClick={() => router.push("/record")}
          >
            탐방 종료
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

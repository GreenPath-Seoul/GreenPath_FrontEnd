"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Leaf, MapIcon as MapIconFill, Navigation2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { getCourseStopInfo } from "@/lib/api";

export default function NavigationView() {
  const router = useRouter();
  const [stopInfo, setStopInfo] = useState<any>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const courseId = localStorage.getItem("currentCourseId");
    const stopOrder = localStorage.getItem("currentStopOrder") || "1";

    if (courseId) {
      getCourseStopInfo(Number(courseId), Number(stopOrder))
        .then((res) => {
          setStopInfo(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleStart = async () => {
    if (!stopInfo) return;

    // 현재 위치 가져오기
    let curLat = 37.5665;
    let curLng = 126.9780;

    if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        curLat = pos.coords.latitude;
        curLng = pos.coords.longitude;
      } catch (e) {
        console.warn("Location access denied");
      }
    }

    const kakaoMapUrl = `https://map.kakao.com/link/from/현재위치,${curLat},${curLng}/to/${stopInfo.name},${stopInfo.latitude},${stopInfo.longitude}`;
    window.open(kakaoMapUrl, "_blank");
    
    // 탐방 시작 정보 저장
    if (!localStorage.getItem("explorationStartTime")) {
      localStorage.setItem("explorationStartTime", new Date().toISOString());
      localStorage.removeItem("visitedSpotIds"); // 이전 방문 기록 초기화
    }
    
    // 코스 데이터에서 거리 정보 가져와 저장 (첫 번째 경유지 시작 시에만)
    const savedData = localStorage.getItem("currentCourseData");
    if (savedData) {
      const courseData = JSON.parse(savedData);
      localStorage.setItem("explorationDistance", (courseData.summary?.distanceKm || 0).toString());
    }
    
    setIsStarted(true);
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
        <div>목표 경유지 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#eef8f3" }}>
      {/* Map Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <MapIconFill size={48} color="#59d58d" />
        <div style={{ marginTop: "16px", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>{stopInfo.name} 방향으로 이동 중</div>
      </div>

      {/* Bottom Sheet */}
      <div className="glass-panel" style={{ padding: "24px", paddingBottom: "100px", marginTop: "auto", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>목적지 정보</div>
        </div>

        <div style={{ backgroundColor: "#f9fafb", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", border: "1px solid #e5e7eb" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>{stopInfo.name}</div>
            <div style={{ fontSize: "13px", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
              <Navigation2 size={14} /> 약 15분
            </div>
          </div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280" }}>850m</div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#4b5563", marginBottom: "12px" }}>구간 정보</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4b5563" }}>
              <AlertTriangle size={16} color="#f59e0b" />
              <span>교차로에서 차량 주의</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4b5563" }}>
              <Leaf size={16} color="#59d58d" />
              <span>쾌적한 자전거 전용 도로</span>
            </div>
          </div>
        </div>

        {!isStarted ? (
          <button
            className="btn-primary"
            onClick={handleStart}
            style={{ width: "100%" }}
          >
            탐방 시작
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => router.push("/arrival")}
            style={{ width: "100%", backgroundColor: "#3b82f6" }}
          >
            도착
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

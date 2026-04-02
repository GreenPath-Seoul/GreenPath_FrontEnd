"use client";

import { useRouter } from "next/navigation";
import type { CourseResponse } from "@/api";
import { Check, MapPin, Navigation2, ChevronRight, Bike } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { getCourseStopInfo } from "@/lib/api";

export default function NavigationView() {
  const router = useRouter();
  const [stopInfo, setStopInfo] = useState<any>(null);
  const [courseData, setCourseData] = useState<CourseResponse | null>(null);
  const [hasViewedGuidance, setHasViewedGuidance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStopOrder, setCurrentStopOrder] = useState(1);

  useEffect(() => {
    const courseId = localStorage.getItem("currentCourseId");
    const stopOrder = localStorage.getItem("currentStopOrder") || "1";
    setCurrentStopOrder(Number(stopOrder));

    // 탐방 정보 확인 로직은 유지하되, 버튼 표시용 로컬 상태는 false로 시작
    const savedCourseData = localStorage.getItem("currentCourseData");
    if (savedCourseData) {
      setCourseData(JSON.parse(savedCourseData));
    }

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

  const handleStart = () => {
  if (!stopInfo) return;

  const name = encodeURIComponent(stopInfo.name);

  const curLat = 37.5665;
  const curLng = 126.9780;

  const kakaoMapUrl = `https://map.kakao.com/link/from/현재위치,${curLat},${curLng}/to/${name},${stopInfo.latitude},${stopInfo.longitude}`;

  window.location.href = kakaoMapUrl;

  if (!localStorage.getItem("explorationStartTime")) {
    const startTime = new Date().toISOString().split('.')[0] + 'Z';
    localStorage.setItem("explorationStartTime", startTime);

    const totalDist = courseData?.summary?.distanceKm ?? 0;
    localStorage.setItem("explorationDistance", String(totalDist));

    localStorage.removeItem("visitedSpotIds");
  }

  setHasViewedGuidance(true);

    // 탐방 시작 정보 저장
    if (!localStorage.getItem("explorationStartTime")) {
      const startTime = new Date().toISOString().split('.')[0] + 'Z';
      localStorage.setItem("explorationStartTime", startTime);
      // 전체 거리 저장 (코스 데이터가 있으면 사용, 없으면 0)
      const totalDist = courseData?.summary?.distanceKm ?? 0;
      localStorage.setItem("explorationDistance", String(totalDist));
      // 이전 방문 기록 초기화
      localStorage.removeItem("visitedSpotIds");
    }
    
    setHasViewedGuidance(true);
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!stopInfo || !courseData) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>탐방 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const totalDistance = courseData.summary?.distanceKm || 4.2;
  // 임의의 진행 거리 계산 (현재 스톱 번호에 따라)
  const currentProgressDist = (currentStopOrder / (courseData.stops?.length || 1)) * totalDistance;
  const progressPercent = Math.min(Math.round((currentStopOrder / (courseData.stops?.length || 1)) * 100), 100);

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#ffffff" }}>
      {/* Top Progress Bar Area */}
      <div style={{ padding: "20px 20px 10px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600" }}>
            <Bike size={16} color="#59d58d" />
            <span>총 {totalDistance}km 중 <span style={{ color: "#59d58d" }}>{currentProgressDist.toFixed(2)}km 진행</span></span>
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>{progressPercent}%</div>
        </div>
        <div style={{ width: "100%", height: "6px", backgroundColor: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: "#59d58d", transition: "width 0.3s ease" }}></div>
        </div>
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", color: "#59d58d", fontSize: "14px", fontWeight: "600" }}>
          <Navigation2 size={16} fill="#59d58d" />
          <span>{stopInfo.name}까지 이동 중</span>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "10px 0" }} />
      </div>

      {/* Main Content Area - Route Sketch */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "24px", color: "#111827" }}>경로 약도</div>

        <div style={{ position: "relative" }}>
          {/* Vertical Line */}
          <div style={{ position: "absolute", left: "15px", top: "20px", bottom: "20px", width: "2px", backgroundColor: "#f3f4f6", zIndex: 0 }}></div>

          {/* Waypoint List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {courseData.stops?.map((stop: any, index: number) => {
              const order = index + 1;
              const isVisited = order < currentStopOrder;
              const isCurrent = order === currentStopOrder;
              const isFirst = index === 0;

              return (
                <div 
                  key={index} 
                  style={{ 
                    display: "flex", 
                    padding: "16px 0", 
                    position: "relative",
                    backgroundColor: isCurrent ? "rgba(89, 213, 141, 0.05)" : "transparent",
                    borderRadius: isCurrent ? "16px" : "0",
                    marginLeft: "-10px",
                    paddingLeft: "10px",
                    marginRight: "-10px",
                    paddingRight: "10px",
                  }}
                >
                  {/* Status Icon */}
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, backgroundColor: isVisited ? "#59d58d" : "white", border: isVisited ? "none" : (isCurrent ? "2px solid #59d58d" : "2px solid #e5e7eb") }}>
                    {isVisited ? (
                      <Check size={18} color="white" />
                    ) : (
                      isCurrent ? (
                        <MapPin size={18} color="#59d58d" />
                      ) : (
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#9ca3af" }}>{order}</span>
                      )
                    )}
                  </div>

                  {/* Text Info */}
                  <div style={{ flex: 1, marginLeft: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                      {isFirst && <span style={{ fontSize: "14px", fontWeight: "700", color: isVisited ? "#59d58d" : (isCurrent ? "#59d58d" : "#9ca3af") }}>시작점</span>}
                      <span style={{ fontSize: "16px", fontWeight: "700", color: isCurrent || isVisited ? "#111827" : "#9ca3af" }}>{stop.name}</span>
                      {isVisited && (
                        <span style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "10px", backgroundColor: "#f3f4f6", color: "#9ca3af", fontWeight: "600" }}>방문 완료</span>
                      )}
                      {isCurrent && (
                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", backgroundColor: "#59d58d", color: "white", fontWeight: "600" }}>다음 목적지</span>
                      )}
                    </div>
                    <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: isCurrent ? "8px" : "0" }}>
                      {index === 0 ? "광화문 따릉이 대여소" : (stop.description || "문화유산 탐방 장소")}
                    </div>
                    
                    {isCurrent && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#59d58d", fontSize: "13px", fontWeight: "600", marginTop: "4px" }}>
                        <Navigation2 size={12} fill="#59d58d" strokeWidth={3} />
                        <span>약 5분 소요</span>
                      </div>
                    )}
                  </div>

                  {/* Distance */}
                  <div style={{ fontSize: "13px", color: "#9ca3af", paddingLeft: "10px", textAlign: "right", minWidth: "50px" }}>
                    {index === 0 ? "0km" : index === 1 ? "850m" : `${(index * 0.8).toFixed(1)}km`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons Area */}
      <div style={{ padding: "20px", borderTop: "1px solid #f3f4f6", backgroundColor: "white", zIndex: 100, paddingBottom: "100px" }}>
        {!hasViewedGuidance ? (
          <button
            className="btn-primary"
            onClick={handleStart}
            style={{ width: "100%" }}
          >
            길안내 보기
          </button>
        ) : (
          <div style={{ display: "flex", gap: "12px" }}>
             <button
              onClick={handleStart}
              style={{ 
                flex: 1, 
                backgroundColor: "white", 
                border: "2px solid #59d58d", 
                color: "#59d58d", 
                padding: "14px", 
                borderRadius: "12px", 
                fontWeight: "700",
                fontSize: "16px"
              }}
            >
              길안내 보기
            </button>
            <button
              onClick={() => router.push("/arrival")}
              style={{ 
                flex: 2, 
                backgroundColor: "#59d58d", 
                color: "white", 
                padding: "14px", 
                borderRadius: "12px", 
                fontWeight: "700",
                fontSize: "16px"
              }}
            >
              도착
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

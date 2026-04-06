"use client";

import { useRouter, useParams } from "next/navigation";
import type { CourseResponse } from "@/api";
import { Check, MapPin, Navigation2, ChevronRight, Bike } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { getCourseStopInfo } from "@/lib/api";

const text = {
  ko: {
    noExploration: "진행 중인 탐방이 없습니다",
    noExplorationDesc: "새로운 코스를 추천받아\n탐방을 시작해보세요!",
    goHome: "홈으로 가기",
    totalOf: "총",
    kmOf: "km 중",
    progress: "진행",
    routeMap: "경로 약도",
    startPoint: "시작점",
    visited: "방문 완료",
    nextDest: "다음 목적지",
    defaultPlace: "문화유산 탐방 장소",
    bikeStation: "광화문 따릉이 대여소",
    aboutMin: "약 5분 소요",
    viewDirections: "길안내 보기",
    arrived: "도착",
    movingTo: "까지 이동 중",
  },
  en: {
    noExploration: "No active exploration",
    noExplorationDesc: "Get a new course recommendation\nand start exploring!",
    goHome: "Go Home",
    totalOf: "Total",
    kmOf: "km, ",
    progress: "progressed",
    routeMap: "Route Map",
    startPoint: "Start",
    visited: "Visited",
    nextDest: "Next Stop",
    defaultPlace: "Cultural heritage site",
    bikeStation: "Gwanghwamun Bike Station",
    aboutMin: "About 5 min",
    viewDirections: "View Directions",
    arrived: "Arrived",
    movingTo: " — heading to",
  }
};

export default function NavigationView() {
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) || "ko";
  const t = text[lang as keyof typeof text] || text.ko;
  const [stopInfo, setStopInfo] = useState<any>(null);
  const [courseData, setCourseData] = useState<CourseResponse | null>(null);
  const [hasViewedGuidance, setHasViewedGuidance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStopOrder, setCurrentStopOrder] = useState(1);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.5665,
    lng: 126.9780,
  });

  useEffect(() => {
    const courseId = localStorage.getItem("currentCourseId");
    const stopOrder = localStorage.getItem("currentStopOrder") || "1";
    setCurrentStopOrder(Number(stopOrder));

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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          console.warn("Location permission denied");
        }
      );
    }
  }, []);

  const handleStart = () => {
    if (!stopInfo) return;
    const name = encodeURIComponent(stopInfo.name);
    const kakaoMapUrl = `https://map.kakao.com/link/to/${name},${stopInfo.latitude},${stopInfo.longitude}`;
    window.location.href = kakaoMapUrl;
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
            background: "#eef8f3", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>🚲</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>{t.noExploration}</h2>
          <p style={{ color: "#6b7280", textAlign: "center", marginBottom: "30px", whiteSpace: "pre-line" }}>
            {t.noExplorationDesc}
          </p>
          <button 
            className="btn-primary" 
            onClick={() => router.push(`/${lang}`)}
          >
            {t.goHome}
          </button>
          <div style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: "430px" }}>
            <BottomNav />
          </div>
        </div>
      </div>
    );
  }

  const totalDistance = courseData.summary?.distanceKm || 4.2;
  const currentProgressDist = (currentStopOrder / (courseData.stops?.length || 1)) * totalDistance;
  const progressPercent = Math.min(Math.round((currentStopOrder / (courseData.stops?.length || 1)) * 100), 100);

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
      {/* Top Progress Bar Area */}
      <div style={{ padding: "20px 20px 10px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600" }}>
            <Bike size={16} color="#59d58d" />
            <span>{t.totalOf} {totalDistance}{t.kmOf} <span style={{ color: "#59d58d" }}>{currentProgressDist.toFixed(2)}km {t.progress}</span></span>
          </div>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>{progressPercent}%</div>
        </div>
        <div style={{ width: "100%", height: "6px", backgroundColor: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: "#59d58d", transition: "width 0.3s ease" }}></div>
        </div>
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", color: "#59d58d", fontSize: "14px", fontWeight: "600" }}>
          <Navigation2 size={16} fill="#59d58d" />
          <span>{stopInfo.name}{t.movingTo}</span>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "10px 0" }} />
      </div>

      {/* Main Content Area - Route Sketch */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "24px", color: "#111827" }}>{t.routeMap}</div>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "15px", top: "20px", bottom: "20px", width: "2px", backgroundColor: "#f3f4f6", zIndex: 0 }}></div>

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

                  <div style={{ flex: 1, marginLeft: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                      {isFirst && <span style={{ fontSize: "14px", fontWeight: "700", color: isVisited ? "#59d58d" : (isCurrent ? "#59d58d" : "#9ca3af") }}>{t.startPoint}</span>}
                      <span style={{ fontSize: "16px", fontWeight: "700", color: isCurrent || isVisited ? "#111827" : "#9ca3af" }}>{stop.name}</span>
                      {isVisited && (
                        <span style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "10px", backgroundColor: "#f3f4f6", color: "#9ca3af", fontWeight: "600" }}>{t.visited}</span>
                      )}
                      {isCurrent && (
                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", backgroundColor: "#59d58d", color: "white", fontWeight: "600" }}>{t.nextDest}</span>
                      )}
                    </div>
                    <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: isCurrent ? "8px" : "0" }}>
                      {index === 0 ? t.bikeStation : (stop.summary || t.defaultPlace)}
                    </div>
                    
                    {isCurrent && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#59d58d", fontSize: "13px", fontWeight: "600", marginTop: "4px" }}>
                        <Navigation2 size={12} fill="#59d58d" strokeWidth={3} />
                        <span>{t.aboutMin}</span>
                      </div>
                    )}
                  </div>

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
              {t.viewDirections}
            </button>
            <button
              onClick={() => router.push(`/${lang}/arrival`)}
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
              {t.arrived}
            </button>
          </div>
      </div>

      <BottomNav />
      </div>
    </div>
  );
}

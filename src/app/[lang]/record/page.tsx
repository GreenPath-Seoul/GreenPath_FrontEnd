"use client";

import { Trophy, MapPin, Clock, Star, Leaf, Landmark, Bike, Camera, MapIcon, Download } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { toPng } from "html-to-image";
import { getExploreRecordResult } from "@/lib/api";

const getIcon = (code?: string) => {
  switch (code) {
    case 'HANOK_MASTER': return Landmark;
    case 'RIDER': return Bike;
    case 'ECO_FRIENDLY': return Leaf;
    case 'PHOTOGRAPHER': return Camera;
    case 'EXPLORER': return MapIcon;
    case 'STARLIGHT': return Star;
    default: return Star;
  }
};

const text = {
  ko: {
    completed: "탐방 완료!",
    defaultCourse: "나의 멋진 탐방 코스",
    tripSummary: "여행 요약",
    totalDistance: "총 이동 거리",
    duration: "소요 시간",
    visitedStops: "방문 경유지",
    spots: "곳",
    min: "분",
    sec: "초",
    carbonReduction: "탄소 절감",
    vsCar: "자동차 대비",
    treeEffect: (n: number) => `소나무 약 ${n}그루를 심은 효과`,
    rewardEarned: "리워드 획득",
    completionPoints: "탐방 완료 포인트",
    bonusPoints: "보너스 포인트",
    totalPoints: "총 획득 포인트",
    newBadge: "새 배지 획득!",
    defaultBadge: "기본 뱃지",
    generateImage: "인스타 이미지 생성하기",
    generating: "이미지 생성 중...",
    exploreCourse: "새로운 코스 탐색하기",
    instaImage: "인스타그램용 이미지",
    downloadImage: "이미지 다운로드",
    close: "닫기",
    imageFailed: "이미지 생성에 실패했습니다.",
  },
  en: {
    completed: "Exploration Complete!",
    defaultCourse: "My Amazing Tour",
    tripSummary: "Trip Summary",
    totalDistance: "Total Distance",
    duration: "Duration",
    visitedStops: "Visited Stops",
    spots: " stops",
    min: "min ",
    sec: "sec",
    carbonReduction: "Carbon Reduction",
    vsCar: "vs. driving",
    treeEffect: (n: number) => `Equivalent to planting ~${n} pine trees`,
    rewardEarned: "Rewards Earned",
    completionPoints: "Completion Points",
    bonusPoints: "Bonus Points",
    totalPoints: "Total Points Earned",
    newBadge: "New Badge Earned!",
    defaultBadge: "Default Badge",
    generateImage: "Generate Instagram Image",
    generating: "Generating image...",
    exploreCourse: "Explore New Course",
    instaImage: "Image for Instagram",
    downloadImage: "Download Image",
    close: "Close",
    imageFailed: "Image generation failed.",
  }
};

export default function RecordView() {
  return (
    <Suspense fallback={<div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div>Loading...</div></div>}>
      <RecordContent />
    </Suspense>
  );
}

function RecordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = (params.lang as string) || "ko";
  const t = text[lang as keyof typeof text] || text.ko;
  const recordId = searchParams.get("recordId");
  
  const [data, setData] = useState<any>(null);
  const [courseName, setCourseName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const captureRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (recordId) {
          const result = await getExploreRecordResult(Number(recordId));
          if (!result) throw new Error("Record not found");
          
          setData(result);
          setCourseName(result.courseTitle || t.defaultCourse);
        } else {
          const result = localStorage.getItem("lastExplorationResult");
          if (result) {
            setData(JSON.parse(result));
          } else {
            router.push(`/${lang}`);
          }

          const savedCourse = localStorage.getItem("currentCourseData");
          if (savedCourse) {
            try {
              const parsed = JSON.parse(savedCourse);
              setCourseName(parsed.title || t.defaultCourse);
            } catch (e) {
              setCourseName(t.defaultCourse);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load record:", error);
        router.push(`/${lang}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, recordId, lang, t.defaultCourse]);

  const handleGeneratePreview = async () => {
    if (!captureRef.current) return;
    try {
      setIsGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 150));
      const dataUrl = await toPng(captureRef.current, { 
        cacheBust: true, 
        pixelRatio: 3,
        backgroundColor: "#59d58d"
      });
      setPreviewUrl(dataUrl);
      setShowPreview(true);
    } catch (err) {
      console.error('Image generation failed:', err);
      alert(t.imageFailed);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `greenpath-record-${new Date().toLocaleDateString()}.png`;
    link.href = previewUrl;
    link.click();
    setShowPreview(false);
  };

  if (loading || !data) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  const summary = data.summary || {};
  const co2 = data.co2 || {};
  const reward = data.reward || {};
  const badge = data.badge || { name: t.defaultBadge };

  return (
    <div className="container" style={{ background: "#f3f4f6", display: "flex", justifyContent: "center", minHeight: "100vh" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "white",
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div className="content" style={{ flex: 1, padding: "40px 20px 100px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Header */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ backgroundColor: "#59d58d", width: "64px", height: "64px", borderRadius: "32px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "white" }}>
              <Trophy size={32} />
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>{t.completed}</h1>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>{courseName}</p>
          </div>

          {/* 여행 요약 */}
          <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#374151" }}>{t.tripSummary}</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
                <MapPin size={16} />
                <span>{t.totalDistance}</span>
              </div>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{summary.distance || 0} km</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
                <Clock size={16} />
                <span>{t.duration}</span>
              </div>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{Math.floor((summary.duration || 0) / 60)}{t.min} {(summary.duration || 0) % 60}{t.sec}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
                <Star size={16} />
                <span>{t.visitedStops}</span>
              </div>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{summary.visitedCount || 0}{t.spots}</span>
            </div>
          </div>

          {/* 탄소 절감 */}
          <div className="card" style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#166534" }}>
              <Leaf size={16} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>{t.carbonReduction}</span>
                <span style={{ fontSize: "12px", opacity: 0.8 }}>{t.vsCar}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "24px" }}>🌱</span>
              <span style={{ fontSize: "24px", fontWeight: "700", color: "#16a34a" }}>{co2.amount || 0}kg CO₂</span>
            </div>
            <p style={{ fontSize: "12px", color: "#166534", opacity: 0.8 }}>{t.treeEffect(co2.treeEquivalent || 0)}</p>
          </div>

          {/* 리워드 획득 */}
          <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#374151" }}>{t.rewardEarned}</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#6b7280" }}>
              <span>{t.completionPoints}</span>
              <span style={{ color: "#59d58d", fontWeight: "500" }}>+{reward.basePoint || 0}P</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#6b7280", paddingBottom: "12px", borderBottom: "1px solid #e5e7eb" }}>
              <span>{t.bonusPoints}</span>
              <span style={{ color: "#59d58d", fontWeight: "500" }}>+{reward.bonusPoint || 0}P</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", fontWeight: "600", color: "#111827", marginTop: "4px" }}>
              <span>{t.totalPoints}</span>
              <span style={{ color: "#59d58d" }}>+{reward.totalPoint || 0}P</span>
            </div>
          </div>

          {/* 배지 획득 */}
          <div className="card" style={{ backgroundColor: "#fefce8", borderColor: "#fef08a", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#854d0e" }}>
                <Trophy size={16} />
                <span style={{ fontSize: "14px", fontWeight: "600" }}>{t.newBadge}</span>
              </div>
              <span style={{ fontSize: "12px", color: "#a16207" }}>{badge.name}</span>
            </div>
            <div style={{ width: "40px", height: "40px", backgroundColor: "white", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #fef08a" }}>
              {(() => {
                const BadgeIcon = getIcon(badge.code);
                return <BadgeIcon size={20} color="#854d0e" />;
              })()}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
            <button 
              className="btn-primary" 
              style={{ padding: "14px" }} 
              onClick={handleGeneratePreview}
              disabled={isGenerating}
            >
              <Download size={18} />
              {isGenerating ? t.generating : t.generateImage}
            </button>
            <button 
              style={{ backgroundColor: "#f3f4f6", color: "#4b5563", padding: "14px", borderRadius: "12px", fontWeight: "600", fontSize: "16px" }} 
              onClick={() => router.push(`/${lang}`)}
            >
              {t.exploreCourse}
            </button>
          </div>

        </div>

        {/* --- Preview Modal --- */}
        {showPreview && (
          <div 
            style={{ 
              position: "fixed", 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: "rgba(0,0,0,0.85)", 
              zIndex: 3000, 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center", 
              justifyContent: "center", 
              padding: "20px",
              backdropFilter: "blur(8px)"
            }}
            onClick={() => setShowPreview(false)}
          >
            <div style={{ color: "white", marginBottom: "20px", fontSize: "18px", fontWeight: "600" }}>{t.instaImage}</div>
            
            <div 
              style={{ 
                width: "100%", 
                maxWidth: "380px", 
                backgroundColor: "white", 
                borderRadius: "24px", 
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "center", background: "#59d58d", padding: "10px" }}>
                <img 
                  src={previewUrl} 
                  alt="Instagram Preview" 
                  style={{ width: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }} 
                />
              </div>
            </div>

            <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "10px", marginTop: "30px" }}>
                <button 
                  onClick={handleDownload}
                  className="btn-primary"
                  style={{ padding: "16px", fontSize: "18px" }}
                >
                  <Download size={20} />
                  {t.downloadImage}
                </button>
                <button 
                  onClick={() => setShowPreview(false)}
                  style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.2)", color: "white", fontWeight: "600", fontSize: "16px" }}
                >
                  {t.close}
                </button>
            </div>
          </div>
        )}

        {/* --- Hidden Capture Area --- */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <div 
            ref={captureRef}
            style={{ 
                width: "500px", 
                height: "500px", 
                background: "#59d58d", 
                padding: "30px", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                justifyContent: "center",
                color: "white"
              }}
          >
            <div style={{ background: "white", borderRadius: "24px", width: "100%", height: "100%", padding: "30px", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ color: "#59d58d", fontWeight: "800", fontSize: "20px", marginBottom: "10px" }}>GreenPath</div>
              <div style={{ borderBottom: "2px solid #f3f4f6", width: "40px", marginBottom: "20px" }}></div>
              
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🏆</div>
              <h2 style={{ fontSize: "28px", color: "#111827", fontWeight: "800", marginBottom: "5px" }}>{t.completed}</h2>
              <p style={{ color: "#6b7280", fontSize: "16px", fontWeight: "600", marginBottom: "30px", textAlign: "center" }}>{courseName}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", width: "100%", marginBottom: "30px" }}>
                <div style={{ textAlign: "center", padding: "15px", background: "#f9fafb", borderRadius: "16px" }}>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>{t.totalDistance}</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>{summary.distance || 0}km</div>
                </div>
                <div style={{ textAlign: "center", padding: "15px", background: "#f9fafb", borderRadius: "16px" }}>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>{t.duration}</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>{Math.floor((summary.duration || 0) / 60)}{t.min}</div>
                </div>
                <div style={{ textAlign: "center", padding: "15px", background: "#f0fdf4", borderRadius: "16px" }}>
                  <div style={{ fontSize: "12px", color: "#166534", marginBottom: "4px" }}>{t.carbonReduction}</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#16a34a" }}>{co2.amount || 0}kg</div>
                </div>
                <div style={{ textAlign: "center", padding: "15px", background: "#fefce8", borderRadius: "16px" }}>
                  <div style={{ fontSize: "12px", color: "#854d0e", marginBottom: "4px" }}>{t.totalPoints}</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#ca8a04" }}>+{reward.totalPoint || 0}P</div>
                </div>
              </div>

              <div style={{ position: "absolute", bottom: "16px", fontSize: "11px", color: "#d1d5db" }}>© GreenPath Seoul Renaissance Ride</div>
            </div>
          </div>
        </div>

        {/* 네비게이션 가림 방지 여백 */}
        <div style={{ height: "100px" }} />
      </div>

      <div style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: "430px", zIndex: 100 }}>
        <BottomNav />
      </div>
    </div>
  );
}

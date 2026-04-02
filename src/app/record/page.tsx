"use client";

import { Trophy, MapPin, Clock, Star, Leaf, Share2, Landmark, Bike, Camera, MapIcon } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function RecordView() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const result = localStorage.getItem("lastExplorationResult");
    if (result) {
      setData(JSON.parse(result));
    } else {
      // 데이터가 없는 경우 홈으로 리다이렉트하거나 목 데이터 사용 (여기서는 서비스 흐름상 홈 이동 권장)
      router.push("/");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  // 데이터 가공
  const summary = data.summary || {};
  const co2 = data.co2 || {};
  const reward = data.reward || {};
  const badge = data.badge || { name: "기본 뱃지" };

  return (
    <div className="container">
      <div className="content" style={{ padding: "40px 20px 100px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ backgroundColor: "#59d58d", width: "64px", height: "64px", borderRadius: "32px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "white" }}>
            <Trophy size={32} />
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>탐방 완료!</h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>멋진 여정이었어요 🚴</p>
        </div>

        {/* 여행 요약 */}
        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#374151" }}>여행 요약</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
              <MapPin size={16} />
              <span>총 이동 거리</span>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{summary.distance || 0} km</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
              <Clock size={16} />
              <span>소요 시간</span>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{Math.floor((summary.duration || 0) / 60)}분 { (summary.duration || 0) % 60 }초</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
              <Star size={16} />
              <span>방문 경유지</span>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{summary.visitedCount || 0}곳</span>
          </div>
        </div>

        {/* 탄소 절감 */}
        <div className="card" style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#166534" }}>
            <Leaf size={16} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>탄소 절감</span>
              <span style={{ fontSize: "12px", opacity: 0.8 }}>자동차 대비</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "24px" }}>🌱</span>
            <span style={{ fontSize: "24px", fontWeight: "700", color: "#16a34a" }}>{co2.amount || 0}kg CO₂</span>
          </div>
          <p style={{ fontSize: "12px", color: "#166534", opacity: 0.8 }}>소나무 약 {co2.treeEquivalent || 0}그루를 심은 효과와 같음</p>
        </div>

        {/* 리워드 획득 */}
        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>리워드 획득</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#6b7280" }}>
            <span>탐방 완료 포인트</span>
            <span style={{ color: "#59d58d", fontWeight: "500" }}>+{reward.basePoint || 0}P</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#6b7280", paddingBottom: "12px", borderBottom: "1px solid #e5e7eb" }}>
            <span>보너스 포인트</span>
            <span style={{ color: "#59d58d", fontWeight: "500" }}>+{reward.bonusPoint || 0}P</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", fontWeight: "600", color: "#111827", marginTop: "4px" }}>
            <span>총 획득 포인트</span>
            <span style={{ color: "#59d58d" }}>+{reward.totalPoint || 0}P</span>
          </div>
        </div>

        {/* 배지 획득 */}
        <div className="card" style={{ backgroundColor: "#fefce8", borderColor: "#fef08a", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#854d0e" }}>
              <Trophy size={16} />
              <span style={{ fontSize: "14px", fontWeight: "600" }}>새 배지 획득!</span>
            </div>
            <span style={{ fontSize: "12px", color: "#a16207" }}>{badge.name}</span>
          </div>
          <div style={{ width: "40px", height: "40px", backgroundColor: "white", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #fef08a", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            {(() => {
              const BadgeIcon = getIcon(badge.code);
              return <BadgeIcon size={20} color="#854d0e" />;
            })()}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
          <button style={{ backgroundColor: "#d1fae5", color: "#059669", padding: "14px", borderRadius: "12px", fontWeight: "600", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "none" }}>
            <Share2 size={18} />
            코스 공유하기
          </button>
          <button className="btn-primary" style={{ padding: "14px" }} onClick={() => router.push("/")}>
            새로운 코스 탐색하기
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

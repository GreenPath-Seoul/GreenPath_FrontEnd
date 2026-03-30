"use client";

import { Trophy, MapPin, Clock, Star, Leaf, Share2, Landmark } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getExplorationRecord } from "@/lib/api";
import { ExplorationRecord } from "@/lib/api/types";

export default function RecordView() {
  const router = useRouter();
  const [data, setData] = useState<ExplorationRecord | null>(null);

  useEffect(() => {
    getExplorationRecord("record_123").then(setData);
  }, []);

  if (!data) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

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
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{data.totalDistance} km</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
              <Clock size={16} />
              <span>소요 시간</span>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{data.totalDuration}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
              <Star size={16} />
              <span>방문 문화재</span>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#111827" }}>{data.visitedSites}곳</span>
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
            <span style={{ fontSize: "24px", fontWeight: "700", color: "#16a34a" }}>{data.carbonReduction}kg CO₂</span>
          </div>
          <p style={{ fontSize: "12px", color: "#166534", opacity: 0.8 }}>{data.carbonEquivalent}</p>
        </div>

        {/* 리워드 획득 */}
        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>리워드 획득</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#6b7280" }}>
            <span>탐방 완료 포인트</span>
            <span style={{ color: "#59d58d", fontWeight: "500" }}>+{data.rewards.completion}P</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#6b7280", paddingBottom: "12px", borderBottom: "1px solid #e5e7eb" }}>
            <span>첫 방문 보너스</span>
            <span style={{ color: "#59d58d", fontWeight: "500" }}>+{data.rewards.firstVisit}P</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", fontWeight: "600", color: "#111827", marginTop: "4px" }}>
            <span>총 획득 포인트</span>
            <span style={{ color: "#59d58d" }}>+{data.rewards.total}P</span>
          </div>
        </div>

        {/* 배지 획득 */}
        <div className="card" style={{ backgroundColor: "#fefce8", borderColor: "#fef08a", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#854d0e" }}>
              <Trophy size={16} />
              <span style={{ fontSize: "14px", fontWeight: "600" }}>배지 획득</span>
            </div>
            <span style={{ fontSize: "12px", color: "#a16207" }}>{data.badge.name}</span>
          </div>
          <div style={{ width: "40px", height: "40px", backgroundColor: "white", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #fef08a", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <Landmark size={20} color="#854d0e" />
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

"use client";

import { User, Leaf, Landmark, Bike, Camera, MapIcon, Star, ChevronRight, Trophy, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, logout } from "@/lib/api";
import { UserProfile } from "@/lib/api/types";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Landmark': return Landmark;
    case 'Bike': return Bike;
    case 'Leaf': return Leaf;
    case 'Camera': return Camera;
    case 'MapIcon': return MapIcon;
    case 'Star': return Star;
    default: return Star;
  }
};

export default function MyView() {
  const router = useRouter();
  const [data, setData] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUserProfile("user_123").then(setData);
  }, []);

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      await logout();
      localStorage.removeItem("isLoggedIn");
      router.push("/login");
    }
  };

  if (!data) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content" style={{ padding: "40px 20px 100px 20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ backgroundColor: "#59d58d", width: "72px", height: "72px", borderRadius: "36px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "white" }}>
            <User size={36} />
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>{data.name}</h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>{data.role}</p>
        </div>

        {/* 탄소 절감량 */}
        <div className="card" style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#166534" }}>
            <Leaf size={16} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>총 탄소 절감량</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "24px" }}>🌱</span>
            <span style={{ fontSize: "24px", fontWeight: "700", color: "#16a34a" }}>{data.totalCarbonReduction}kg CO₂</span>
          </div>
          <p style={{ fontSize: "12px", color: "#166534", opacity: 0.8 }}>{data.carbonEquivalent}</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "12px" }}>
              <MapIcon size={14} />
              <span>방문 문화재</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "700", color: "#111827" }}>{data.totalVisitedSites}곳</span>
          </div>
          <div className="card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "12px" }}>
              <Trophy size={14} />
              <span>획득 포인트</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "700", color: "#59d58d" }}>{data.totalPoints}P</span>
          </div>
        </div>

        {/* 획득한 배지 */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>획득한 배지</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {data.badges.map((badge, idx) => {
              const Icon = getIcon(badge.iconType);
              return (
                <div key={idx} className="card" style={{ padding: "16px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <Icon size={24} color="#374151" />
                  <span style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 최근 기록 */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>최근 기록</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {data.recentRecords.map((record, idx) => (
              <div key={idx} className="card" style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{record.title}</span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{record.date}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#59d58d" }}>{record.point}</span>
                  <ChevronRight size={16} color="#9ca3af" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 로그아웃 */}
        <div style={{ marginTop: "16px" }}>
          <button 
            onClick={handleLogout}
            style={{ width: "100%", padding: "16px", backgroundColor: "#f3f4f6", color: "#4b5563", borderRadius: "12px", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <LogOut size={18} />
            로그아웃
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}

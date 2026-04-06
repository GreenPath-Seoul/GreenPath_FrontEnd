"use client";

import { User, Leaf, Landmark, Bike, Camera, MapIcon, Star, ChevronRight, Trophy, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getMyPage, logout } from "@/lib/api";

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

export default function MyView() {
  const router = useRouter();
  const params = useParams();

  // ✅ 안전 + 타입
  const rawLang = params?.lang;
  const lang: "ko" | "en" = rawLang === "en" ? "en" : "ko";

  const [data, setData] = useState<any>(null);

  // ✅ 텍스트만 분리
  const text = {
    ko: {
      defaultUser: "사용자",
      defaultLevel: "초보 탐방가",
      carbon: "총 탄소 절감량",
      treePrefix: "소나무 약",
      treeSuffix: "그루를 심은 효과",
      visited: "방문 경유지",
      placeUnit: "곳",
      point: "누적 포인트",
      badge: "획득한 배지",
      recent: "최근 기록",
      logout: "로그아웃",
      logoutConfirm: "로그아웃 하시겠습니까?"
    },
    en: {
      defaultUser: "User",
      defaultLevel: "Beginner Explorer",
      carbon: "Total Carbon Reduction",
      treePrefix: "Equivalent to",
      treeSuffix: "pine trees planted",
      visited: "Visited Spots",
      placeUnit: "",
      point: "Total Points",
      badge: "Earned Badges",
      recent: "Recent Records",
      logout: "Logout",
      logoutConfirm: "Do you want to log out?"
    }
  };

  useEffect(() => {
    getMyPage().then(setData).catch(err => {
      console.error(err);
    });
  }, []);

  const handleLogout = async () => {
    if (confirm(text[lang].logoutConfirm)) {
      try {
        await logout();
      } catch (e) {
        console.error("Logout failed:", e);
      } finally {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push(`/${lang}/login`);
      }
    }
  };

  if (!data) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  const user = data.user || {};
  const stats = data.stats || {};

  return (
    <div className="container">
      <div className="content" style={{ padding: "40px 20px 100px 20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ backgroundColor: "#59d58d", width: "72px", height: "72px", borderRadius: "36px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "white" }}>
            <User size={36} />
          </div>

          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>
            {user.name || text[lang].defaultUser}
          </h1>

          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Level {user.level || 1} · {user.levelName || text[lang].defaultLevel}
          </p>
        </div>

        {/* 탄소 절감량 */}
        <div className="card" style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#166534" }}>
            <Leaf size={16} />
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              {text[lang].carbon}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "24px" }}>🌱</span>
            <span style={{ fontSize: "24px", fontWeight: "700", color: "#16a34a" }}>
              {stats.totalCo2 || 0}kg CO₂
            </span>
          </div>

          <p style={{ fontSize: "12px", color: "#166534", opacity: 0.8 }}>
            {text[lang].treePrefix} {Math.floor((stats.totalCo2 || 0) / 5)} {text[lang].treeSuffix}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "12px" }}>
              <MapIcon size={14} />
              <span>{text[lang].visited}</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "700", color: "#111827" }}>
              {stats.visitedCount || 0}{text[lang].placeUnit}
            </span>
          </div>

          <div className="card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "12px" }}>
              <Trophy size={14} />
              <span>{text[lang].point}</span>
            </div>
            <span style={{ fontSize: "20px", fontWeight: "700", color: "#59d58d" }}>
              {stats.totalPoint || 0}P
            </span>
          </div>
        </div>

        {/* 획득한 배지 */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
            {text[lang].badge}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {(data.badges || []).map((badge: any, idx: number) => {
              const Icon = getIcon(badge.code);
              return (
                <div key={idx} className="card" style={{ padding: "16px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <Icon size={24} color="#374151" />
                  <span style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", fontWeight: "500" }}>
                    {badge.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 최근 기록 */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
            {text[lang].recent}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(data.recentRecords || []).map((record: any, idx: number) => (
              <div 
                key={idx} 
                className="card" 
                style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                onClick={() => router.push(`/${lang}/record?recordId=${record.recordId}`)}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                    {record.title}
                  </span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    {record.date}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#59d58d" }}>
                    +{record.point}P
                  </span>
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
            {text[lang].logout}
          </button>
        </div>

      </div>

      <BottomNav lang={lang} />
    </div>
  );
}
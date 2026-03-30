"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Leaf, MapIcon as MapIconFill, Navigation2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { getNavigationInfo } from "@/lib/api";
import { NavigationInfo } from "@/lib/api/types";

export default function NavigationView() {
  const router = useRouter();
  const [data, setData] = useState<NavigationInfo | null>(null);

  useEffect(() => {
    getNavigationInfo("course_123").then(setData);
  }, []);

  if (!data) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#eef8f3" }}>
      {/* Map Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <MapIconFill size={48} color="#59d58d" />
        <div style={{ marginTop: "16px", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>지도 위에 경로가 표시됩니다</div>
        
        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#4b5563" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#59d58d" }}></div>
            경로 표시 (초록색)
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#4b5563" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", border: "2px solid #ef4444" }}></div>
            경유지 마커
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#4b5563" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "#3b82f6" }}></div>
            따릉이 대여소
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="glass-panel" style={{ padding: "24px", paddingBottom: "100px", marginTop: "auto", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>다음 목적지</div>
        </div>

        <div style={{ backgroundColor: "#f9fafb", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", border: "1px solid #e5e7eb" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>{data.nextDestination}</div>
            <div style={{ fontSize: "13px", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
              <Navigation2 size={14} /> {data.eta}
            </div>
          </div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280" }}>{data.distanceRemaining}</div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#4b5563", marginBottom: "12px" }}>구간 정보</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {data.segments.map((segment, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4b5563" }}>
                {segment.type === "warning" && <AlertTriangle size={16} color="#f59e0b" />}
                {segment.type === "gradient" && <AlertTriangle size={16} color="#3b82f6" />}
                {segment.type === "eco" && <Leaf size={16} color="#59d58d" />}
                <span>{segment.message}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => router.push("/arrival")}
          style={{ width: "100%" }}
        >
          탐방 시작
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

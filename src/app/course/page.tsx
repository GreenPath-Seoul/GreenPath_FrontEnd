"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Leaf, MapPin, Clock, ArrowUpRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { getCourseRecommendation } from "@/lib/api";
import { CourseRecommendation } from "@/lib/api/types";

export default function CourseView() {
  const router = useRouter();

  const [data, setData] = useState<CourseRecommendation | null>(null);

  useEffect(() => {
    // 임시 파라미터로 목업 API 호출
    getCourseRecommendation("조용한 곳", "1시간", "초급").then(setData);
  }, []);

  if (!data) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ backgroundColor: "#eef8f3" }}>
      <div className="content">
        <div style={{ padding: "32px 20px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px", color: "black", letterSpacing: "-0.5px" }}>
            {data.title}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
            {data.subtitle}
          </p>

          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={20} color="#59d58d" />
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>총 거리</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{data.distance}km</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={20} color="#59d58d" />
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>소요 시간</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{data.duration}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ArrowUpRight size={20} color="#59d58d" />
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>난이도</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{data.difficulty}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Leaf size={20} color="#59d58d" />
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>탄소 절감</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{data.carbonReduction}kg</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 20px 20px", borderTopLeftRadius: "24px", borderTopRightRadius: "24px", backgroundColor: "white", minHeight: "50vh" }}>
          <div style={{ fontSize: "16px", fontWeight: "600", marginTop: "24px", marginBottom: "16px", color: "black" }}>경유지</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {data.stops.map((stop) => (
              <div key={stop.id} style={{ display: "flex", alignItems: "center", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "8px", overflow: "hidden", marginRight: "12px" }}>
                  <img src={stop.imgHover} alt={stop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#59d58d", color: "white", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                      {stop.id}
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: "600", color: "#111827" }}>{stop.name}</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>{stop.desc}</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>{stop.time}</div>
                </div>
                <ChevronRight size={20} color="#d1d5db" />
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: "32px", marginBottom: "20px" }}>
            <button
              className="btn-primary"
              onClick={() => router.push("/navigation")}
            >
              이 코스로 이동하기
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

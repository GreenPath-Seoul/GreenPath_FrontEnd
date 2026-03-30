"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function ArrivalView() {
  const router = useRouter();

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header Image */}
      <div style={{ position: "relative", height: "35vh", width: "100%" }}>
        <img 
          src="https://images.unsplash.com/photo-1542159676-47b2ae60baf4?auto=format&fit=crop&q=80&w=600" 
          alt="성북동 고택" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <button 
          onClick={() => router.back()}
          style={{ position: "absolute", top: "20px", left: "20px", backgroundColor: "white", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        >
          <ArrowLeft size={24} color="#111827" />
        </button>
      </div>

      <div style={{ flex: 1, padding: "32px 24px", display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>성북동 고택</h2>
          <p style={{ fontSize: "15px", color: "#4b5563", lineHeight: "1.6" }}>
            조선시대 양반가의 전통 한옥으로, 18세기에 건립되었습니다. 한국 전통 건축의 아름다움과 조상들의 지혜를 엿볼 수 있는 귀중한 문화재입니다.
          </p>
        </div>

        {/* AI Story Button */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb", marginBottom: "24px", cursor: "pointer" }}>
          <span style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>AI 스토리 듣기</span>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#59d58d", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Play size={20} color="white" style={{ marginLeft: "4px" }} />
          </div>
        </div>

        <button className="btn-primary" style={{ marginBottom: "16px" }}>
          방문 인증하기
        </button>

        <button 
          style={{ width: "100%", padding: "14px 24px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", color: "#59d58d", border: "1px solid #59d58d", backgroundColor: "white" }}
          onClick={() => router.push("/record")}
        >
          탐방 종료
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

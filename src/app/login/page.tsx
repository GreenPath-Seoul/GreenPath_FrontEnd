"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bike } from "lucide-react";
import { login } from "@/lib/api";
import { API_CONFIG } from "@/lib/api/config";

export default function LoginView() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async () => {
    if (!id || !pw) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await login(id, pw);
      if (res.success) {
        localStorage.setItem("isLoggedIn", "true");
        if (res.accessToken) localStorage.setItem("accessToken", res.accessToken);
        if (res.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);
        router.push("/");
      } else {
        alert(res.message);
      }
    } catch(e) {
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container" style={{ padding: "0 20px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Bike size={48} color="#59d58d" style={{ margin: "0 auto" }} />
          <h1 style={{ fontSize: "24px", marginTop: "16px", color: "black" }}>Seoul Renaissance Ride</h1>
          <p style={{ color: "#6b7280", marginTop: "8px", fontSize: "14px" }}>탐방을 위해 로그인을 해주세요</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          <input 
            type="text" 
            placeholder="아이디" 
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{ padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "16px" }}
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={{ padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "16px" }}
          />
        </div>

        <button 
          className="btn-primary" 
          onClick={handleLogin}
          style={{ marginBottom: "24px", padding: "16px" }}
        >
          로그인
        </button>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
          <div style={{ padding: "0 12px", color: "#6b7280", fontSize: "12px" }}>간편 로그인</div>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
        </div>

        <button 
          style={{ padding: "16px", width: "100%", borderRadius: "12px", backgroundColor: "#FEE500", color: "#000000", fontWeight: "600", fontSize: "16px", marginBottom: "12px", border: "none", cursor: "pointer" }}
          onClick={() => {
            window.location.href = `${API_CONFIG.BASE_URL}/oauth2/authorization/kakao`;
          }}
        >
          카카오로 시작하기
        </button>
        <button 
          style={{ padding: "16px", width: "100%", borderRadius: "12px", backgroundColor: "#03C75A", color: "#ffffff", fontWeight: "600", fontSize: "16px", marginBottom: "24px", border: "none", cursor: "pointer" }}
          onClick={() => {
            window.location.href = `${API_CONFIG.BASE_URL}/oauth2/authorization/naver`;
          }}
        >
          네이버로 시작하기
        </button>

        <div style={{ textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
          아직 계정이 없으신가요? <span style={{ color: "#59d58d", fontWeight: "600", cursor: "pointer" }} onClick={() => router.push("/signup")}>회원가입</span>
        </div>
      </div>
    </div>
  );
}

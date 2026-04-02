"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, ArrowLeft } from "lucide-react";
import { signup } from "@/lib/api";

export default function SignupView() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
    if (!id || !pw || !name) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (pw !== pwConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await signup(id, pw, name);
      if (res.success) {
        alert(res.message);
        localStorage.setItem("isLoggedIn", "true");
        router.push("/");
      } else {
        alert(res.message);
      }
    } catch (e) {
      alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container" style={{ padding: "0 20px" }}>
      <div style={{ padding: "20px 0", position: "relative" }}>
        <button
          onClick={() => router.back()}
          style={{ position: "absolute", left: 0, top: "20px", display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px" }}
        >
          <ArrowLeft size={24} color="#111827" />

        </button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Bike size={48} color="#59d58d" style={{ margin: "0 auto" }} />
          <h1 style={{ fontSize: "24px", marginTop: "16px", color: "black", letterSpacing: "-0.5px" }}>Seoul Renaissance Ride</h1>
          <p style={{ color: "#6b7280", marginTop: "8px", fontSize: "14px" }}>탐방을 위한 계정을 만들어주세요</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "16px" }}
          />
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
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={pwConfirm}
            onChange={(e) => setPwConfirm(e.target.value)}
            style={{ padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "16px" }}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleSignup}
          style={{ padding: "16px", marginBottom: "24px" }}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

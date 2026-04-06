"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Bike } from "lucide-react";
import { login } from "@/lib/api";
import { API_CONFIG } from "@/lib/api/config";

export default function LoginView() {
  const router = useRouter();
  const params = useParams();

  // ✅ 타입 안전 lang 처리
  const rawLang = params.lang;
  const lang: "ko" | "en" = rawLang === "en" ? "en" : "ko";

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [emailError, setEmailError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ✅ 번역 텍스트
  const text = {
    ko: {
      title: "Seoul Renaissance Ride",
      subtitle: "탐방을 위해 로그인을 해주세요",
      emailPlaceholder: "이메일 (아이디)",
      passwordPlaceholder: "비밀번호",
      login: "로그인",
      social: "간편 로그인",
      kakao: "카카오로 시작하기",
      naver: "네이버로 시작하기",
      noAccount: "아직 계정이 없으신가요?",
      signup: "회원가입",
      emailRequired: "이메일과 비밀번호를 입력해주세요.",
      emailInvalid: "올바른 이메일 형식이 아닙니다.",
      loginError: "로그인 중 오류가 발생했습니다."
    },
    en: {
      title: "Seoul Renaissance Ride",
      subtitle: "Please log in to start your journey",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      login: "Login",
      social: "Social Login",
      kakao: "Continue with Kakao",
      naver: "Continue with Naver",
      noAccount: "Don't have an account?",
      signup: "Sign up",
      emailRequired: "Please enter email and password.",
      emailInvalid: "Invalid email format.",
      loginError: "An error occurred during login."
    }
  };

  const handleLogin = async () => {
    if (!id || !pw) {
      alert(text[lang].emailRequired);
      return;
    }

    if (!emailRegex.test(id)) {
      setEmailError(text[lang].emailInvalid);
      alert(text[lang].emailInvalid);
      return;
    }

    try {
      const res = await login(id, pw);
      if (res.success) {
        localStorage.setItem("isLoggedIn", "true");
        if (res.accessToken) localStorage.setItem("accessToken", res.accessToken);
        if (res.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);

        window.location.replace(`/${lang}`);
      } else {
        alert(res.message);
      }
    } catch (e) {
      alert(text[lang].loginError);
    }
  };

  return (
    <div className="container" style={{ padding: "0 20px", maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>

        {/* 🔥 로고 영역 */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#ecfdf5",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            marginBottom: "16px"
          }}>
            <Bike size={32} color="#10b981" />
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827" }}>
            {text[lang].title}
          </h1>

          <p style={{ color: "#6b7280", marginTop: "8px", fontSize: "14px" }}>
            {text[lang].subtitle}
          </p>
        </div>

        {/* 🔥 입력 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <input
              type="email"
              placeholder={text[lang].emailPlaceholder}
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                if (emailError) setEmailError("");
              }}
              style={{
                padding: "16px",
                borderRadius: "14px",
                border: `1px solid ${emailError ? "#ef4444" : "#e5e7eb"}`,
                fontSize: "16px",
                backgroundColor: "#f9fafb"
              }}
            />
            {emailError && (
              <p style={{ color: "#ef4444", fontSize: "12px" }}>
                {emailError}
              </p>
            )}
          </div>

          <input
            type="password"
            placeholder={text[lang].passwordPlaceholder}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={{
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              fontSize: "16px",
              backgroundColor: "#f9fafb"
            }}
          />
        </div>

        {/* 🔥 로그인 버튼 */}
        <button
          className="btn-primary"
          onClick={handleLogin}
          style={{ padding: "18px", borderRadius: "16px", fontWeight: "700", marginBottom: "24px" }}
        >
          {text[lang].login}
        </button>

        {/* 🔥 구분선 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
          <div style={{ padding: "0 12px", color: "#6b7280", fontSize: "12px" }}>
            {text[lang].social}
          </div>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
        </div>

        {/* 🔥 소셜 로그인 */}
        <button
          style={{ padding: "16px", borderRadius: "12px", backgroundColor: "#FEE500" }}
          onClick={() => {
            window.location.href = `${API_CONFIG.BASE_URL}/oauth2/authorization/kakao`;
          }}
        >
          {text[lang].kakao}
        </button>

        <button
          style={{ padding: "16px", borderRadius: "12px", backgroundColor: "#03C75A", color: "white", marginTop: "12px" }}
          onClick={() => {
            window.location.href = `${API_CONFIG.BASE_URL}/oauth2/authorization/naver`;
          }}
        >
          {text[lang].naver}
        </button>

        {/* 🔥 회원가입 */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          {text[lang].noAccount}{" "}
          <span
            style={{ color: "#59d58d", cursor: "pointer" }}
            onClick={() => router.push(`/${lang}/signup`)}
          >
            {text[lang].signup}
          </span>
        </div>
      </div>
    </div>
  );
}
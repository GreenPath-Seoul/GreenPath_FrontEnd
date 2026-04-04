"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bike, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { signup, login, checkEmail } from "@/lib/api";

export default function SignupView() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [name, setName] = useState("");

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwConfirmError, setPwConfirmError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

  const validateEmail = (val: string) => {
    if (!val) return "이메일을 입력해주세요.";
    if (!emailRegex.test(val)) return "올바른 이메일 형식이 아닙니다.";
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val) return "비밀번호를 입력해주세요.";
    if (!passwordRegex.test(val)) return "8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.";
    return "";
  };

  const handleEmailCheck = async () => {
    const error = validateEmail(id);
    if (error) {
      setEmailError(error);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const res = await checkEmail(id);
      if (res.success) {
        setIsEmailChecked(true);
        setEmailError("");
        alert("사용 가능한 이메일입니다.");
      } else {
        setIsEmailChecked(false);
        setEmailError(res.message || "이미 사용 중인 이메일입니다.");
      }
    } catch (e) {
      setEmailError("중복 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  useEffect(() => {
    setIsEmailChecked(false);
    if (id) {
      setEmailError(validateEmail(id));
    } else {
      setEmailError("");
    }
  }, [id]);

  useEffect(() => {
    if (pw) {
      setPwError(validatePassword(pw));
    } else {
      setPwError("");
    }
  }, [pw]);

  useEffect(() => {
    if (pwConfirm) {
      setPwConfirmError(pw !== pwConfirm ? "비밀번호가 일치하지 않습니다." : "");
    } else {
      setPwConfirmError("");
    }
  }, [pwConfirm, pw]);

  const handleSignup = async () => {
    const eErr = validateEmail(id);
    const pErr = validatePassword(pw);
    
    if (!name) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (eErr) {
      setEmailError(eErr);
      alert(eErr);
      return;
    }
    if (!isEmailChecked) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }
    if (pErr) {
      setPwError(pErr);
      alert(pErr);
      return;
    }
    if (pw !== pwConfirm) {
      setPwConfirmError("비밀번호가 일치하지 않습니다.");
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await signup(id, pw, name);
      if (res.success || res.message === "회원가입이 완료되었습니다.") {
        alert("회원가입이 완료되었습니다!");
        try {
          const loginRes = await login(id, pw);
          if (loginRes.success) {
            localStorage.setItem("isLoggedIn", "true");
            if (loginRes.accessToken) localStorage.setItem("accessToken", loginRes.accessToken);
            if (loginRes.refreshToken) localStorage.setItem("refreshToken", loginRes.refreshToken);
            router.push("/");
          } else {
            router.push("/login");
          }
        } catch (e) {
          router.push("/login");
        }
      } else {
        alert(res.message);
      }
    } catch (e) {
      alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container" style={{ padding: "0 20px", maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ padding: "20px 0", display: "flex", alignItems: "center" }}>
        <button
          onClick={() => router.back()}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            width: "40px", 
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#f9fafb",
            border: "none",
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={20} color="#111827" />
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: "20px" }}>
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
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", letterSpacing: "-0.5px" }}>Seoul Renaissance Ride</h1>
          <p style={{ color: "#6b7280", marginTop: "8px", fontSize: "14px" }}>나만의 탐방을 위한 계정을 만들어주세요</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
          {/* Name Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginLeft: "4px" }}>이름</label>
            <input
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ 
                padding: "16px", 
                borderRadius: "14px", 
                border: "1px solid #e5e7eb", 
                fontSize: "16px",
                backgroundColor: "#f9fafb",
                transition: "all 0.2s"
              }}
            />
          </div>

          {/* Email Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginLeft: "4px" }}>이메일</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input 
                  type="email" 
                  placeholder="example@email.com" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  style={{ 
                    width: "100%",
                    padding: "16px", 
                    paddingRight: isEmailChecked ? "40px" : "16px",
                    borderRadius: "14px", 
                    border: `1px solid ${emailError ? "#ef4444" : "#e5e7eb"}`, 
                    fontSize: "16px",
                    backgroundColor: "#f9fafb"
                  }}
                />
                {isEmailChecked && !emailError && (
                  <CheckCircle2 size={20} color="#10b981" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }} />
                )}
              </div>
              <button 
                onClick={handleEmailCheck}
                disabled={isCheckingEmail || !id || !!validateEmail(id)}
                style={{ 
                  padding: "0 16px", 
                  borderRadius: "14px", 
                  backgroundColor: isEmailChecked ? "#f3f4f6" : "#111827", 
                  color: isEmailChecked ? "#9ca3af" : "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  border: "none",
                  whiteSpace: "nowrap",
                  cursor: isCheckingEmail || !id || !!validateEmail(id) ? "default" : "pointer"
                }}
              >
                {isCheckingEmail ? "확인 중..." : "중복 확인"}
              </button>
            </div>
            {emailError && (
              <p style={{ color: "#ef4444", fontSize: "12px", marginLeft: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertCircle size={14} /> {emailError}
              </p>
            )}
            {isEmailChecked && !emailError && (
              <p style={{ color: "#10b981", fontSize: "12px", marginLeft: "4px" }}>사용 가능한 이메일입니다.</p>
            )}
          </div>

          {/* Password Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginLeft: "4px" }}>비밀번호</label>
            <input 
              type="password" 
              placeholder="비밀번호 입력" 
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              style={{ 
                padding: "16px", 
                borderRadius: "14px", 
                border: `1px solid ${pwError ? "#ef4444" : "#e5e7eb"}`, 
                fontSize: "16px",
                backgroundColor: "#f9fafb"
              }}
            />
            <p style={{ color: pwError ? "#ef4444" : "#6b7280", fontSize: "12px", marginLeft: "4px", lineHeight: "1.4" }}>
              * 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.
            </p>
          </div>

          {/* Password Confirm Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginLeft: "4px" }}>비밀번호 확인</label>
            <input 
              type="password" 
              placeholder="비밀번호 재입력" 
              value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)}
              style={{ 
                padding: "16px", 
                borderRadius: "14px", 
                border: `1px solid ${pwConfirmError ? "#ef4444" : "#e5e7eb"}`, 
                fontSize: "16px",
                backgroundColor: "#f9fafb"
              }}
            />
            {pwConfirmError && (
              <p style={{ color: "#ef4444", fontSize: "12px", marginLeft: "4px" }}>{pwConfirmError}</p>
            )}
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleSignup}
          style={{ 
            padding: "18px", 
            borderRadius: "16px",
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "40px",
            boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
            opacity: (!isEmailChecked || !!pwError || !!pwConfirmError || !name) ? 0.7 : 1
          }}
        >
          회원가입 완료
        </button>
      </div>
    </div>
  );
}


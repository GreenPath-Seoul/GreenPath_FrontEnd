"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("token") || searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      alert(`로그인 실패: ${error}`);
      router.push("/login");
      return;
    }

    if (accessToken) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      // Redirect to home page after successful login
      router.push("/");
    } else {
      // If no token, something went wrong, go back to login
      alert("로그인 중 오류가 발생했습니다.");
      router.push("/login");
    }
  }, [router, searchParams]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="loading-spinner"></div>
      <p style={{ marginTop: '20px', color: '#6b7280' }}>로그인 중입니다...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthCallbackContent />
    </Suspense>
  );
}

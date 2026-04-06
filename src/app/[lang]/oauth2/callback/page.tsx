"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Suspense } from "react";

function OAuth2CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = (params.lang as string) || "ko";

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      alert(`로그인 실패: ${error}`);
      router.push(`/${lang}/login`);
      return;
    }

    if (accessToken) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      // Redirect to home page after successful login
      router.push(`/${lang}`);
    } else {
      // If no token, something went wrong, go back to login
      // alert("로그인 중 오류가 발생했습니다.");
      // router.push(`/${lang}/login`);
    }
  }, [router, searchParams, lang]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p style={{ marginTop: '20px', color: '#6b7280' }}>로그인 중입니다...</p>
    </div>
  );
}

export default function OAuth2CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuth2CallbackContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { Bike, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { savePreference, recommendCourse } from "@/lib/api";

const moodMap: Record<string, string> = {
  "조용한 곳": "QUIET",
  "사진 명소": "PHOTO",
  "역사 중심": "HISTORY",
  "힙한 골목": "HIP",
};
const timeMap: Record<string, string> = {
  "1시간": "ONE_HOUR",
  "2시간": "TWO_HOURS",
  "반나절": "HALF_DAY",
};
const levelMap: Record<string, string> = {
  "초급 (평지)": "EASY",
  "중급": "MEDIUM",
  "상관없음": "ANY",
};
const locationMap: Record<string, string> = {
  "현재 위치 주변": "NEARBY",
  "상관없음": "ANY",
};

export default function HomeView() {
  const router = useRouter();
  const [mood, setMood] = useState("조용한 곳");
  const [time, setTime] = useState("1시간");
  const [difficulty, setDifficulty] = useState("초급 (평지)");
  const [locationChoice, setLocationChoice] = useState("현재 위치 주변");
  const [isLoading, setIsLoading] = useState(false);

  const moods = ["조용한 곳", "사진 명소", "역사 중심", "힙한 골목"];
  const times = ["1시간", "2시간", "반나절"];
  const difficulties = ["초급 (평지)", "중급", "상관없음"];
  const locations = ["현재 위치 주변", "상관없음"];

  const handleRecommend = async () => {
    // 로그인 체크 강화
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const hasToken = !!localStorage.getItem("accessToken");

    if (!isLoggedIn || !hasToken) {
      alert("AI 코스 추천을 받으려면 로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      // 위치 정보 가져오기 (비동기)
      let latitude = 37.5665;
      let longitude = 126.9780;

      if (locationChoice === "현재 위치 주변" && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (e) {
          console.warn("Location access denied, using default Seoul coordinates.");
        }
      }

      const response = await recommendCourse({
        mood: moodMap[mood],
        duration: timeMap[time],
        level: levelMap[difficulty],
        location: locationMap[locationChoice],
        latitude,
        longitude
      });
      
      // 👉 배열 저장
    if (response && response.length > 0) {
      localStorage.setItem("recommendedCourses", JSON.stringify(response));
    }

      
      router.push("/course");
    } catch (error) {
      console.error("Failed to save preference:", error);
      // 실패해도 일단 코스 페이지로 이동하도록 처리 (백엔드 확인용)
      router.push("/course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <header className="header">
          <div className="header-title">
            <Bike size={24} color="#59d58d" />
            <span style={{ color: "black", letterSpacing: "-0.5px" }}>Seoul Renaissance Ride</span>
          </div>
          <div className="header-subtitle">AI가 추천하는 서울 문화재 따릉이 여행</div>
        </header>

        <div className="section" style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px", color: "black" }}>
            오늘 어떤 여행을 하고 싶나요?
          </div>

          <div className="section-title">분위기</div>
          <div className="chips-row">
            {moods.map((m) => (
              <button
                key={m}
                className={`chip ${mood === m ? "active" : ""}`}
                onClick={() => setMood(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title">시간</div>
          <div className="chips-row">
            {times.map((t) => (
              <button
                key={t}
                className={`chip ${time === t ? "active" : ""}`}
                onClick={() => setTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title">난이도</div>
          <div className="chips-row">
            {difficulties.map((d) => (
              <button
                key={d}
                className={`chip ${difficulty === d ? "active" : ""}`}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title">위치</div>
          <div className="chips-row">
            {locations.map((l) => (
              <button
                key={l}
                className={`chip ${locationChoice === l ? "active" : ""}`}
                onClick={() => setLocationChoice(l)}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {l === "현재 위치 주변" && <MapPin size={14} />}
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed-bottom">
        <button
          className="btn-primary"
          onClick={handleRecommend}
          disabled={isLoading}
        >
          {isLoading ? "코스 분석 중..." : "AI 코스 추천 받기"}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

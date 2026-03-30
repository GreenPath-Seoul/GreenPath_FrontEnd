"use client";

import { useState } from "react";
import { Bike } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

export default function HomeView() {
  const router = useRouter();
  const [mood, setMood] = useState("조용한 곳");
  const [time, setTime] = useState("1시간");
  const [difficulty, setDifficulty] = useState("초급 (평지)");

  const moods = ["조용한 곳", "사진 명소", "역사 중심", "힙한 골목"];
  const times = ["1시간", "2시간", "반나절"];
  const difficulties = ["초급 (평지)", "중급", "상관없음"];

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

        <div className="fixed-bottom">
          <button
            className="btn-primary"
            onClick={() => {
              if (localStorage.getItem("isLoggedIn") === "true") {
                router.push("/course");
              } else {
                router.push("/login");
              }
            }}
          >
            AI 코스 추천 받기
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Bike, MapPin, Languages } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { recommendCourse } from "@/lib/api";
import Link from "next/link";

interface Props {
  dictionary: any;
  lang: string;
}

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

export default function HomeClient({ dictionary, lang }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [mood, setMood] = useState("조용한 곳");
  const [time, setTime] = useState("1시간");
  const [difficulty, setDifficulty] = useState("초급 (평지)");
  const [locationChoice, setLocationChoice] = useState("현재 위치 주변");
  const [preferenceText, setPreferenceText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const moods = ["조용한 곳", "사진 명소", "역사 중심", "힙한 골목"];
  const times = ["1시간", "2시간", "반나절"];
  const difficulties = ["초급 (평지)", "중급", "상관없음"];
  const locations = ["현재 위치 주변", "상관없음"];

  const handleRecommend = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const hasToken = !!localStorage.getItem("accessToken");

    if (!isLoggedIn || !hasToken) {
      alert(dictionary.main.loginAlert);
      router.push(`/${lang}/login`);
      return;
    }

    setIsLoading(true);
    try {
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
        longitude,
        preferenceText: preferenceText.trim()
      });
      
      if (response && response.length > 0) {
        localStorage.setItem("recommendedCourses", JSON.stringify(response));
      }
      
      router.push(`/${lang}/course`);
    } catch (error) {
      console.error("Failed to save preference:", error);
      router.push(`/${lang}/course`);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectedPathname = (locale: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="container">
      <div className="content">
        <header className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="header-left">
            <div className="header-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bike size={24} color="#59d58d" />
              <span style={{ color: "black", letterSpacing: "-0.5px", fontWeight: "bold" }}>{dictionary.main.title}</span>
            </div>
            <div className="header-subtitle" style={{ fontSize: "13px", color: "#666" }}>{dictionary.main.subtitle}</div>
          </div>
          
          <div className="header-right">
            <div className="locale-switcher" style={{ display: "flex", gap: "8px", alignItems: "center", background: "#f5f5f5", padding: "4px 12px", borderRadius: "20px" }}>
              <Languages size={16} color="#666" />
              <Link 
                href={redirectedPathname("ko")} 
                style={{ fontSize: "12px", fontWeight: lang === "ko" ? "bold" : "normal", color: lang === "ko" ? "#59d58d" : "#999", textDecoration: "none" }}
              >
                KO
              </Link>
              <span style={{ color: "#ddd", fontSize: "12px" }}>|</span>
              <Link 
                href={redirectedPathname("en")} 
                style={{ fontSize: "12px", fontWeight: lang === "en" ? "bold" : "normal", color: lang === "en" ? "#59d58d" : "#999", textDecoration: "none" }}
              >
                EN
              </Link>
            </div>
          </div>
        </header>

        <div className="section" style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px", color: "black" }}>
            {dictionary.main.question}
          </div>

          <div className="section-title">{dictionary.main.mood}</div>
          <div className="chips-row">
            {moods.map((m) => (
              <button
                key={m}
                className={`chip ${mood === m ? "active" : ""}`}
                onClick={() => setMood(m)}
              >
                {dictionary.main.moods[m]}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title">{dictionary.main.time}</div>
          <div className="chips-row">
            {times.map((t) => (
              <button
                key={t}
                className={`chip ${time === t ? "active" : ""}`}
                onClick={() => setTime(t)}
              >
                {dictionary.main.times[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title">{dictionary.main.difficulty}</div>
          <div className="chips-row">
            {difficulties.map((d) => (
              <button
                key={d}
                className={`chip ${difficulty === d ? "active" : ""}`}
                onClick={() => setDifficulty(d)}
              >
                {dictionary.main.levels[d]}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title">{dictionary.main.location}</div>
          <div className="chips-row">
            {locations.map((l) => (
              <button
                key={l}
                className={`chip ${locationChoice === l ? "active" : ""}`}
                onClick={() => setLocationChoice(l)}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {l === "현재 위치 주변" && <MapPin size={14} />}
                {dictionary.main.locations[l]}
              </button>
            ))}
          </div>
        </div>

        <div className="section" style={{ paddingBottom: "40px" }}>
          <div className="section-title">{dictionary.main.preference}</div>
          <textarea
            className="textarea-input"
            value={preferenceText}
            onChange={(e) => setPreferenceText(e.target.value)}
            placeholder={dictionary.main.preferencePlaceholder}
          />
        </div>
      </div>
      <div className="fixed-bottom">
        <button
          className="btn-primary"
          onClick={handleRecommend}
          disabled={isLoading}
        >
          {isLoading ? dictionary.main.analyzing : dictionary.main.recommendBtn}
        </button>
      </div>

      <BottomNav lang={lang} dictionary={dictionary.nav} />
    </div>
  );
}

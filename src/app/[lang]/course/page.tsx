"use client";

import { useRouter, useParams } from "next/navigation";
import { MapPin, Clock, Leaf } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";

export default function CourseListView() {
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as "ko" | "en") || "ko";  
  const [courses, setCourses] = useState<any[]>([]);

  // ✅ 번역 텍스트
  const text = {
    ko: {
      title: "추천 코스",
      subtitle: "AI가 선별한 당신만의 따릉이 여행",
      emptyTitle: "추천받은 코스가 없습니다",
      emptyDesc: "취향에 맞는 코스를 추천받아 보세요!",
      button: "추천 받으러 가기",
      minutes: "분"
    },
    en: {
      title: "Recommended Courses",
      subtitle: "AI-curated bike trips just for you",
      emptyTitle: "No recommended courses",
      emptyDesc: "Get recommendations tailored to your preferences!",
      button: "Get Recommendations",
      minutes: "min"
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("recommendedCourses");
    if (saved) {
      setCourses(JSON.parse(saved));
    }
  }, []);

  // ✅ 데이터 없을 때
  if (!courses.length) {
    return (
      <div 
        style={{ 
          background: "#f3f4f6", 
          display: "flex", 
          justifyContent: "center", 
          minHeight: "100vh" 
        }}
      >
        <div 
          style={{ 
            width: "100%", 
            maxWidth: "430px", 
            background: "#eef8f3", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>🗺️</div>

          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>
            {text[lang].emptyTitle}
          </h2>

          <p style={{ color: "#6b7280", textAlign: "center", marginBottom: "30px" }}>
            {text[lang].emptyDesc}
          </p>

          <button 
            className="btn-primary" 
            onClick={() => router.push(`/${lang}`)}
          >
            {text[lang].button}
          </button>

          <div style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: "430px" }}>
            <BottomNav lang={lang} />
          </div>
        </div>
      </div>
    );
  }

  // ✅ 정상 화면
  return (
    <div
      style={{
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#eef8f3",
          minHeight: "100vh",
          position: "relative"
        }}
      >
        <div style={{ padding: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700" }}>
            {text[lang].title}
          </h1>

          <p style={{ color: "#6b7280" }}>
            {text[lang].subtitle}
          </p>
        </div>

        <div
          style={{
            padding: "0 20px 100px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          {courses.map((course, idx) => (
            <div
              key={idx}
              onClick={() => {
                localStorage.setItem("selectedCourse", JSON.stringify(course));
                router.push(`/${lang}/course/${course.courseId || idx}`);
              }}
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer"
              }}
            >
              <div style={{ width: "100%", height: "180px", backgroundColor: "#e5e7eb" }}>
                <img
                  src={course.stops?.[0]?.imageUrl || "https://picsum.photos/600/300"}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt={course.title}
                />
              </div>

              <div style={{ padding: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                  {course.title} {/* ✅ DB는 그대로 */}
                </h2>

                <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                  <span>
                    <MapPin size={14}/> {course.summary?.distanceKm}km
                  </span>

                  <span>
                    <Clock size={14}/> {course.summary?.durationMinutes}{text[lang].minutes}
                  </span>

                  <span>
                    <Leaf size={14}/> {course.summary?.carbonReductionKg}kg
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: "100px" }} />

        <div style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: "430px", zIndex: 100 }}>
          <BottomNav lang={lang} />
        </div>
      </div>
    </div>
  );
}
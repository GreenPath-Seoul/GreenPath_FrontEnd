"use client";

import { useRouter } from "next/navigation";
import { MapPin, Clock, Leaf } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";

export default function CourseListView() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recommendedCourses");
    if (saved) {
      setCourses(JSON.parse(saved));
    }
  }, []);

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
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>추천받은 코스가 없습니다</h2>
          <p style={{ color: "#6b7280", textAlign: "center", marginBottom: "30px" }}>
            취향에 맞는 코스를 추천받아 보세요!
          </p>
          <button 
            className="btn-primary" 
            onClick={() => router.push("/")}
          >
            추천 받으러 가기
          </button>
          <div style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: "430px" }}>
            <BottomNav />
          </div>
        </div>
      </div>
    );
  }

  return (
    // ✅ 바깥 (회색 배경 + 가운데 정렬)
    <div
      style={{
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh"
      }}
    >
      {/* ✅ 모바일 화면 */}
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#eef8f3",
          minHeight: "100vh",
          position: "relative"
        }}
      >
        {/* 상단 */}
        <div style={{ padding: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700" }}>
            추천 코스
          </h1>
          <p style={{ color: "#6b7280" }}>
            AI가 선별한 당신만의 따릉이 여행
          </p>
        </div>

        {/* 리스트 */}
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
                router.push(`/course/${course.courseId || idx}`);
              }}
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer"
              }}
            >
              <div style={{ width: "100%", height: "180px", backgroundColor: "#e5e7eb", position: "relative" }}>
                <img
                  src={course.imageUrl || "https://picsum.photos/600/300"}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt={course.title}
                />
              </div>

              <div style={{ padding: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                  {course.title}
                </h2>

                <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                  <span><MapPin size={14}/> {course.summary?.distanceKm}km</span>
                  <span><Clock size={14}/> {course.summary?.durationMinutes}분</span>
                  <span><Leaf size={14}/> {course.summary?.carbonReductionKg}kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 네비게이션 가림 방지 여백 */}
        <div style={{ height: "100px" }} />

        {/* 하단 네비 */}
        <div style={{ position: "fixed", bottom: 0, width: "100%", maxWidth: "430px", zIndex: 100 }}>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MapPin, Clock, Leaf } from "lucide-react";
import { getCourseDetail } from "@/lib/api";
import BottomNav from "@/components/BottomNav";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params.id);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        const res = await getCourseDetail(courseId);
        setData(res);
      } catch (e) {
        console.error(e);
        alert("코스 불러오기 실패");
      }
    };

    fetchData();
  }, [courseId]);

  if (!data) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f3f4f6' }}>Loading...</div>;

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
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ flex: 1, paddingBottom: "100px" }}>
          <img
            src={data.imageUrl || "https://picsum.photos/600/300"}
            style={{ width: "100%", height: "220px", objectFit: "cover" }}
          />

          <div style={{ padding: "20px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: "700" }}>
              {data.title}
            </h1>

            <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
              <span><MapPin size={16}/> {data.summary?.distanceKm}km</span>
              <span><Clock size={16}/> {data.summary?.durationMinutes}분</span>
              <span><Leaf size={16}/> {data.summary?.carbonReductionKg}kg</span>
            </div>

            <h2 style={{ marginTop: "24px", fontSize: "18px" }}>경유지</h2>

            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {data.stops?.map((stop: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: "white",
                    padding: "12px",
                    borderRadius: "10px"
                  }}
                >
                  <div style={{ fontWeight: "600" }}>
                    {idx + 1}. {stop.name}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>
                    {stop.description}
                  </div>
                </div>
              ))}
            </div>

            <button
              style={{ marginTop: "30px" }}
              className="btn-primary"
              onClick={() => {
                localStorage.setItem("currentCourseId", String(courseId));
                localStorage.setItem("currentStopOrder", "1");
                localStorage.setItem("currentCourseData", JSON.stringify(data));
                router.push("/navigation");
              }}
            >
              이 코스로 이동하기
            </button>
          </div>
        </div>

        <div style={{ position: "sticky", bottom: 0, zIndex: 1000 }}>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
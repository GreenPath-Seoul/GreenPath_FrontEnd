"use client";

import { useState, useEffect } from "react";
import { Bike, MapPin, Bell, ChevronRight, MessageSquare, Compass, Send, User, Clock, Zap } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { recommendCourse, getCurrentWeather, getRandomCourses } from "@/lib/api";
import Link from "next/link";
import styles from "./home.module.css";

interface Props {
  dictionary: any;
  lang: "ko" | "en";
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

export default function HomeClient({ dictionary, lang }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  
  // View state: 'home' or 'chat'
  const [view, setView] = useState<'home' | 'chat'>('home');
  
  // Data state
  const [weather, setWeather] = useState<any>(null);
  const [popularCourses, setPopularCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Chat state
  const [chatStep, setChatStep] = useState(1);
  const [mood, setMood] = useState("");
  const [time, setTime] = useState("");
  const [activity, setActivity] = useState("");
  const [locationPref, setLocationPref] = useState("ANY");
  const [preferenceText, setPreferenceText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weatherData, coursesData] = await Promise.all([
          getCurrentWeather(),
          getRandomCourses()
        ]) as [any, any[]];
        
        setWeather(weatherData);
        if (coursesData) {
          setPopularCourses(coursesData.slice(0, 3)); 
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };

    const checkPending = async () => {
      const pending = localStorage.getItem("pendingRecommendation");
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const hasToken = !!localStorage.getItem("accessToken");

      if (pending && isLoggedIn && hasToken) {
        const parsed = JSON.parse(pending);
        // 로그인 후 정보를 바로 추천 API로 연결
        await performRecommendation(parsed);
      }
    };
    
    fetchData();
    checkPending();
  }, []);

  const performRecommendation = async (recommendParams: any) => {
    setIsLoading(true);
    try {
      // AI 추천 통합을 위한 기본 좌표 (서울시청)
      let latitude = 37.5665;
      let longitude = 126.9780;

      // 현재 위치 주변 요청 시 좌표 가져오기 시도
      if (recommendParams.location === "NEARBY" && typeof navigator !== "undefined") {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
        } catch (e) {
          console.warn("위치 정보를 가져오지 못했습니다. 기본 좌표를 사용합니다.", e);
        }
      }

      const response = await recommendCourse({
        mood: moodMap[recommendParams.mood] || "QUIET",
        duration: timeMap[recommendParams.time] || "ONE_HOUR",
        level: "ANY",
        location: recommendParams.location || "ANY",
        latitude,
        longitude,
        preferenceText: (recommendParams.preferenceText || "").trim()
      });
      
      if (response && response.length > 0) {
        localStorage.setItem("recommendedCourses", JSON.stringify(response));
      }
      
      router.push(`/${lang}/course`);
    } catch (error) {
      console.error("Failed to recommend course:", error);
      router.push(`/${lang}/course`);
    } finally {
      setIsLoading(false);
      localStorage.removeItem("pendingRecommendation");
    }
  };

  const handleRecommend = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const hasToken = !!localStorage.getItem("accessToken");

    const currentParams = { mood, time, activity, location: locationPref, preferenceText };

    if (!isLoggedIn || !hasToken) {
      // 로그인 전 상태 저장
      localStorage.setItem("pendingRecommendation", JSON.stringify(currentParams));
      alert(dictionary.main.loginAlert);
      router.push(`/${lang}/login`);
      return;
    }

    await performRecommendation(currentParams);
  };

  const handleViewRandom = async () => {
    setIsLoading(true);
    try {
      const response = await getRandomCourses();
      if (response && response.length > 0) {
        localStorage.setItem("recommendedCourses", JSON.stringify(response));
      }
      router.push(`/${lang}/course`);
    } catch (error) {
      console.error("Failed to fetch random courses:", error);
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

  if (view === 'chat') {
    return (
      <div className="container">
        <div className={styles.chatContainer}>
          <header className={styles.homeHeader} style={{ padding: '20px' }}>
            <button onClick={() => setView('home')} className={styles.iconButton}>
              <ChevronRight style={{ transform: 'rotate(180deg)' }} />
            </button>
            <div className={styles.sectionTitle} style={{ margin: 0 }}>GreenPath AI</div>
            <div style={{ width: 24 }} />
          </header>

          <div className={styles.chatMessages} style={{ display: 'flex', flexDirection: 'column' }}>
            {chatStep === 1 && (
              <>
                <div className={styles.botBubble}>
                  <div className={styles.botAvatar}>
                    <img src="/assets/images/bot.png" alt="Bot" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain' }} />
                  </div>
                  <div className={styles.speechBubble}>
                    오늘 기분에 맞는 코스를 추천해드릴게요! 기분이 어떤가요?
                  </div>
                </div>
                <div className={styles.optionList}>
                  {[
                    { title: "조용한 산책 코스", desc: "자연 속에서 힐링해요.", icon: "🌿" },
                    { title: "인생샷 남기고 싶어요", desc: "인생샷을 남겨보세요!", icon: "📸" },
                    { title: "역사 탐방 좋아요", desc: "도심 속 역사 여행", icon: "🏛️" }
                  ].map((option) => (
                    <button 
                      key={option.title} 
                      className={`${styles.optionBtn} ${mood === option.title ? styles.selected : ""}`}
                      onClick={() => {
                        setMood(option.title);
                        setChatStep(2);
                      }}
                    >
                      <div className={styles.optionLeft}>
                        <span className={styles.optionIcon}>{option.icon}</span>
                        <div className={styles.optionInfo}>
                          <span className={styles.optionTitle}>{option.title}</span>
                          <span className={styles.optionDesc}>{option.desc}</span>
                        </div>
                      </div>
                      <ChevronRight size={20} color="#cbd5e1" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {chatStep === 2 && (
              <>
                <div className={styles.botBubble}>
                  <div className={styles.botAvatar}>
                    <img src="/assets/images/bot.png" alt="Bot" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain' }} />
                  </div>
                  <div className={styles.speechBubble}>얼마나 시간 있으세요?</div>
                </div>
                <div className={styles.optionList}>
                  {[
                    { title: "잠깐 힐링", desc: "1시간", icon: "⚡" },
                    { title: "여유 산책", desc: "2시간", icon: "🚶" },
                    { title: "제대로 즐기기", desc: "반나절", icon: "🏝️" }
                  ].map((option) => (
                    <button 
                      key={option.title} 
                      className={`${styles.optionBtn} ${time === option.desc ? styles.selected : ""}`}
                      onClick={() => {
                        setTime(option.desc);
                        setChatStep(3);
                      }}
                    >
                      <div className={styles.optionLeft}>
                        <span className={styles.optionIcon}>{option.icon}</span>
                        <div className={styles.optionInfo}>
                          <span className={styles.optionTitle}>{option.title} ({option.desc})</span>
                          <span className={styles.optionDesc}>부담 없이 즐기기 좋은 코스</span>
                        </div>
                      </div>
                      <ChevronRight size={20} color="#cbd5e1" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {chatStep === 3 && (
              <>
                <div className={styles.botBubble}>
                  <div className={styles.botAvatar}>
                    <img src="/assets/images/bot.png" alt="Bot" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain' }} />
                  </div>
                  <div className={styles.speechBubble}>얼마나 움직이고 싶나요?</div>
                </div>
                <div className={styles.optionList}>
                  {[
                    { title: "가볍게 걷기", desc: "거북이 모드", icon: "🐢" },
                    { title: "적당히 활동", desc: "딱 알맞은 정도", icon: "🚴" },
                    { title: "제대로 움직이기", desc: "활동적인 당신에게", icon: "🔥" }
                  ].map((option) => (
                    <button 
                      key={option.title} 
                      className={`${styles.optionBtn} ${activity === option.title ? styles.selected : ""}`}
                      onClick={() => {
                        setActivity(option.title);
                        setChatStep(4);
                      }}
                    >
                      <div className={styles.optionLeft}>
                        <span className={styles.optionIcon}>{option.icon}</span>
                        <div className={styles.optionInfo}>
                          <span className={styles.optionTitle}>{option.title}</span>
                          <span className={styles.optionDesc}>{option.desc}</span>
                        </div>
                      </div>
                      <ChevronRight size={20} color="#cbd5e1" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {chatStep === 4 && (
              <>
                <div className={styles.botBubble}>
                  <div className={styles.botAvatar}>
                    <img src="/assets/images/bot.png" alt="Bot" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain' }} />
                  </div>
                  <div className={styles.speechBubble}>어디서 탐방하고 싶으신가요?</div>
                </div>
                <div className={styles.optionList}>
                  {[
                    { title: "내 주변", desc: "현재 위치 가깝게", icon: "📍", value: "NEARBY" },
                    { title: "어디든 좋아요", desc: "서울 전체 추천", icon: "🗺️", value: "ANY" }
                  ].map((option) => (
                    <button 
                      key={option.title} 
                      className={`${styles.optionBtn} ${locationPref === option.value ? styles.selected : ""}`}
                      onClick={() => {
                        setLocationPref(option.value);
                        setChatStep(5);
                      }}
                    >
                      <div className={styles.optionLeft}>
                        <span className={styles.optionIcon}>{option.icon}</span>
                        <div className={styles.optionInfo}>
                          <span className={styles.optionTitle}>{option.title}</span>
                          <span className={styles.optionDesc}>{option.desc}</span>
                        </div>
                      </div>
                      <ChevronRight size={20} color="#cbd5e1" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {chatStep === 5 && (
              <>
                <div className={styles.botBubble}>
                  <div className={styles.botAvatar}>
                    <img src="/assets/images/bot.png" alt="Bot" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain' }} />
                  </div>
                  <div className={styles.speechBubble}>마지막으로 원하는 게 있다면 입력해주세요!</div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <textarea 
                    className={styles.inputField} 
                    placeholder='예: "역주변 맛집이 많은 코스 가고 싶어요, 한강가고싶어요!"'
                    value={preferenceText}
                    onChange={(e) => setPreferenceText(e.target.value)}
                    rows={4}
                  />
                </div>
              </>
            )}
          </div>

          <div className={styles.chatFooter}>
            <div className={styles.stepIndicator}>
              {[1, 2, 3, 4, 5].map(s => (
                <div 
                  key={s} 
                  className={`${styles.dot} ${chatStep === s ? styles.active : ""}`} 
                  onClick={() => setChatStep(s)}
                  style={{ cursor: s <= chatStep ? 'pointer' : 'default', padding: '10px' }}
                />
              ))}
            </div>
            <button 
              className={`${styles.submitBtn} ${chatStep === 5 ? styles.active : styles.disabled}`}
              disabled={chatStep < 5 || isLoading}
              onClick={handleRecommend}
            >
              {isLoading ? "분석 중..." : "AI 코스 추천 받기"}
            </button>
          </div>
        </div>
        <BottomNav lang={lang} dictionary={dictionary.nav} />
      </div>
    );
  }

  return (
    <div className="container">
      <div className={`${styles.homeContainer} content`}>
        <header className={styles.homeHeader}>
          <div className={styles.recommendBadge}>
            <Compass size={14} />
            추천
          </div>
          <button className={styles.iconButton}>
            <Bell size={20} />
          </button>
        </header>

        <h1 className={styles.welcomeText}>
          👋 오늘은 어떤 코스로 떠나볼까요?
        </h1>

        <div className={styles.weatherCard}>
          <div className={styles.weatherContent}>
            <div className={styles.weatherStatus}>
              {weather?.temp ? `🌡️ 현재 기온은 ${weather.temp}°C !` : "☀️ 오늘 날씨가 정말 좋아요!"}
            </div>
            <div className={styles.weatherDesc}>
              {weather?.rainType && weather.rainType !== "0" ? "비 소식이 있으니 주의하세요 ☔" : "지금 떠나기 딱이에요🚴‍♂️"}
            </div>
            <button className={styles.aiBtn} onClick={() => setView('chat')}>
              AI 코스 추천 받기 <ChevronRight size={16} />
            </button>
          </div>
          {/* 날씨 관련 일러스트 (더미 데이터로 대체) */}
          <div className={styles.weatherImage}>
            <Bike size={120} color="rgba(89, 213, 141, 0.2)" strokeWidth={1} />
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEmoji}>🔥</span>
            <span className={styles.sectionTitle}>인기 코스</span>
          </div>
          <div className={styles.courseScroll}>
            {popularCourses.length > 0 ? (
              popularCourses.map((course, idx) => (
                <div 
                  key={idx} 
                  className={styles.courseCard}
                  onClick={() => {
                    localStorage.setItem("selectedCourse", JSON.stringify(course));
                    router.push(`/${lang}/course/${course.courseId || idx}`);
                  }}
                >
                  <img 
                    src={course.stops?.[0]?.imageUrl || `https://picsum.photos/seed/${course.courseId || idx}/300/200`} 
                    className={styles.courseImage} 
                    alt={course.title}
                  />
                  <div className={styles.courseInfo}>
                    <div className={styles.courseName}>
                      {idx === 0 ? "🌿" : idx === 1 ? "📸" : "🏛️"} {course.title}
                    </div>
                    <div className={styles.courseSummary}>
                      인생샷을 남겨보세요!
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty state or skeleton
              [1, 2, 3].map(i => (
                <div key={i} className={styles.courseCard} style={{ background: '#f8fafc', height: 210 }}></div>
              ))
            )}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEmoji}>🎲</span>
            <span className={styles.sectionTitle}>랜덤 추천</span>
          </div>
          <div className={styles.randomRecommendBox} onClick={handleViewRandom}>
            <div className={styles.randomContent}>
              <div className={styles.randomIcon}><Compass /></div>
              <span className={styles.randomText}>오늘의 추천 코스 보기</span>
            </div>
            <ChevronRight size={18} color="#94a3b8" />
          </div>
        </section>
      </div>

      <BottomNav lang={lang} dictionary={dictionary.nav} />
    </div>
  );
}

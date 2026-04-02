import { CourseRecommendation, NavigationInfo, ExplorationRecord, UserProfile, AuthResponse } from "../types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getCourseRecommendation = async (mood: string, time: string, difficulty: string): Promise<CourseRecommendation> => {
  await delay(500); 
  
  return {
    id: "course_123",
    title: "조용한 한옥 골목 힐링 라이딩",
    subtitle: "AI가 선별한 당신만의 코스",
    distance: 4.2,
    duration: "1시간 30분",
    difficulty: "쉬움",
    carbonReduction: 1.2,
    stops: [
      {
        id: 1,
        name: "성북동 고택",
        desc: "조선시대 양반가의 전통 한옥",
        time: "제류 시간: 20분",
        imgHover: "https://images.unsplash.com/photo-1542159676-47b2ae60baf4?auto=format&fit=crop&q=80&w=150"
      },
      {
        id: 2,
        name: "종로 골목 문화재",
        desc: "숨겨진 보물 같은 작은 사당",
        time: "제류 시간: 15분",
        imgHover: "https://images.unsplash.com/photo-1563725547608-41dfa921d7b0?auto=format&fit=crop&q=80&w=150"
      },
      {
        id: 3,
        name: "숨은 한옥 카페",
        desc: "전통과 현대가 공존하는 휴식 공간",
        time: "제류 시간: 30분",
        imgHover: "https://images.unsplash.com/photo-1506466904629-45914fb0acb7?auto=format&fit=crop&q=80&w=150"
      }
    ]
  };
};

export const getNavigationInfo = async (courseId: string): Promise<NavigationInfo> => {
  await delay(300);
  
  return {
    nextDestination: "성북동 고택",
    eta: "약 5분",
    distanceRemaining: "850m",
    segments: [
      { type: "warning", message: "500m 앞 차량 주의 구간" },
      { type: "gradient", message: "1.2km 지점 경사 구간 (10%)" },
      { type: "eco", message: "2km 지점 쾌적한 숲길" }
    ]
  };
};

export const getExplorationRecord = async (recordId: string): Promise<ExplorationRecord> => {
  await delay(400);

  return {
    totalDistance: 4.2,
    totalDuration: "1시간 32분",
    visitedSites: 3,
    carbonReduction: 1.4,
    carbonEquivalent: "나무 약 0.3그루가 하루 동안 흡수하는 양",
    rewards: {
      completion: 50,
      firstVisit: 20,
      total: 70
    },
    badge: {
      name: "첫 한옥 마스터",
      iconType: "Landmark"
    }
  };
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  await delay(400);

  return {
    name: "라이더",
    role: "친환경 여행자",
    totalCarbonReduction: 12.4,
    carbonEquivalent: "나무 약 2.8그루가 하루 동안 흡수하는 양",
    totalVisitedSites: 15,
    totalPoints: 350,
    badges: [
      { name: "한옥 마스터", iconType: "Landmark" },
      { name: "라이더", iconType: "Bike" },
      { name: "친환경", iconType: "Leaf" },
      { name: "포토그래퍼", iconType: "Camera" },
      { name: "탐험가", iconType: "MapIcon" },
      { name: "별빛", iconType: "Star" }
    ],
    recentRecords: [
      { title: "조용한 한옥 골목", date: "2026.03.29", point: "+70P" },
      { title: "역사 속으로 시간여행", date: "2026.03.25", point: "+85P" },
      { title: "한강변 힐링 라이딩", date: "2026.03.20", point: "+60P" }
    ]
  };
};

// Auth Mock API
export const login = async (id: string, pw: string): Promise<AuthResponse> => {
  await delay(500);

  if (id === "test1234" && pw === "test1234") {
    return {
      success: true,
      message: "로그인 성공",
      user: {
        id: "user_123",
        username: "test1234",
        name: "테스터"
      },
      accessToken: "mock-jwt-token"
    };
  }

  return {
    success: false,
    message: "아이디 또는 비밀번호가 일치하지 않습니다.\n테스트 계정: test1234 / test1234"
  };
};

export const signup = async (id: string, pw: string, name: string): Promise<AuthResponse> => {
  await delay(800);

  return {
    success: true,
    message: "회원가입이 완료되었습니다.",
    user: {
      id: "user_new",
      username: id,
      name: name
    },
    accessToken: "mock-new-jwt-token"
  };
};

export const logout = async (): Promise<AuthResponse> => {
  await delay(300);
  return {
    success: true,
    message: "로그아웃 되었습니다."
  };
};

export interface CourseRecommendation {
  id: string;
  title: string;
  subtitle: string;
  distance: number; // km
  duration: string;
  difficulty: string;
  carbonReduction: number; // kg
  stops: {
    id: number;
    name: string;
    desc: string;
    time: string;
    imgHover: string;
  }[];
}

export interface NavigationSegment {
  type: "warning" | "gradient" | "eco";
  message: string;
}

export interface NavigationInfo {
  nextDestination: string;
  eta: string;
  distanceRemaining: string;
  segments: NavigationSegment[];
}

export interface ExplorationRecord {
  totalDistance: number;
  totalDuration: string;
  visitedSites: number;
  carbonReduction: number;
  carbonEquivalent: string;
  rewards: {
    completion: number;
    firstVisit: number;
    total: number;
  };
  badge: {
    name: string;
    iconType: string;
  };
}

export interface BadgeInfo {
  name: string;
  iconType: string;
}

export interface ProfileRecordItem {
  title: string;
  date: string;
  point: string;
}

export interface UserProfile {
  name: string;
  role: string;
  totalCarbonReduction: number;
  carbonEquivalent: string;
  totalVisitedSites: number;
  totalPoints: number;
  badges: BadgeInfo[];
  recentRecords: ProfileRecordItem[];
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    username: string;
    name: string;
  };
  token?: string;
}

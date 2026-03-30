import { API_CONFIG } from "../config";
import { CourseRecommendation, NavigationInfo, ExplorationRecord, UserProfile, AuthResponse } from "../types";

export const getCourseRecommendation = async (mood: string, time: string, difficulty: string): Promise<CourseRecommendation> => {
  const params = new URLSearchParams({ mood, time, difficulty });
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/course-recommendation?${params.toString()}`);
  return res.json();
};

export const getNavigationInfo = async (courseId: string): Promise<NavigationInfo> => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/navigation-info/${courseId}`);
  return res.json();
};

export const getExplorationRecord = async (recordId: string): Promise<ExplorationRecord> => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/exploration-record/${recordId}`);
  return res.json();
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/user/${userId}/profile`);
  return res.json();
};

export const login = async (id: string, pw: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, pw })
  });
  return res.json();
};

export const signup = async (id: string, pw: string, name: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, pw, name })
  });
  return res.json();
};

export const logout = async (): Promise<AuthResponse> => {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/auth/logout`, {
    method: "POST"
  });
  return res.json();
};

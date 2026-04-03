

import axios from "axios";
import { API_CONFIG } from "../config";
import { CourseRecommendation, NavigationInfo, ExplorationRecord, UserProfile, AuthResponse } from "../types";
import { AuthApi, Configuration, MemberPreferenceApi, CourseApi, MemberApi } from "@/api";
import { CourseResponse } from "@/api";

const axiosInstance = axios.create();

// 401 에러(인증 만료) 처리 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const config = new Configuration({
  basePath: API_CONFIG.BASE_URL,
  accessToken: () => localStorage.getItem("accessToken") || "",
});

const authApi = new AuthApi(config, undefined, axiosInstance);
const preferenceApi = new MemberPreferenceApi(config, undefined, axiosInstance);
const courseApi = new CourseApi(config, undefined, axiosInstance);
const memberApi = new MemberApi(config, undefined, axiosInstance);

export const completeExploration = async (data: any) => {
  try {
    const response = await courseApi.completeExploration(data);
    return response.data.data; // CourseRecordResultResponse
  } catch (error: any) {
    console.error("Course completion failed:", error);
    throw error;
  }
};

export const getMyPage = async () => {
  try {
    const response = await memberApi.getMyPage();
    return response.data.data; // MyPageResponse
  } catch (error: any) {
    console.error("Getting MyPage failed:", error);
    throw error;
  }
};

export const recommendCourse = async (
  data: any
): Promise<CourseResponse[]> => {
  try {
    const response = await courseApi.recommend(data);
  return (response.data.data ?? []) as CourseResponse[];  } catch (error) {
    console.error("Course recommendation failed:", error);
    throw error;
  }
};

export const getCourseDetail = async (courseId: number) => {
  const res = await courseApi.getCourseDetail(courseId);
  return res.data.data;
};

export const getCourseStopInfo = async (courseId: number, stopOrder: number) => {
  try {
    const response = await courseApi.getCourseStopInfo(courseId, stopOrder);
    return response.data.data; // CourseExploreResponse
  } catch (error: any) {
    console.error("Getting stop info failed:", error);
    throw error;
  }
};

export const savePreference = async (data: any) => {
  try {
    const response = await preferenceApi.savePreference(data);
    return {
      success: response.data.status === 200 || response.data.status === undefined,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "취향 저장에 실패했습니다.",
    };
  }
};

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

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await authApi.login({ email, password });
    const apiRes = response.data;
    
    return {
      success: apiRes.status === 200 || apiRes.status === undefined,
      message: apiRes.message,
      accessToken: apiRes.data?.accessToken,
      refreshToken: apiRes.data?.refreshToken,
      tokenType: apiRes.data?.tokenType,
      expiresIn: apiRes.data?.accessTokenExpiresIn,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "로그인에 실패했습니다.",
    };
  }
};

export const signup = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    const response = await authApi.signUp({ email, password, name });
    const apiRes = response.data;
    
    return {
      success: apiRes.status === 200 || apiRes.status === undefined,
      message: apiRes.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "회원가입에 실패했습니다.",
    };
  }
};

export const logout = async (): Promise<AuthResponse> => {
  try {
    const response = await authApi.logout();
    const apiRes = response.data;
    
    return {
      success: apiRes.status === 200 || apiRes.status === undefined,
      message: apiRes.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "로그아웃에 실패했습니다.",
    };
  }
};

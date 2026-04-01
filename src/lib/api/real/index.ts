import { API_CONFIG } from "../config";
import { CourseRecommendation, NavigationInfo, ExplorationRecord, UserProfile, AuthResponse } from "../types";
import { AuthApi, Configuration, MemberPreferenceApi, CourseApi } from "@/generated/api";

const config = new Configuration({
  basePath: API_CONFIG.BASE_URL,
  accessToken: () => localStorage.getItem("accessToken") || "",
});

const authApi = new AuthApi(config);
const preferenceApi = new MemberPreferenceApi(config);
const courseApi = new CourseApi(config);

export const recommendCourse = async (data: any) => {
  try {
    const response = await courseApi.recommend(data);
    return response.data.data; // CourseResponse
  } catch (error: any) {
    console.error("Course recommendation failed:", error);
    throw error;
  }
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

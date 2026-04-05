import { API_CONFIG } from "./config";
import * as mockApi from "./mock/index";
import * as realApi from "./real/index";
import { CourseRecommendation, NavigationInfo, ExplorationRecord, UserProfile, AuthResponse } from "./types";

export const savePreference = async (data: any): Promise<{ success: boolean; message?: string }> => {
  return realApi.savePreference(data);
};

export const recommendCourse = async (data: any) => {
  return realApi.recommendCourse(data);
};

export const getCourseStopInfo = async (courseId: number, stopOrder: number) => {
  return realApi.getCourseStopInfo(courseId, stopOrder);
};

export const completeExploration = async (data: any) => {
  return realApi.completeExploration(data);
};

export const getMyPage = async () => {
  return realApi.getMyPage();
};

export const getCourseRecommendation = async (mood: string, time: string, difficulty: string): Promise<CourseRecommendation> => {
  return API_CONFIG.USE_MOCK 
    ? mockApi.getCourseRecommendation(mood, time, difficulty)
    : realApi.getCourseRecommendation(mood, time, difficulty);
};
export const getCourseDetail = async (courseId: number) => {
  return realApi.getCourseDetail(courseId);
};
export const getNavigationInfo = async (courseId: string): Promise<NavigationInfo> => {
  return API_CONFIG.USE_MOCK 
    ? mockApi.getNavigationInfo(courseId)
    : realApi.getNavigationInfo(courseId);
};

export const getExplorationRecord = async (recordId: string): Promise<ExplorationRecord> => {
  return API_CONFIG.USE_MOCK 
    ? mockApi.getExplorationRecord(recordId)
    : realApi.getExplorationRecord(recordId);
};

export const getExploreRecordResult = async (recordId: number) => {
  return realApi.getExploreRecordResult(recordId);
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  return API_CONFIG.USE_MOCK 
    ? mockApi.getUserProfile(userId)
    : realApi.getUserProfile(userId);
};

export const login = async (id: string, pw: string): Promise<AuthResponse> => {
  return realApi.login(id, pw);
};

export const signup = async (id: string, pw: string, name: string): Promise<AuthResponse> => {
  return realApi.signup(id, pw, name);
};

export const checkEmail = async (email: string): Promise<AuthResponse> => {
  return realApi.checkEmail(email);
};

export const logout = async (): Promise<AuthResponse> => {
  return realApi.logout();
};

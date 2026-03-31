import { API_CONFIG } from "./config";
import * as mockApi from "./mock/index";
import * as realApi from "./real/index";
import { CourseRecommendation, NavigationInfo, ExplorationRecord, UserProfile, AuthResponse } from "./types";

export const getCourseRecommendation = async (mood: string, time: string, difficulty: string): Promise<CourseRecommendation> => {
  return API_CONFIG.USE_MOCK 
    ? mockApi.getCourseRecommendation(mood, time, difficulty)
    : realApi.getCourseRecommendation(mood, time, difficulty);
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

export const logout = async (): Promise<AuthResponse> => {
  return realApi.logout();
};

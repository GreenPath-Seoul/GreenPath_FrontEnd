export const API_CONFIG = {
  // 테스트 중에는 true로 설정하여 Mock API 사용
  // 실제 서버 연동 시에는 false로 변경 (또는 환경변수로 관리)
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK_API === "false" ? false : true,
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
};

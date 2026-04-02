---
description: OpenAPI Generator를 사용해 API 최신화 워크플로우
---
1. **OpenAPI 스펙 파일 준비**
   - 프로젝트 루트(예: `c:/Users/User/.gemini/antigravity/scratch/seoul-renaissance-ride`)에 최신 `openapi.json` 파일이 있는지 확인합니다. 파일이 없으면 백엔드 팀에게 최신 스펙을 받아 저장합니다.
2. **npm 스크립트 추가**
   - `package.json`의 `scripts` 섹션에 다음 스크립트를 추가합니다:
   ```json
   "scripts": {
     "generate:api": "npx @openapitools/openapi-generator-cli generate -i openapi.json -g typescript-axios -o src/api/generated"
   }
   ```
   - 기존 `scripts`에 이미 `dev`, `build` 등이 있으니 해당 블록에 삽입합니다.
3. **타입스크립트 경로 별칭 설정**
   - `tsconfig.json`에 `paths` 옵션을 추가하거나 기존 값을 수정합니다:
   ```json
   "compilerOptions": {
     "baseUrl": ".",
     "paths": {
       "@/api/generated/*": ["src/api/generated/*"]
     }
   }
   ```
4. **API 클라이언트 재생성**
   - 터미널에서 `npm run generate:api` 를 실행합니다. 성공하면 `src/api/generated` 디렉터리에 최신 API 코드가 생성됩니다.
5. **코드에서 새 API 사용**
   - 기존에 `getExplorationRecord` 같은 함수가 없으면 `CourseApiFactory` 혹은 `CourseApiFp` 를 이용해 직접 호출합니다. 예시:
   ```tsx
   import { CourseApiFactory } from '@/api/generated';
   const api = CourseApiFactory();
   const fetchRecord = async (recordId: string) => {
     const response = await api.getCourseStopInfo(/* 적절한 파라미터 */);
     return response.data?.data;
   };
   ```
   - `page.tsx` 파일에서 `getExplorationRecord('record_123')` 호출을 위 `fetchRecord` 로 교체하고, 반환 타입을 `ApiResponseCourseRecordResultResponse` 로 명시합니다.
6. **빌드 및 테스트**
   - `npm run dev` 로 로컬 개발 서버를 실행하고 컴파일 오류가 없는지 확인합니다.
   - 브라우저에서 해당 페이지를 열어 API 호출이 정상 동작하는지 검증합니다.
7. **CI/CD 자동화**
   - CI 파이프라인에 `npm run generate:api` 를 추가해 배포 전 최신 API 클라이언트를 자동으로 생성하도록 설정합니다.

> **주의**: API 스펙이 변경될 때마다 4~6 단계를 반복해 최신 클라이언트를 반영해야 합니다.

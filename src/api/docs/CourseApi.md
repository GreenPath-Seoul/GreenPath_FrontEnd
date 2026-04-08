# CourseApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**completeExploration**](#completeexploration) | **POST** /api/v1/courses/complete | 탐방 완료 처리|
|[**getCourseDetail**](#getcoursedetail) | **GET** /api/v1/courses/{courseId} | 코스 상세 정보 조회|
|[**getCourseStopInfo**](#getcoursestopinfo) | **GET** /api/v1/courses/{courseId}/stops/{stopOrder} | 경유지 상세 정보 조회|
|[**getExploreRecordResult**](#getexplorerecordresult) | **GET** /api/v1/courses/records/{recordId} | 탐방 기록 상세 조회|
|[**getRandomCourses**](#getrandomcourses) | **GET** /api/v1/courses/random | 랜덤 코스 조회|
|[**recommend**](#recommend) | **POST** /api/v1/courses/recommend | 맞춤 코스 추천|

# **completeExploration**
> ApiResponseCourseRecordResultResponse completeExploration(courseCompleteRequest)

탐방 종료 시 주행 거리 및 방문 정보를 기록하고 포인트를 획득합니다.

### Example

```typescript
import {
    CourseApi,
    Configuration,
    CourseCompleteRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseApi(configuration);

let courseCompleteRequest: CourseCompleteRequest; //

const { status, data } = await apiInstance.completeExploration(
    courseCompleteRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseCompleteRequest** | **CourseCompleteRequest**|  | |


### Return type

**ApiResponseCourseRecordResultResponse**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCourseDetail**
> ApiResponseCourseResponse getCourseDetail()

선택한 코스에 대한 정보를 반환합니다.

### Example

```typescript
import {
    CourseApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseApi(configuration);

let courseId: number; // (default to undefined)

const { status, data } = await apiInstance.getCourseDetail(
    courseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseCourseResponse**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCourseStopInfo**
> ApiResponseCourseExploreResponse getCourseStopInfo()

탐방 중인 코스의 특정 순서 경유지 정보를 가져옵니다.

### Example

```typescript
import {
    CourseApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseApi(configuration);

let courseId: number; // (default to undefined)
let stopOrder: number; // (default to undefined)

const { status, data } = await apiInstance.getCourseStopInfo(
    courseId,
    stopOrder
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**number**] |  | defaults to undefined|
| **stopOrder** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseCourseExploreResponse**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getExploreRecordResult**
> ApiResponseCourseRecordResultResponse getExploreRecordResult()

기록 ID를 통해 과거 탐방 결과를 다시 조회합니다.

### Example

```typescript
import {
    CourseApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseApi(configuration);

let recordId: number; // (default to undefined)

const { status, data } = await apiInstance.getExploreRecordResult(
    recordId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recordId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseCourseRecordResultResponse**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRandomCourses**
> ApiResponseListCourseResponse getRandomCourses()

홈 화면용으로 C0001~C0010 중 랜덤으로 3개의 코스를 반환합니다.

### Example

```typescript
import {
    CourseApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseApi(configuration);

const { status, data } = await apiInstance.getRandomCourses();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseListCourseResponse**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recommend**
> ApiResponseListCourseResponse recommend()

분위기, 소요 시간, 난이도 등 유저 설정에 맞는 AI 추천 코스를 제안합니다.

### Example

```typescript
import {
    CourseApi,
    Configuration,
    CourseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseApi(configuration);

let courseRequest: CourseRequest; // (optional)

const { status, data } = await apiInstance.recommend(
    courseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseRequest** | **CourseRequest**|  | |


### Return type

**ApiResponseListCourseResponse**

### Authorization

[jwtAuth](../README.md#jwtAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


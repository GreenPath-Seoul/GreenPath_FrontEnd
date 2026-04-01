# CourseApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCourseStopInfo**](#getcoursestopinfo) | **GET** /api/v1/courses/{courseId}/stops/{stopOrder} | 경유지 상세 정보 조회|
|[**recommend**](#recommend) | **POST** /api/v1/courses/recommend | 맞춤 코스 추천|

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

# **recommend**
> ApiResponseCourseResponse recommend()

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

**ApiResponseCourseResponse**

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


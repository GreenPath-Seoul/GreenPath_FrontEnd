# MemberPreferenceApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**savePreference**](#savepreference) | **POST** /api/v1/members/preferences | 사용자 취향 설정/업데이트|

# **savePreference**
> ApiResponseString savePreference(courseRequest)

분위기, 소급시간, 난이도 및 좌표를 저장합니다.

### Example

```typescript
import {
    MemberPreferenceApi,
    Configuration,
    CourseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberPreferenceApi(configuration);

let courseRequest: CourseRequest; //

const { status, data } = await apiInstance.savePreference(
    courseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseRequest** | **CourseRequest**|  | |


### Return type

**ApiResponseString**

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


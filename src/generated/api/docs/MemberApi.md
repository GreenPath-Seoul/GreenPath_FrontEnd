# MemberApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getMyPage**](#getmypage) | **GET** /api/v1/members/me/mypage | 마이페이지 조회|

# **getMyPage**
> ApiResponseMyPageResponse getMyPage()

사용자의 레벨, 누적 통계, 획득 뱃지 및 최근 기록을 조회합니다.

### Example

```typescript
import {
    MemberApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberApi(configuration);

const { status, data } = await apiInstance.getMyPage();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseMyPageResponse**

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


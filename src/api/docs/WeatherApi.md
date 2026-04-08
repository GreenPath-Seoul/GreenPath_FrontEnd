# WeatherApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCurrentWeather**](#getcurrentweather) | **GET** /api/v1/weather/current | 현재 날씨 조회|

# **getCurrentWeather**
> ApiResponseWeatherResponse getCurrentWeather()

기상청에서 수집한 가장 최근의 날씨 정보를 반환합니다.

### Example

```typescript
import {
    WeatherApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WeatherApi(configuration);

const { status, data } = await apiInstance.getCurrentWeather();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseWeatherResponse**

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


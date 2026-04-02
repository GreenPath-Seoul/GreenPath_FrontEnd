# SignUpRequest

회원가입 요청 데이터

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** | 이메일 주소 | [default to undefined]
**password** | **string** | 비밀번호 (8~20자 영문, 숫자, 특수문자 포함) | [default to undefined]
**name** | **string** | 사용자 이름 | [default to undefined]

## Example

```typescript
import { SignUpRequest } from './api';

const instance: SignUpRequest = {
    email,
    password,
    name,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

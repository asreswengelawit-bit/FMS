package com.company.fms.shared;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice(basePackages = "com.company.fms")
public class ApiResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return returnType.hasMethodAnnotation(org.springframework.web.bind.annotation.ResponseBody.class)
                || returnType.getContainingClass().isAnnotationPresent(org.springframework.web.bind.annotation.RestController.class)
                || (returnType.getMethod() != null
                        && returnType.getMethod().isAnnotationPresent(org.springframework.web.bind.annotation.ResponseBody.class));
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request, ServerHttpResponse response) {
        if (body instanceof ApiResponse<?> || body == null) {
            return body;
        }
        return ApiResponse.success("OK", body);
    }
}

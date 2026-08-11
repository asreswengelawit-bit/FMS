package com.company.hrm.shared.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;

public final class MapperUtils {

    private MapperUtils() {
    }

    public static <S, T> T map(S source, Class<T> targetType) {
        if (source == null) {
            return null;
        }
        T target = instantiate(targetType);
        BeanUtils.copyProperties(source, target);
        return target;
    }

    public static <S, T> void copy(S source, T target) {
        if (source == null || target == null) {
            return;
        }
        BeanUtils.copyProperties(source, target);
    }

    public static <S, T> List<T> mapList(List<S> sourceList, Class<T> targetType) {
        if (sourceList == null || sourceList.isEmpty()) {
            return new ArrayList<>();
        }

        List<T> targetList = new ArrayList<>(sourceList.size());
        for (S source : sourceList) {
            targetList.add(map(source, targetType));
        }
        return targetList;
    }

    private static <T> T instantiate(Class<T> targetType) {
        try {
            return targetType.getDeclaredConstructor().newInstance();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to instantiate target type: " + targetType.getName(), ex);
        }
    }
}

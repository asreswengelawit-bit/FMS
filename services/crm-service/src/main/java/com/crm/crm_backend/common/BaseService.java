package com.crm.crm_backend.common;

// common/BaseService.java

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public abstract class BaseService<T, ID> {

    protected abstract JpaRepository<T, ID> getRepository();

    @Transactional(readOnly = true)
    public List<T> findAll() {
        return getRepository().findAll();
    }

    @Transactional(readOnly = true)
    public Optional<T> findById(ID id) {
        return getRepository().findById(id);
    }

    @Transactional
    public T save(T entity) {
        return getRepository().save(entity);
    }

    @Transactional
    public void deleteById(ID id) {
        getRepository().deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsById(ID id) {
        return getRepository().existsById(id);
    }
}
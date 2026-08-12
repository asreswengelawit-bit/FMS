package com.company.mms.warehouse;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface WarehouseRepository extends JpaRepository<Warehouse, String> {

    List<Warehouse> findAllByOrderByNameAsc();

    List<Warehouse> findByActiveOrderByNameAsc(boolean active);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT warehouse FROM Warehouse warehouse WHERE warehouse.id = :id")
    java.util.Optional<Warehouse> findForUpdateById(@Param("id") String id);

    @Query(value = """
            SELECT COALESCE(SUM(i.on_hand), 0)
            FROM inventory i
            WHERE i.warehouse_id = :warehouseId
            """, nativeQuery = true)
    BigDecimal calculateUsedCapacity(@Param("warehouseId") String warehouseId);

    @Query(value = """
            SELECT COUNT(*)
            FROM inventory i
            WHERE i.warehouse_id = :warehouseId
            """, nativeQuery = true)
    long countInventoryItems(@Param("warehouseId") String warehouseId);
}

package com.company.mms.inventory;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findAllByOrderByWarehouseIdAscMaterialIdAsc();

    List<Inventory> findByWarehouseIdOrderByMaterialIdAsc(String warehouseId);

    List<Inventory> findByMaterialIdOrderByWarehouseIdAsc(String materialId);

    Optional<Inventory> findByMaterialIdAndWarehouseId(String materialId, String warehouseId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT inventory
            FROM Inventory inventory
            WHERE inventory.materialId = :materialId
              AND inventory.warehouseId = :warehouseId
            """)
    Optional<Inventory> findForUpdate(
            @Param("materialId") String materialId,
            @Param("warehouseId") String warehouseId);

    @Query("""
            SELECT COALESCE(SUM(inventory.onHand), 0)
            FROM Inventory inventory
            WHERE inventory.warehouseId = :warehouseId
            """)
    BigDecimal calculateOnHandByWarehouse(@Param("warehouseId") String warehouseId);
}

package com.company.mms.stockmovement;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockMovementRepository extends JpaRepository<StockMovement, String> {

    @Query("""
            SELECT movement
            FROM StockMovement movement
            WHERE (:warehouseId IS NULL OR movement.warehouseId = :warehouseId)
              AND (:materialId IS NULL OR movement.materialId = :materialId)
              AND (:type IS NULL OR movement.type = :type)
            ORDER BY movement.movementDate DESC, movement.createdAt DESC
            """)
    List<StockMovement> search(
            @Param("warehouseId") String warehouseId,
            @Param("materialId") String materialId,
            @Param("type") String type);
}

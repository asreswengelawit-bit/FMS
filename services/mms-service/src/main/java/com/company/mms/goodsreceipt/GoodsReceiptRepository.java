package com.company.mms.goodsreceipt;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GoodsReceiptRepository extends JpaRepository<GoodsReceipt, String> {

    @Query("SELECT g FROM GoodsReceipt g WHERE "
            + "(:warehouseId IS NULL OR g.warehouseId = :warehouseId) AND "
            + "(:poRef IS NULL OR LOWER(g.purchaseOrderReference) LIKE LOWER(CONCAT('%', :poRef, '%'))) "
            + "ORDER BY g.createdAt DESC")
    List<GoodsReceipt> search(
            @Param("warehouseId") String warehouseId,
            @Param("poRef") String poRef);
}

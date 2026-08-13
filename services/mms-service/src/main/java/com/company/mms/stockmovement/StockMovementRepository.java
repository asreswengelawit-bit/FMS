package com.company.mms.stockmovement;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, String> {
}

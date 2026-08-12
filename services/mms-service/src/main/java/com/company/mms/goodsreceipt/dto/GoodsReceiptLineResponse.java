package com.company.mms.goodsreceipt.dto;

import java.math.BigDecimal;

public record GoodsReceiptLineResponse(
        Long id,
        String materialId,
        String materialName,
        BigDecimal quantity,
        BigDecimal unitCost
) {
}

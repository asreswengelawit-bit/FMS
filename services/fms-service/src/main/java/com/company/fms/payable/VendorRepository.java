package com.company.fms.payable;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorRepository extends JpaRepository<Vendor, String> {

    Optional<Vendor> findByVendorCode(String vendorCode);

    List<Vendor> findAllByOrderByVendorNameAsc();

    Page<Vendor> findAllByOrderByVendorNameAsc(Pageable pageable);

    Page<Vendor> findByStatusOrderByVendorNameAsc(String status, Pageable pageable);

    Page<Vendor> findByVendorNameContainingIgnoreCaseOrVendorCodeContainingIgnoreCaseOrderByVendorNameAsc(
            String name, String code, Pageable pageable);

    Page<Vendor> findByStatusAndVendorNameContainingIgnoreCaseOrStatusAndVendorCodeContainingIgnoreCaseOrderByVendorNameAsc(
            String statusName, String name, String statusCode, String code, Pageable pageable);
}

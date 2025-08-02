package com.jee.clinichub.app.purchase.vendorItemColumn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.purchase.vendorItemColumn.model.VendorItemColumn;

@Repository
public interface VendorItemColumnRepo extends JpaRepository<VendorItemColumn, Long> {

    VendorItemColumn findByVendor_id(Long id);


    void deleteAllByVendor_id(Long id);

    boolean existsByVendor_idAndIdNot(Long id, long l);
    
}

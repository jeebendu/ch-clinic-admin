package com.jee.clinichub.app.vendor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.vendor.model.Vendor;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
	Vendor findBranchByName(String name);

	boolean existsByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);

	Vendor save(Vendor vendor);

    boolean existsByGstAndIdNot(String gst, Long id);

    boolean existsByGst(String gst);

    Optional<Vendor> findByGst(String gstno);

	List<Vendor> findByGstIn(List<String> gstNumbers);



}
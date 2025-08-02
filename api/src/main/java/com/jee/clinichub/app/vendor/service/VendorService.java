package com.jee.clinichub.app.vendor.service;

import java.util.List;

import com.jee.clinichub.app.vendor.model.Vendor;
import com.jee.clinichub.app.vendor.model.VendorDto;
import com.jee.clinichub.global.model.Status;

public interface VendorService {
	
	//Vendor findByName(String name);

	VendorDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(VendorDto Branch);

	List<VendorDto> getAllVendors();

	Vendor getVendorById(Long id);

	
    VendorDto findByGst(String gst);
}

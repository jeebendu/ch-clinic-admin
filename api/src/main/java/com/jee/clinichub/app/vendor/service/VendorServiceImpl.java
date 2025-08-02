package com.jee.clinichub.app.vendor.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.purchase.order.model.PurchaseOrderDto;
import com.jee.clinichub.app.vendor.model.Vendor;
import com.jee.clinichub.app.vendor.model.VendorDto;
import com.jee.clinichub.app.vendor.repository.VendorRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;

@Service(value = "vendorService")
public class VendorServiceImpl implements VendorService {
	
	private static final Logger log = LoggerFactory.getLogger(VendorServiceImpl.class);

    @Autowired
    private VendorRepository vendorRepository;
    
	@Override
	public Status saveOrUpdate(VendorDto vendorDto) {
		try{
			
			boolean isExistName = (vendorDto.getId()==null) ? vendorRepository.existsByGst(vendorDto.getGst()): vendorRepository.existsByGstAndIdNot(vendorDto.getGst(),vendorDto.getId());
			//boolean isExistCode = (vendorDto.getId()==null) ? vendorRepository.existsByCode(vendorDto.getCode()): vendorRepository.existsByCodeAndIdNot(vendorDto.getCode(),vendorDto.getId());
			
			if(isExistName){return new Status(false,"Distributor already exist");
	    	}
			//else if(isExistCode){return new Status(false,"Vendor Code already exist");}
			
			Vendor vendor = new Vendor();
			
			if(vendorDto.getId()==null) {
				vendor = new Vendor(vendorDto);
			}else{
				vendor = this.setVendor(vendorDto);
			}
			
			vendor = vendorRepository.save(vendor);
			return new Status(true,( (vendorDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private Vendor setVendor(VendorDto vendorDto) {
    	Vendor exVendor = vendorRepository.findById(vendorDto.getId()).get();
    	exVendor.setName(vendorDto.getName());
    	exVendor.setContact(vendorDto.getContact());
    	exVendor.setAddress(vendorDto.getAddress());
    	exVendor.setGst(vendorDto.getGst());
		return exVendor;
	}

	@Override
  	public List<VendorDto> getAllVendors() {
    	List<Vendor> vendorList = vendorRepository.findAll();
    	List<VendorDto> vendorDtoList = vendorList.stream().map(VendorDto::new).collect(Collectors.toList());
  		return vendorDtoList;
  	}

   
    
	@Override
	@Cacheable(value = "vendorCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public VendorDto getById(Long id) {
		VendorDto vendorDto = new VendorDto();
		try{
			Optional<Vendor> vendor = vendorRepository.findById(id);
			if(vendor.isPresent()){
				vendorDto = new VendorDto(vendor.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return vendorDto;
	}
	
	@Override
	@Cacheable(value = "vendorCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public Vendor getVendorById(Long id) {
		Vendor vendor = new Vendor();
		try{
			Optional<Vendor> _vendor = vendorRepository.findById(id);
			if(_vendor.isPresent()){
				vendor = _vendor.get();
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return vendor;
	}
	
	

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<Vendor> vendor = vendorRepository.findById(id);
			if(!vendor.isPresent()){
				return new Status(false,"Distributor Not Found");
			}
			
			vendorRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	
	@Override
	public VendorDto findByGst(String gstno) {
		    return vendorRepository.findByGst(gstno).map(VendorDto::new)
    .orElseThrow(() -> new EntityNotFoundException("Distributor not found with ID: " + gstno));

	}
	
}

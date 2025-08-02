package com.jee.clinichub.app.catalog.type.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.catalog.type.model.ProductType;
import com.jee.clinichub.app.catalog.type.model.ProductTypeDto;
import com.jee.clinichub.app.catalog.type.repository.ProductTypeRepository;
import com.jee.clinichub.global.model.Status;

@Service(value = "productTypeService")
public class ProductTypeServiceImpl implements ProductTypeService {
	
	private static final Logger log = LoggerFactory.getLogger(ProductTypeServiceImpl.class);

    @Autowired
    private ProductTypeRepository productTypeRepository;
    
	@Override
	public Status saveOrUpdate(ProductTypeDto productTypeDto) {
		try{
			
			boolean isExistName = (productTypeDto.getId()==null) ? productTypeRepository.existsByName(productTypeDto.getName()): productTypeRepository.existsByNameAndIdNot(productTypeDto.getName(),productTypeDto.getId());
			
			if(isExistName){return new Status(false,"ProductType Name already exist");
	    	}
			
			ProductType productType = new ProductType();
			
			if(productTypeDto.getId()==null) {
				productType = new ProductType(productTypeDto);
			}else{
				productType = this.setProductType(productTypeDto);
			}
			
			productType = productTypeRepository.save(productType);
			return new Status(true,( (productTypeDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private ProductType setProductType(ProductTypeDto productTypeDto) {
    	ProductType exProductType = productTypeRepository.findById(productTypeDto.getId()).get();
    	exProductType.setName(productTypeDto.getName());
		return exProductType;
		
	}

	@Override
  	public List<ProductTypeDto> getAllProductTypes() {
    	List<ProductType> productTypeList = productTypeRepository.findByOrderByNameAsc();
    	List<ProductTypeDto> productTypeDtoList = productTypeList.stream().map(ProductTypeDto::new).collect(Collectors.toList());
  		return productTypeDtoList;
  	}

    @Override
    public ProductType findByName(String name) {
        ProductType productType = productTypeRepository.findProductTypeByName(name);
        return productType;
    }
    
    
	@Override
	public ProductTypeDto getById(Long id) {
		ProductTypeDto productTypeDto = new ProductTypeDto();
		try{
			Optional<ProductType> productType = productTypeRepository.findById(id);
			if(productType.isPresent()){
				productTypeDto = new ProductTypeDto(productType.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return productTypeDto;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<ProductType> productType = productTypeRepository.findById(id);
			if(!productType.isPresent()){
				return new Status(false,"ProductType Not Found");
			}
			
			productTypeRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	

	
}

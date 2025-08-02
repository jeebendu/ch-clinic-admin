package com.jee.clinichub.app.occTherapist.otSubCategory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.global.model.Status;


@Service(value = "OtSubcategoryService")
public class OtSubCategoryServiceImpl implements OtSubCategoryService {
	
	private static final Logger log = LoggerFactory.getLogger(OtSubCategoryServiceImpl.class);

    @Autowired
    private OtSubCategoryRepository otSubCategoryRepository;

	
	@Override
	@Cacheable(value = "categoryCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public OtSubCategoryDto getById(Long id) {
		OtSubCategoryDto categoryDto = new OtSubCategoryDto();
		try{
			Optional<OtSubCategory> category = otSubCategoryRepository.findById(id);
			if(category.isPresent()){
				categoryDto = new OtSubCategoryDto(category.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return categoryDto;
	}


	@Override
  	public List<OtSubCategoryDto> getAllOtSubCategorys() {
    	List<OtSubCategory> otSubCategoryList = otSubCategoryRepository.findAll();
    	List<OtSubCategoryDto> otSubCategoryDtoList = otSubCategoryList.stream().map(OtSubCategoryDto::new).collect(Collectors.toList());
  		return otSubCategoryDtoList;
  	}


	@Override
	public List<OtSubCategoryDto> getByCategoryId(Long id) {
		List<OtSubCategory> otSubCategoryList = otSubCategoryRepository.findAllByCategory_id(id);
		List<OtSubCategoryDto> otSubCategoryDtoList = otSubCategoryList.stream().map(OtSubCategoryDto::new).collect(Collectors.toList());
  		return otSubCategoryDtoList;
	}
	

}
	
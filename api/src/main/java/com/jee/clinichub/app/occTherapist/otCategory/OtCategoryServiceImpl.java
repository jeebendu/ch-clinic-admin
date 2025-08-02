package com.jee.clinichub.app.occTherapist.otCategory;

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


@Service(value = "OtcategoryService")
public class OtCategoryServiceImpl implements OtCategoryService {
	
	private static final Logger log = LoggerFactory.getLogger(OtCategoryServiceImpl.class);

    @Autowired
    private OtCategoryRepository otCategoryRepository;

	
	@Override
	@Cacheable(value = "categoryCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public OtCategoryDto getById(Long id) {
		OtCategoryDto categoryDto = new OtCategoryDto();
		try{
			Optional<OtCategory> category = otCategoryRepository.findById(id);
			if(category.isPresent()){
				categoryDto = new OtCategoryDto(category.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return categoryDto;
	}


	@Override
  	public List<OtCategoryDto> getAllOtCategorys() {
    	List<OtCategory> otCategoryList = otCategoryRepository.findAll();
    	List<OtCategoryDto> otCategoryDtoList = otCategoryList.stream().map(OtCategoryDto::new).collect(Collectors.toList());
  		return otCategoryDtoList;
  	}
	






}
	
package com.jee.clinichub.app.occTherapist.otCheckList;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.occTherapist.otSubCategory.OtSubCategory;
import com.jee.clinichub.app.occTherapist.otSubCategory.OtSubCategoryDto;
import com.jee.clinichub.global.model.Status;


@Service(value = "OtCheckListService")
public class OtCheckListServiceImpl implements OtCheckListService {
	
	private static final Logger log = LoggerFactory.getLogger(OtCheckListServiceImpl.class);

    @Autowired
    private OtCheckListRepository otCheckListRepository;

	
	@Override
	@Cacheable(value = "categoryCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public OtCheckListDto getById(Long id) {
		OtCheckListDto categoryDto = new OtCheckListDto();
		try{
			Optional<OtCheckList> category = otCheckListRepository.findById(id);
			if(category.isPresent()){
				categoryDto = new OtCheckListDto(category.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return categoryDto;
	}


	@Override
  	public List<OtCheckListDto> getAllOtCheckList() {
    	List<OtCheckList> otCheckListList = otCheckListRepository.findAll();
    	List<OtCheckListDto> otCheckListDtoList = otCheckListList.stream().map(OtCheckListDto::new).collect(Collectors.toList());
  		return otCheckListDtoList;
  	}
	
	@Override
  	public List<OtCheckListDto> getAllOtCheckLists() {
    	List<OtCheckList> otCheckListList = otCheckListRepository.findAll();
    	List<OtCheckListDto> otCheckListDtoList = otCheckListList.stream().map(OtCheckListDto::new).collect(Collectors.toList());
  		return otCheckListDtoList;
  	}


	@Override
	public List<OtCheckListDto> getBySubCategoryId(Long id) {
		List<OtCheckList> otCheskList = otCheckListRepository.findAllBySubcategory_id(id);
		List<OtCheckListDto> otCheskListDtoList = otCheskList.stream().map(OtCheckListDto::new).collect(Collectors.toList());
  		
		return otCheskListDtoList;
	}

	


}
	
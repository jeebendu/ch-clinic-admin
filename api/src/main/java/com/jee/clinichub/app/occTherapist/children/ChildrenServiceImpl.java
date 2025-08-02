package com.jee.clinichub.app.occTherapist.children;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.core.mail.smtp.service.SmtpServiceImpl;
import com.jee.clinichub.app.occTherapist.ChildrenReport.ChildrenReport;
import com.jee.clinichub.app.occTherapist.otCategory.OtCategory;
import com.jee.clinichub.app.occTherapist.otCategory.OtCategoryDto;
import com.jee.clinichub.app.occTherapist.otCategory.OtCategoryRepository;
import com.jee.clinichub.app.occTherapist.otCheckList.OtCheckList;
import com.jee.clinichub.app.occTherapist.otCheckList.OtCheckListDto;
import com.jee.clinichub.app.occTherapist.otCheckList.OtCheckListRepository;
import com.jee.clinichub.app.occTherapist.otChildrenChecklistMap.OtChildrenCheckListMapDto;
import com.jee.clinichub.app.occTherapist.otChildrenChecklistMap.OtChildrenChecklistMap;
import com.jee.clinichub.app.occTherapist.otChildrenChecklistMap.OtChildrenChecklistMapRepository;
import com.jee.clinichub.app.occTherapist.otSubCategory.OtSubCategory;
import com.jee.clinichub.app.occTherapist.otSubCategory.OtSubCategoryDto;
import com.jee.clinichub.global.model.Status;


@Log4j2
@Service(value = "childrenService")
public class ChildrenServiceImpl implements ChildrenService {
	

    @Autowired
    private ChildrenRepository childrenRepository;
    
    @Autowired
    private OtCheckListRepository otCheckListRepository;
    
    @Autowired
    private OtCategoryRepository otCategoryRepository ;
    
    @Autowired
    private OtChildrenChecklistMapRepository otChildrenChecklistMapRepository ;
    
	@Override
	@Cacheable(value = "childrenCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public ChildrenDto getById(Long id) {
		ChildrenDto childrenDto = new ChildrenDto();
		try{
			Optional<Children> children = childrenRepository.findById(id);
			if(children.isPresent()){
				childrenDto = new ChildrenDto(children.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return childrenDto;
	}
	
	@Override
	public ChildrenReport getCategory(Long childrenId) {
		List<OtCategoryDto> oDtosList = new ArrayList<OtCategoryDto>();
	
		
		List<OtCategory> otCategoryList = otCategoryRepository.findAll();
	   oDtosList = otCategoryList.stream().map(OtCategoryDto::new).collect(Collectors.toList());
	 
	   Children children = childrenRepository.findById(childrenId).get();
	   ChildrenDto childrenDto = new ChildrenDto(children);
	   
	   
	   
	   oDtosList.forEach((c) -> {
		   List<String> subcategoryDateList = new ArrayList<String>();
		  
		   
		 	c.getSubCategoryDtoList().forEach((s) -> {
		   		OtChildrenChecklistMap childrenChecklistMapList = otChildrenChecklistMapRepository.findTop1ByChildren_idAndChecklist_subcategory_idOrderByDateDesc(childrenId ,s.getId());		  	  
		   		if (childrenChecklistMapList != null) {
		   			
		   		Date developmentAge= childrenChecklistMapList.getDate();
		   		Date dob = children.getDob();
		   		long actualDevAge= developmentAge.getTime()-dob.getTime();
		   		long diffInDays = TimeUnit.MILLISECONDS.toDays(actualDevAge);
		   		int diffInDaysint=(int)diffInDays;  
		   		int intdiffInYear = diffInDaysint/365;
		   		int intdiffInMonth = (diffInDaysint%365)/30;
		   		log.info(intdiffInYear);
		   		log.info(intdiffInMonth);
		   		s.setTimeline(Integer.toString(intdiffInYear)+Integer.toString(intdiffInMonth));
		   		subcategoryDateList.add(s.getTimeline());
		   		
		   		}
		   		
		   	});
		   
		 	List<String> subcategoryDateSorted = subcategoryDateList.stream().sorted(Collections.reverseOrder()).collect(Collectors.toList());
		   if (subcategoryDateSorted.size()!=0) {
		   	c.setTimeline(subcategoryDateSorted.get(0));
		   }
		  
		   });
	   //oDtosList.forEach((c) -> c.getSubCategoryDtoList().forEach((s) -> s.setTimeline("1 year 2 Month")));
	   
	   
	   ChildrenReport childrenReport = new ChildrenReport();
	   childrenReport.setCategoryList(oDtosList);
	   childrenReport.setChildren(childrenDto);
	   
		return  childrenReport;
	}
	
	@Override
	public ChildrenDto getByChildrenMapping(Long childrenId, Long subcatId) {
		
		ChildrenDto childrenDto =new ChildrenDto(); 
		Optional<Children> childrenO =  childrenRepository.findById(childrenId);
		if(childrenO.isPresent()){
			Children children =childrenO.get();
			
			childrenDto = new ChildrenDto(children.getFirstName() , children.getLastName() , children.getOtChildrenChecklistMaps());
		}
		
		
		List<OtCheckList> otCheskList = otCheckListRepository.findAllBySubcategory_id(subcatId); //12
		childrenDto.getChildrenCheckListMap();//8
		
		List<OtChildrenCheckListMapDto> ccMapList = new ArrayList<OtChildrenCheckListMapDto>();   //mo tery
		
		
		for(OtCheckList ocl:otCheskList) {
			
			OtChildrenCheckListMapDto ccm = new OtChildrenCheckListMapDto();   //white jari
			
			for (OtChildrenCheckListMapDto childrenMap:childrenDto.getChildrenCheckListMap()) {
				if (childrenMap.getChecklist().getId()==ocl.getId()) {
					ccm.setId(childrenMap.getId());
					ccm.setAchieved(childrenMap.isAchieved());
					ccm.setDate(childrenMap.getDate());
				}
			}
			
			ccm.setChecklist(new OtCheckListDto(ocl));
			ccMapList.add(ccm);
			
			
		}
		
		childrenDto.setChildrenCheckListMap(ccMapList);
		return childrenDto ;
	}

	

	@Override
  	public List<ChildrenDto> getAllChildrens() {
    	List<Children> childrenList = childrenRepository.findAll();
    	List<ChildrenDto> childrenDtoList = childrenList.stream().map(ChildrenDto::new).collect(Collectors.toList());
  		return childrenDtoList;
  	}

	
	
	public void savemapCheckListByStudentId(Long childrenId , List<OtChildrenChecklistMap> otChildrenChecklistMaps) {
		
		Children children = childrenRepository.findById(childrenId).get();
		children.setOtChildrenChecklistMaps(otChildrenChecklistMaps);
		children = childrenRepository.save(children);
		
		//List<OtChildrenChecklistMap> otChildrenChecklistMaps = new ArrayList<OtChildrenChecklistMap>();
		/*
		OtCheckList o1 = otCheckListRepository.findById(1l).get();
		OtCheckList o2 = otCheckListRepository.findById(2l).get();
		OtChildrenChecklistMap ccmap1 = new OtChildrenChecklistMap(children,o1, true , new Date());
		OtChildrenChecklistMap ccmap2 = new OtChildrenChecklistMap(children,o2, true , new Date());
		otChildrenChecklistMaps.add(ccmap1);
		otChildrenChecklistMaps.add(ccmap2);
		
		children.setOtChildrenChecklistMaps(otChildrenChecklistMaps);
		*/
		
	}

	@Override
	@CacheEvict(value="childrenCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	public Status saveByChildrenMapping(@Valid ChildrenDto childrenDto) {
		
		Children children = childrenRepository.findById(childrenDto.getId()).get();
		
		List<OtChildrenChecklistMap> otChildrenChecklistMapList = new ArrayList<OtChildrenChecklistMap>();
		
		for(OtChildrenCheckListMapDto cheChildrenChecklistMap : childrenDto.getChildrenCheckListMap()) {  //12
			
			if(cheChildrenChecklistMap.isAchieved()) {
				OtChildrenChecklistMap ccmap = new OtChildrenChecklistMap(cheChildrenChecklistMap);
				ccmap.setChildren(children);
				otChildrenChecklistMapList.add( ccmap );
			}
		}
		
		children.setOtChildrenChecklistMaps(otChildrenChecklistMapList);
		children = childrenRepository.save(children);
		return new Status(true,( (childrenDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
	}
	
	@Override
	@CacheEvict(value="childrenCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	public Status saveChildrenSummary(@Valid ChildrenDto childrenDto) {
		Children children = childrenRepository.findById(childrenDto.getId()).get();
		children.setBackground(childrenDto.getBackground());
		children.setSummary(childrenDto.getSummary());
		children.setRecomandation(childrenDto.getRecomandation());
		children = childrenRepository.save(children);
		return new Status(true,  "Updated Successfully");
	}
	
	@Override
	@CacheEvict(value="childrenCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	public Status saveOrUpdate(ChildrenDto childrenDto) {
		try{
			
			
			Children children = new Children(childrenDto);
			
			children = childrenRepository.save(children);
			
			return new Status(true,( (childrenDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}


	@Override
	@CacheEvict(value="childrenCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	public Status deleteById(Long id) {
		try{
			Optional<Children> children = childrenRepository.findById(id);
			if(!children.isPresent()){
				return new Status(false,"Children Not Found");
			}
			
			childrenRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	

	

	

	




}
	
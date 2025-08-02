package com.jee.clinichub.app.courier.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.courier.model.Courier;
import com.jee.clinichub.app.courier.model.CourierDto;
import com.jee.clinichub.app.courier.repository.CourierRepository;
import com.jee.clinichub.global.model.Status;

@Service(value = "courierService")
public class CourierServiceImpl implements CourierService {
	
	private static final Logger log = LoggerFactory.getLogger(CourierServiceImpl.class);

    @Autowired
    private CourierRepository courierRepository;
    
	@Override
	public Status saveOrUpdate(CourierDto courierDto) {
		try{
			
			boolean isExistName = (courierDto.getId()==null) ? courierRepository.existsByName(courierDto.getName()): courierRepository.existsByNameAndIdNot(courierDto.getName(),courierDto.getId());
			//boolean isExistCode = (courierDto.getId()==null) ? courierRepository.existsByCode(courierDto.getCode()): courierRepository.existsByCodeAndIdNot(courierDto.getCode(),courierDto.getId());
			
			if(isExistName){return new Status(false,"Courier Name already exist");
	    	}
			//else if(isExistCode){return new Status(false,"Courier Code already exist");}
			
			Courier courier = new Courier();
			
			if(courierDto.getId()==null) {
				courier = new Courier(courierDto);
			}else{
				courier = this.updateCourier(courierDto);
			}
			
			courier = courierRepository.save(courier);
			return new Status(true,( (courierDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private Courier updateCourier(CourierDto courierDto) {
    	Courier exCourier = courierRepository.findById(courierDto.getId()).get();
    	exCourier.setName(courierDto.getName());
    	exCourier.setWebsiteUrl(courierDto.getWebsiteUrl());
    	exCourier.setApiUrl(courierDto.getApiUrl());
		return exCourier;
		
	}

	@Override
  	public List<CourierDto> getAllCouriers() {
    	List<Courier> courierList = courierRepository.findAll();
    	List<CourierDto> courierDtoList = courierList.stream().map(CourierDto::new).collect(Collectors.toList());
  		return courierDtoList;
  	}

   
    
	@Override
	@Cacheable(value = "courierCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public CourierDto getById(Long id) {
		CourierDto courierDto = new CourierDto();
		try{
			Optional<Courier> courier = courierRepository.findById(id);
			if(courier.isPresent()){
				courierDto = new CourierDto(courier.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return courierDto;
	}
	
	@Override
	@Cacheable(value = "courierCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public Courier getCourierById(Long id) {
		Courier courier = new Courier();
		try{
			Optional<Courier> _courier = courierRepository.findById(id);
			if(_courier.isPresent()){
				courier = _courier.get();
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return courier;
	}
	
	

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<Courier> courier = courierRepository.findById(id);
			if(!courier.isPresent()){
				return new Status(false,"Courier Not Found");
			}
			
			courierRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	

	
}
